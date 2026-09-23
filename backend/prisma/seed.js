const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const bcrypt = require('bcrypt');

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const BCRYPT_ROUNDS = 12;

async function main() {
  const email = 'admin@oxinplast.ir';
  const plainPassword = 'Oxin-klMoT4bBn_uiisyusNBpXoP8vY63lbwA!';
  const passwordHash = await bcrypt.hash(plainPassword, BCRYPT_ROUNDS);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'admin',
    },
    create: {
      email,
      name: 'ظ…ط¯غŒط± ط§ع©ط³غŒظ† ظ¾ظ„ط§ط³طھ',
      passwordHash,
      role: 'admin',
    },
  });

  console.log('âœ… غŒظˆط²ط± ط§ط¯ظ…غŒظ† ط¨ط§ ظ…ظˆظپظ‚غŒطھ ط¢ظ…ط§ط¯ظ‡ ط´ط¯:');
  console.log(`ط§غŒظ…غŒظ„: ${email}`);
  console.log(`ط±ظ…ط² ط¹ط¨ظˆط±: ${plainPassword}`);
}

main()
  .catch((e) => {
    console.error('â‌Œ ط®ط·ط§:', e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
