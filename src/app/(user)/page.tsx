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

  // Fetch trending products and categories in parallel
  const [productsResult, categoriesResult] = await Promise.all([
    supabase.from('products').select('*').limit(5),
    supabase.from('categories').select('id, name, image_url')
  ]);

  const products = productsResult.data;
  const categories = categoriesResult.data;

  const trendingProducts = products?.map(p => ({
    ...p,
    id: p.id.toString(),
    image_url: p.image_url,
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
        <CategorySection categories={categories} />
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
