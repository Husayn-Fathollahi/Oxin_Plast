import { apiClient } from '@/lib/api-client';

export interface ContactMessagePayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

/**
 * Submits a contact form message to POST /api/v1/contact.
 * Throws on non-2xx responses.
 */
export async function submitContactMessage(
  payload: ContactMessagePayload,
): Promise<void> {
  await apiClient.post('/contact', payload);
}
