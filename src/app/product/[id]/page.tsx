import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, findAlternatives, PRODUCTS } from '@/lib/products';
import { BRANDS, CATEGORIES } from '@/lib/brands';
import ProductDetailClient from '@/components/ProductDetailClient';

export async function generateStaticParams() {
  return Object.keys(PRODUCTS).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) return { title: 'Not found' };
  return {
    title: `${p.name} — ${BRANDS[p.brand].label} · LapizBlue Catalogue`,
    description: p.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const brand = BRANDS[product.brand];
  const category = CATEGORIES[product.category];
  const alternatives = findAlternatives(product);

  return (
    <ProductDetailClient
      product={product}
      brand={brand}
      category={category}
      alternatives={alternatives}
    />
  );
}
