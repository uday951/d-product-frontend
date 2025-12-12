import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../utils/api';
import { Product } from '../types';
import NeonButton from '../components/NeonButton';

const DirectPurchasePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { id: 'phonepe', name: 'PhonePe', icon: '📱' },
    { id: 'googlepay', name: 'Google Pay', icon: '🟢' },
    { id: 'paytm', name: 'Paytm', icon: '💙' },
    { id: 'upi', name: 'UPI', icon: '🏦' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        const response = await productAPI.getBySlug(slug);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/');
      }
    };
    fetchProduct();
  }, [slug, navigate]);

  const handlePurchase = async () => {
    if (!email || !paymentMethod || !product) {
      alert('Please enter email and select payment method');
      return;
    }

    setLoading(true);
    
    setTimeout(async () => {
      try {
        const response = await fetch('https://degital-product.onrender.com/api/orders/mock-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            productId: product._id,
            paymentMethod,
            amount: product.price
          })
        });

        const data = await response.json();
        if (response.ok) {
          alert(`🎉 Payment Successful!\n\n📥 Download Link: ${data.downloadLink}\n\n📧 Also sent to: ${email}`);
          navigate('/');
        } else {
          alert('Payment failed. Please try again.');
        }
      } catch (error) {
        alert('Payment failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Product Preview */}
        <div className="glass-effect rounded-xl p-6 mb-6 text-center">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-yellow-500 mb-2">{product.title}</h1>
          <p className="text-gray-400 text-sm mb-4">{product.description}</p>
          <div className="text-3xl font-bold text-yellow-500">${product.price}</div>
        </div>

        {/* Email Input */}
        <div className="glass-effect rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-yellow-500 mb-3">📧 Email for Download</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 bg-black/50 border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-500"
            required
          />
        </div>

        {/* Payment Methods */}
        <div className="glass-effect rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-yellow-500 mb-4">💳 Select Payment</h2>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                  paymentMethod === method.id
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="text-xl mb-1">{method.icon}</div>
                <div className="text-xs font-medium">{method.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Purchase Button */}
        <NeonButton
          onClick={handlePurchase}
          disabled={loading || !email || !paymentMethod}
          className="w-full text-lg py-4 mb-4"
        >
          {loading ? '⏳ Processing...' : `🚀 Buy Now - $${product.price}`}
        </NeonButton>

        <div className="text-center text-xs text-gray-500">
          Secure payment • Instant download • 24/7 support
        </div>
      </div>
    </div>
  );
};

export default DirectPurchasePage;