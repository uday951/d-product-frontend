import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import { Product } from '../types';
import { productAPI } from '../utils/api';
import { useStore } from '../store/useStore';
import NeonButton from '../components/NeonButton';

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useStore();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      
      try {
        const response = await productAPI.getBySlug(slug);
        setProduct(response.data);
        
        // Set SEO metadata for Instagram sharing
        document.title = `${response.data.title} - AntiGravity Shop`;
        
        // Update meta tags for social sharing
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', response.data.description);
        }
        
        const metaImage = document.querySelector('meta[property="og:image"]');
        if (metaImage) {
          metaImage.setAttribute('content', response.data.image);
        }
        
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, navigate]);

  const handleBuyNow = () => {
    if (!product) return;
    // Add to cart and go directly to payment
    addToCart(product);
    navigate('/payment', { state: { product } });
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neon-cyan mb-4">Product Not Found</h1>
          <NeonButton onClick={() => navigate('/products')}>
            Back to Products
          </NeonButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Product Image/3D Model */}
          <div className="relative">
            {product.splineEmbedUrl ? (
              <div className="h-96 rounded-xl overflow-hidden glass-effect">
                <Spline scene={product.splineEmbedUrl} />
              </div>
            ) : (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-96 object-cover rounded-xl"
              />
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold neon-text mb-4">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-neon-purple">
                  ${product.price}
                </span>
                
                {product.category === 'digital' && (
                  <span className="bg-neon-cyan/20 text-neon-cyan px-3 py-1 rounded-full text-sm">
                    Digital Product
                  </span>
                )}
                
                <span className={`px-3 py-1 rounded-full text-sm ${
                  product.inStock 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-xl font-bold text-neon-cyan mb-4">Description</h3>
              <p className="text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <NeonButton
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full text-lg py-4"
              >
                Buy Now - ${product.price}
              </NeonButton>
            </div>

            {/* Product Features */}
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-xl font-bold text-neon-cyan mb-4">Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-neon-cyan rounded-full mr-3"></span>
                  Revolutionary anti-gravity technology
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-neon-cyan rounded-full mr-3"></span>
                  Quantum field manipulation
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-neon-cyan rounded-full mr-3"></span>
                  Energy-efficient design
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-neon-cyan rounded-full mr-3"></span>
                  1-year warranty included
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;