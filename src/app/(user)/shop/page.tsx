import { getProducts } from '@/services/mockData';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';

interface ShopProps {
    searchParams: Promise<{
        q?: string;
        category?: string;
    }>;
}

export default async function ShopPage({ searchParams }: ShopProps) {
    const { q, category } = await searchParams;
    const products = await getProducts(q, category);

    return (
        <div className="space-y-8 py-12">
            <section className="text-center">
                <h1 className="text-4xl font-bold mb-4">Shop All Products</h1>
                <p className="text-lg text-base-content/70">Find the perfect item for you.</p>

                <div className="mt-8 flex flex-col items-center gap-4">
                    <SearchBar />
                    <CategoryFilter />
                </div>
            </section>

            <section>
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
