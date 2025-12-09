import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import NeonButton from './NeonButton';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { cart, user, setUser } = useStore();
  
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-neon-cyan/30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold neon-text">
          UdayTechX
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="hover:text-yellow-500 transition-colors">
            Home
          </Link>
          <Link to="/products" className="hover:text-yellow-500 transition-colors">
            Resources
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link
            to="/cart"
            className="relative p-2 hover:text-neon-cyan transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
            </svg>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-neon-purple text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm">Hi, {user.name}</span>
              <NeonButton variant="secondary" onClick={handleLogout} className="text-xs px-3 py-1">
                Logout
              </NeonButton>
            </div>
          ) : (
            <NeonButton variant="secondary" onClick={() => navigate('/login')} className="text-xs px-3 py-1">
              Login
            </NeonButton>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;