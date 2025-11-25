import { getProducts } from '@/services/mockData';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';

import FeatureCards from '@/components/FeatureCards';

interface HomeProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { q, category } = await searchParams;
  const products = await getProducts(q, category);

  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to OnlineStore</h1>
        <p className="text-lg text-base-content/70">Discover the latest trends in fashion.</p>

        <FeatureCards />

        <div className="mt-12 flex flex-col items-center gap-4">
          <SearchBar />
          <CategoryFilter />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg">No products found.</p>
          </div>
        )}
      </section>
    </div>
  );
}

