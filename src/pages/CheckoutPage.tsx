import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { orderAPI } from '../utils/api';
import NeonButton from '../components/NeonButton';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart, user } = useStore();
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay'>('stripe');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const total = getCartTotal();

  const handlePayment = async () => {
    if (cart.length === 0) return;
    if (!email) {
      alert('Please enter your email to receive download links');
      return;
    }

    setLoading(true);
    try {
      const items = cart.map(item => ({
        productId: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      }));

      if (paymentMethod === 'stripe') {
        const response = await orderAPI.createStripeSession({ items, email });
        window.location.href = response.data.url;
      } else {
        const response = await orderAPI.createRazorpayOrder({ items, email });
        
        // Initialize Razorpay
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: response.data.amount,
          currency: response.data.currency,
          name: 'AntiGravity Shop',
          description: 'Anti-Gravity Products',
          order_id: response.data.id,
          handler: function (response: any) {
            clearCart();
            navigate('/order-success');
          },
          prefill: {
            name: user?.name || 'Customer',
            email: email,
          },
          theme: {
            color: '#00ffff'
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
          Checkout
        </h1>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-2xl font-bold text-neon-cyan mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.product._id} className="flex items-center gap-4 p-4 bg-black/20 rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold">{item.product.title}</h3>
                    <p className="text-gray-400">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neon-purple">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-600 pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-neon-purple">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-2xl font-bold text-yellow-500 mb-6">Payment & Delivery</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2">Email (for download links)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 bg-black/50 border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-500"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Download links will be sent to this email after payment</p>
            </div>

            <h3 className="text-xl font-bold text-yellow-500 mb-4">Payment Method</h3>
            
            <div className="space-y-4 mb-6">
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentMethod === 'stripe'
                    ? 'border-neon-cyan bg-neon-cyan/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => setPaymentMethod('stripe')}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={paymentMethod === 'stripe'}
                    onChange={() => setPaymentMethod('stripe')}
                    className="text-neon-cyan"
                  />
                  <div>
                    <h3 className="font-bold">Stripe (Global)</h3>
                    <p className="text-sm text-gray-400">Credit/Debit Cards, PayPal</p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-neon-cyan bg-neon-cyan/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => setPaymentMethod('razorpay')}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="text-neon-cyan"
                  />
                  <div>
                    <h3 className="font-bold">Razorpay (India)</h3>
                    <p className="text-sm text-gray-400">UPI, Cards, Net Banking</p>
                  </div>
                </div>
              </div>
            </div>

            <NeonButton
              onClick={handlePayment}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </NeonButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;