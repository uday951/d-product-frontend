import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { authAPI } from '../utils/api';
import { useStore } from '../store/useStore';
import NeonButton from '../components/NeonButton';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const response = await authAPI.login(formData.email, formData.password);
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        navigate('/');
      } else {
        const response = await authAPI.register(formData.name, formData.email, formData.password);
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await authAPI.googleLogin(credentialResponse.credential);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      navigate('/');
    } catch (err: any) {
      setError('Google login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="glass-effect rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold neon-text text-center mb-8">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-neon-cyan/30 rounded-lg focus:outline-none focus:border-neon-cyan"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-neon-cyan/30 rounded-lg focus:outline-none focus:border-neon-cyan"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-neon-cyan/30 rounded-lg focus:outline-none focus:border-neon-cyan"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <NeonButton type="submit" className="w-full">
            {isLogin ? 'Login' : 'Sign Up'}
          </NeonButton>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black/50 text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google login failed')}
              theme="filled_black"
              size="large"
              text={isLogin ? 'signin_with' : 'signup_with'}
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-neon-cyan hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;