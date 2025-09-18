import React, { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState<'customer' | 'seller'>('customer');
  const { login, signup, loginWithGoogle } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) onClose();
        else setError('Invalid email or password');
      } else {
        const success = await signup(name, email, password, userRole);
        if (success) onClose();
        else setError('Failed to sign up');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const success = await loginWithGoogle();
      if (success) onClose();
      else setError('Google login failed');
    } catch (err) {
      setError('An error occurred with Google login');
    }
  };

  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Name</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jungle-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUserRole('customer')}
                    className={`p-3 rounded-lg border transition-colors ${
                      userRole === 'customer'
                        ? 'border-jungle-600 bg-jungle-50 text-jungle-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRole('seller')}
                    className={`p-3 rounded-lg border transition-colors ${
                      userRole === 'seller'
                        ? 'border-jungle-600 bg-jungle-50 text-jungle-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Seller
                  </button>
                </div>
              </div>
            </>
          )}
          <div>
            <label className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jungle-500"
              required
            />
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jungle-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-jungle-600 text-white p-3 rounded-lg font-semibold hover:bg-jungle-700 transition-colors"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-jungle-600 hover:underline ml-1"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;