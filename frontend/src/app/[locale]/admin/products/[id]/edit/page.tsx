import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { EditProductForm } from '@/features/products/components/EditProductForm';

interface EditProductPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id }, select: { name: true } });
  if (!product) return {};
  return { title: `Edit: ${product.name}` };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id, locale } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: 'asc' } } },
  });

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Product</h1>
          <p className="mt-1 text-sm text-gray-500">{product.name}</p>
        </div>
        <a
          href={`/${locale}/admin/products`}
          className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
        >
          ← Back
        </a>
      </div>

      <EditProductForm
        id={product.id}
        locale={locale}
        initial={{
          name: product.name,
          nameEn: product.nameEn ?? '',
          nameAr: product.nameAr ?? '',
          slug: product.slug,
          excerpt: product.excerpt,
          excerptEn: product.excerptEn ?? '',
          excerptAr: product.excerptAr ?? '',
          description: product.description,
          descriptionEn: product.descriptionEn ?? '',
          descriptionAr: product.descriptionAr ?? '',
          image: product.image ?? '',
          published: product.published,
          isFeatured: product.isFeatured,
          specifications: (product.specifications ?? null) as Record<string, string> | null,
          images: product.images.map((img) => ({
            id: img.id,
            url: img.url,
            isPrimary: img.isPrimary,
            sortOrder: img.sortOrder,
          })),
        }}
      />
    </div>
  );
}
