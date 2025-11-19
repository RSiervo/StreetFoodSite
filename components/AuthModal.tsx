import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Mail, User, ArrowRight, MapPin, Phone, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation for demo
    if ((isLogin && formData.email) || (!isLogin && formData.name && formData.address)) {
      // If login, simulate fetching user data
      const userToLogin = isLogin ? { 
        ...formData, 
        name: 'Demo User', 
        address: '123 Street Food Ave', 
        phone: '555-0123' 
      } : formData;
      
      onLogin(userToLogin);
      onClose();
    }
  };

  const handleGoogleLogin = () => {
    // Simulate Google Login
    onLogin({
      name: 'Google User',
      email: 'user@gmail.com',
      phone: '',
      address: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-street-dark/80 backdrop-blur-sm" 
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl animate-slide-up overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-street-dark bg-gray-100 p-2 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-street-dark">
            {isLogin ? 'Welcome Back!' : 'Join the Feast'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin ? 'Log in to continue your food journey.' : 'Create an account to start ordering.'}
          </p>
        </div>

        {/* Google Button */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-gray-200 text-gray-700 font-medium py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors mb-6 active:scale-95"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-xs text-gray-400 font-medium uppercase">Or</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 ml-1 flex items-center gap-1">
                <User size={12} /> Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-street-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-street-orange transition-all text-sm"
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-1">
             <label className="text-xs font-bold text-gray-600 ml-1 flex items-center gap-1">
              <Mail size={12} /> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-street-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-street-orange transition-all text-sm"
              required
            />
          </div>

          {!isLogin && (
            <>
              <div className="space-y-1">
                 <label className="text-xs font-bold text-gray-600 ml-1 flex items-center gap-1">
                  <Phone size={12} /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-street-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-street-orange transition-all text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 ml-1 flex items-center gap-1">
                  <MapPin size={12} /> Delivery Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Foodie Lane, Apt 4B"
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-street-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-street-orange transition-all text-sm resize-none"
                  required
                />
              </div>
            </>
          )}

          <button 
            type="submit"
            className="w-full bg-street-dark text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all mt-2 flex items-center justify-center gap-2 hover:bg-street-orange"
          >
            {isLogin ? 'Log In' : 'Create Account'}
            <ArrowRight size={18} />
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-street-orange font-bold ml-1 hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};