import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import NeonButton from '../components/NeonButton';

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, getCartTotal } = useStore();
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const product = location.state?.product;
  const total = product ? product.price : getCartTotal();

  const paymentMethods = [
    { id: 'phonepe', name: 'PhonePe', icon: '📱' },
    { id: 'googlepay', name: 'Google Pay', icon: '🟢' },
    { id: 'paytm', name: 'Paytm', icon: '💙' },
    { id: 'upi', name: 'UPI', icon: '🏦' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏛️' }
  ];

  const handlePayment = async () => {
    if (!email || !paymentMethod) {
      alert('Please enter email and select payment method');
      return;
    }

    setLoading(true);
    
    // Mock payment processing
    setTimeout(async () => {
      try {
        // Send email with download link
        const response = await fetch('https://degital-product.onrender.com/api/orders/mock-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            productId: product?._id,
            paymentMethod,
            amount: total
          })
        });

        const data = await response.json();
        if (response.ok) {
          alert(`Payment Successful!\n\nDownload Link: ${data.downloadLink}\n\nLink also sent to: ${email}`);
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

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold neon-text text-center mb-8">
            Complete Payment
          </h1>

          {/* Product Summary */}
          {product && (
            <div className="glass-effect rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-yellow-500 mb-4">Order Summary</h2>
              <div className="flex items-center gap-4">
                <img src={product.image} alt={product.title} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-bold">{product.title}</h3>
                  <p className="text-gray-400">{product.category}</p>
                </div>
                <div className="text-2xl font-bold text-yellow-500">
                  ${product.price}
                </div>
              </div>
            </div>
          )}

          {/* Email Input */}
          <div className="glass-effect rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-yellow-500 mb-4">Email for Download Link</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-black/50 border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-500 text-lg"
              required
            />
            <p className="text-sm text-gray-400 mt-2">
              Download link will be sent to this email after payment
            </p>
          </div>

          {/* Payment Methods */}
          <div className="glass-effect rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-yellow-500 mb-4">Select Payment Method</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-center ${
                    paymentMethod === method.id
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-2">{method.icon}</div>
                  <div className="text-sm font-medium">{method.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Button */}
          <div className="glass-effect rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold">Total Amount:</span>
              <span className="text-3xl font-bold text-yellow-500">${total}</span>
            </div>
            
            <NeonButton
              onClick={handlePayment}
              disabled={loading || !email || !paymentMethod}
              className="w-full text-lg py-4"
            >
              {loading ? 'Processing Payment...' : `Pay $${total}`}
            </NeonButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;