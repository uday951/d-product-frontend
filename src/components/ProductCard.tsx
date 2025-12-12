import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import NeonButton from './NeonButton';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useStore();

  useEffect(() => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutExpo',
        delay: Math.random() * 300
      });
    }
  }, []);

  const handleCardClick = () => {
    navigate(`/product/${product.slug}`);
  };

  const handleAddToCart = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    addToCart(product);
  };

  return (
    <div
      ref={cardRef}
      className="product-card glass-effect rounded-xl p-6 cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x300/1a1a2e/FFD700?text=UdayTechX';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <h3 className="text-xl font-bold text-yellow-500 mb-2 group-hover:text-yellow-400 transition-all duration-300">
        {product.title}
      </h3>
      
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {product.description}
      </p>
      
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-yellow-500">
          ${product.price}
        </span>
        
        <NeonButton
          variant="secondary"
          onClick={handleAddToCart}
          className="text-xs px-4 py-2"
        >
          Add to Cart
        </NeonButton>
      </div>
      
      {product.category === 'digital' && (
        <div className="mt-2">
          <span className="inline-block bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded">
            Digital Product
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductCard;