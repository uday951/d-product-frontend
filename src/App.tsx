import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import PaymentPage from './pages/PaymentPage';
import DirectPurchasePage from './pages/DirectPurchasePage';
import './index.css';

function App() {
  return (
    <GoogleOAuthProvider clientId="509007790565-nuv9plcl4ham77p2r252su3sb4pul80l.apps.googleusercontent.com">
      <Router>
        <div className="App">
          <Header />
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/p/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/buy/:slug" element={<DirectPurchasePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;