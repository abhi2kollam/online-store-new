import TrendingSection from '@/components/TrendingSection';
import CategorySection from '@/components/CategorySection';
import HeroSection from '@/components/HeroSection';
import ServiceHighlights from '@/components/ServiceHighlights';
import Newsletter from '@/components/Newsletter';
import DealBanner from '@/components/DealBanner';
import { createClient } from '@/utils/supabase/server';
import ScrollAnimation from '@/components/ScrollAnimation';

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
      <ScrollAnimation>
        <HeroSection />
      </ScrollAnimation>

      <ScrollAnimation delay={0.2}>
        <ServiceHighlights />
      </ScrollAnimation>

      {trendingProducts.length > 0 && (
        <ScrollAnimation>
          <TrendingSection title="Trending Now" products={trendingProducts} />
        </ScrollAnimation>
      )}

      {categories && categories.length > 0 && (
        <ScrollAnimation>
          <CategorySection categories={categories} />
        </ScrollAnimation>
      )}

      <ScrollAnimation>
        <DealBanner />
      </ScrollAnimation>

      {trendingProducts.length > 0 && (
        <ScrollAnimation>
          <TrendingSection title="New Arrivals" products={trendingProducts} />
        </ScrollAnimation>
      )}

      <ScrollAnimation>
        <Newsletter />
      </ScrollAnimation>
    </div>
  );
}
