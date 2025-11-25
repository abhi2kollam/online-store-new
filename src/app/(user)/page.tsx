import { getProducts, getCategories } from '@/services/mockData';
import TrendingProductCard from '@/components/TrendingProductCard';
import FeatureCards from '@/components/FeatureCards';
import Link from 'next/link';

export default async function Home() {
  // Fetch trending products (simulated by taking first 4)
  const allProducts = await getProducts();
  const trendingProducts = allProducts.slice(0, 4);
  const categories = await getCategories();

  return (
    <div className="space-y-16 pb-12">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to OnlineStore</h1>
        <p className="text-lg text-base-content/70">Discover the latest trends in fashion.</p>
        <FeatureCards />
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Trending Now</h2>
          <div className="flex gap-2">
            <button className="btn btn-circle btn-sm btn-ghost">❮</button>
            <button className="btn btn-circle btn-sm btn-ghost">❯</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <TrendingProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8">Shop By Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link href={`/shop?category=${category.name}`} key={category.id} className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer">
              <img
                src={category.image || 'https://placehold.co/400x600?text=Category'}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 px-6 py-2 rounded-full flex items-center gap-2 transition-transform group-hover:scale-105">
                <span className="font-semibold text-black">{category.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
