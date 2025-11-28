import TrendingSection from '@/components/TrendingSection';
import CategorySection from '@/components/CategorySection';
import HeroSection from '@/components/HeroSection';
import ServiceHighlights from '@/components/ServiceHighlights';
import Newsletter from '@/components/Newsletter';
import DealBanner from '@/components/DealBanner';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();

  // Fetch trending products (simulated by taking first 4)
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .limit(4);

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, image_url');

  // Fetch category names for products
  const { data: allCategories } = await supabase.from('categories').select('id, name');
  const categoryMap = new Map(allCategories?.map(c => [c.id, c.name]));

  const trendingProducts = products?.map(p => ({
    ...p,
    id: p.id.toString(),
    image_url: p.image_url,
    category: categoryMap.get(p.category_id) || 'Uncategorized',
  })) || [];

  return (
    <div className="space-y-16 pb-12">
      <HeroSection />
      <ServiceHighlights />

      {trendingProducts.length > 0 && (
        <TrendingSection title="Trending Now" products={trendingProducts} />
      )}

      {categories && categories.length > 0 && (
        <CategorySection categories={categories} />
      )}

      <DealBanner />

      {trendingProducts.length > 0 && (
        <TrendingSection title="New Arrivals" products={trendingProducts} />
      )}

      <Newsletter />
    </div>
  );
}
