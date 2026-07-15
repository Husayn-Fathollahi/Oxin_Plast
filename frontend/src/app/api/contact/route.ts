import { NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

// ── Simple in-memory rate limiter ─────────────────────────────────────────────
// 5 submissions per IP per 10-minute window. Resets on server restart.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

interface RateEntry { count: number; resetAt: number }
const rateLimitMap = new Map<string, RateEntry>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

// ── Zod schema ─────────────────────────────────────────────────────────────────
const ContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'نام باید حداقل ۲ کاراکتر باشد')
    .max(100, 'نام نباید بیشتر از ۱۰۰ کاراکتر باشد'),
  email: z
    .string()
    .trim()
    .email('آدرس ایمیل معتبر نیست')
    .optional()
    .or(z.literal('')),

  phone: z
    .string()
    .trim()
    .min(1, 'شماره تلفن الزامی است')
    .max(20, 'شماره تلفن نباید بیشتر از ۲۰ کاراکتر باشد'),
  subject: z.string().trim().max(200).optional().or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(10, 'پیام باید حداقل ۱۰ کاراکتر باشد')
    .max(1000, 'پیام نباید بیشتر از ۱۰۰۰ کاراکتر باشد'),
  // Honeypot — must be absent or empty; bots fill it in
  _hp: z.string().optional(),
});

// ── Email transport ────────────────────────────────────────────────────────────
function createTransport() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT ?? '587', 10),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
}

async function sendAdminNotification(data: {
  name: string;
  email?: string;
  phone: string;
  subject?: string;
  message: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !process.env.MAIL_HOST || !process.env.MAIL_USER) {
    console.warn('[contact] Email env vars not configured — skipping notification.');
    return;
  }

  const transporter = createTransport();
  const subjectLine = data.subject
    ? `پیام جدید: ${data.subject}`
    : `پیام جدید از ${data.name}`;

  await transporter.sendMail({
    from: process.env.MAIL_FROM ?? process.env.MAIL_USER,
    to: adminEmail,
    subject: subjectLine,
    text: [
      `نام: ${data.name}`,
      `ایمیل: ${data.email || 'ارائه نشده'}`,
      `تلفن: ${data.phone}`,
      data.subject ? `موضوع: ${data.subject}` : '',
      '',
      `پیام:`,
      data.message,
    ]
      .filter(Boolean)
      .join('\n'),
    html: `
      <div dir="rtl" style="font-family:sans-serif;max-width:600px">
        <h2 style="color:#1d4ed8">پیام جدید از فرم تماس</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold;background:#f1f5f9">نام</td><td style="padding:8px">${data.name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;background:#f1f5f9">ایمیل</td><td style="padding:8px">${data.email ? `<a href="mailto:${data.email}">${data.email}</a>` : 'ارائه نشده'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;background:#f1f5f9">تلفن</td><td style="padding:8px"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
          ${data.subject ? `<tr><td style="padding:8px;font-weight:bold;background:#f1f5f9">موضوع</td><td style="padding:8px">${data.subject}</td></tr>` : ''}
        </table>
        <div style="margin-top:16px;padding:16px;background:#f8fafc;border-radius:8px;white-space:pre-wrap">${data.message}</div>
      </div>
    `,
  });
}

export async function POST(request: Request) {
  // ── Rate limiting ─────────────────────────────────────────────────────────
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, errors: { server: 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی صبر کنید.' } },
      { status: 429 },
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, errors: { server: 'درخواست نامعتبر است' } },
      { status: 400 },
    );
  }

  // ── Honeypot check ────────────────────────────────────────────────────────
  // If the hidden _hp field is filled, the submitter is very likely a bot.
  // Return a convincing 201 without actually persisting anything.
  if (typeof rawBody === 'object' && rawBody !== null && '_hp' in rawBody) {
    const hp = (rawBody as Record<string, unknown>)['_hp'];
    if (typeof hp === 'string' && hp.trim() !== '') {
      return NextResponse.json({ success: true, message: 'Message received' }, { status: 201 });
    }
  }

  // ── Validation ────────────────────────────────────────────────────────────
  const parsed = ContactSchema.safeParse(rawBody);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? 'server');
      if (!errors[field]) errors[field] = issue.message;
    }
    return NextResponse.json({ success: false, errors }, { status: 400 });
  }

  const { name, email, phone, subject, message } = parsed.data;
  const emailValue = email && email.length > 0 ? email : null;

  // ── Persist to database ───────────────────────────────────────────────────
  try {
    await prisma.message.create({
      data: {
        name,
        email: emailValue,
        phone: phone || null,
        subject: subject || null,
        message,
      },
    });
  } catch (err) {
    console.error('Failed to save message:', err);
    return NextResponse.json(
      { success: false, errors: { server: 'Failed to save message' } },
      { status: 500 },
    );
  }

  // ── Send admin email notification (non-blocking) ──────────────────────────
  sendAdminNotification({ name, email: emailValue ?? undefined, phone, subject, message }).catch((err) =>
    console.error('[contact] Failed to send admin email:', err),
  );

  return NextResponse.json(
    { success: true, message: 'Message received' },
    { status: 201 },
  );
}
