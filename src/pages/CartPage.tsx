import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import NeonButton from '../components/NeonButton';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useStore();

  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neon-cyan mb-4">Your cart is empty</h1>
          <NeonButton onClick={() => navigate('/products')}>
            Continue Shopping
          </NeonButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold neon-text text-center mb-8">
          Shopping Cart
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-xl p-6 mb-6">
            {cart.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center gap-4 p-4 mb-4 bg-black/20 rounded-lg"
              >
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-24 h-24 object-cover rounded"
                />
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{item.product.title}</h3>
                  <p className="text-neon-purple font-bold">${item.product.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    className="w-8 h-8 bg-neon-cyan/20 hover:bg-neon-cyan/40 rounded transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className="w-8 h-8 bg-neon-cyan/20 hover:bg-neon-cyan/40 rounded transition-colors"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="text-xl font-bold text-neon-purple">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-bold">Total:</span>
              <span className="text-3xl font-bold text-neon-purple">${total.toFixed(2)}</span>
            </div>

            <div className="flex gap-4">
              <NeonButton
                variant="secondary"
                onClick={() => navigate('/products')}
                className="flex-1"
              >
                Continue Shopping
              </NeonButton>
              <NeonButton
                onClick={() => navigate('/checkout')}
                className="flex-1"
              >
                Proceed to Checkout
              </NeonButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;