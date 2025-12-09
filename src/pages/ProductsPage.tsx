import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { productAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'digital' | 'physical'>('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getAll();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => 
    filter === 'all' || product.category === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold neon-text mb-4">
            Digital Resources
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Premium interview kits, code templates, and technical resources for developers
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-8">
          <div className="glass-effect rounded-lg p-2 flex gap-2">
            {[
              { key: 'all', label: 'All Products' },
              { key: 'digital', label: 'Digital' },
              { key: 'physical', label: 'Physical' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-6 py-2 rounded-md transition-all duration-300 ${
                  filter === key
                    ? 'bg-neon-cyan text-black font-bold'
                    : 'text-gray-300 hover:text-neon-cyan'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;