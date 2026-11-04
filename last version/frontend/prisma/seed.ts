import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.upsert({
    where: { slug: 'sample-tank' },
    update: {},
    create: {
      name: 'Makhzan 1000L',
      slug: 'sample-tank',
      excerpt: 'Sample polyethylene tank',
      description: 'High quality polyethylene tank description',
      published: true,
      isFeatured: true
    }
  });
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
