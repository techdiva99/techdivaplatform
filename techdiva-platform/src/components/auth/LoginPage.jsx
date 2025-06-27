import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, AlertCircle, Sparkles, Bot } from 'lucide-react';
import { mockDatabase } from '../../data/mockDatabase';
import TechDivaLogo from '../common/TechDivaLogo';

const LoginPage = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  // Get all users (mock database + localStorage users)
  const getAllUsers = () => {
    const localUsers = JSON.parse(localStorage.getItem('techdiva_users') || '[]');
    return [...mockDatabase.users, ...localUsers];
  };

  // Save new user to localStorage
  const saveNewUser = (user) => {
    const localUsers = JSON.parse(localStorage.getItem('techdiva_users') || '[]');
    localUsers.push(user);
    localStorage.setItem('techdiva_users', JSON.stringify(localUsers));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      // Sign up logic
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Check if email already exists
      const allUsers = getAllUsers();
      if (allUsers.find(u => u.email === formData.email)) {
        setError('Email already exists');
        return;
      }
      
      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        password: formData.password, // In production, this should be hashed!
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=ff67c7&color=fff`,
        joinedDate: new Date().toISOString(),
        bio: '',
        chatbotCount: 0,
        totalLikes: 0,
        isPremium: false
      };
      
      // Save to localStorage
      saveNewUser(newUser);
      
      // Auto login after signup
      onLogin(newUser);
    } else {
      // Login logic
      const allUsers = getAllUsers();
      const user = allUsers.find(u => u.email === formData.email);
      
      if (user) {
        // For mock database users, any password works
        // For localStorage users, check the password
        if (mockDatabase.users.find(u => u.id === user.id) || user.password === formData.password) {
          onLogin(user);
        } else {
          setError('Invalid email or password');
        }
      } else {
        setError('Invalid email or password');
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #ff67c7 0%, #ff9671 25%, #0aabde 50%, #f8b500 75%, #de790a 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite'
        }}
      />
      
      {/* Floating shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/20 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/20 rounded-full blur-xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/20 rounded-full blur-xl animate-float" />
      </div>

      {/* Login form */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md transform hover:scale-[1.02] transition-transform duration-300">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <TechDivaLogo size="medium" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#de790a' }}>
              {isSignUp ? 'Join TechDIVA' : 'Welcome Back!'}
            </h2>
            <p className="text-gray-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 mr-1" style={{ color: '#ff67c7' }} />
              {isSignUp ? 'Create your AI chatbot empire' : 'Continue building amazing chatbots'}
              <Bot className="w-4 h-4 ml-1" style={{ color: '#0aabde' }} />
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl flex items-center animate-shake">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold" style={{ color: '#de790a' }}>
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#ff9671' }} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 transition-colors"
                    placeholder="Jane Doe"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-semibold" style={{ color: '#de790a' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#ff9671' }} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 transition-colors"
                  placeholder="jane@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold" style={{ color: '#de790a' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#ff9671' }} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold" style={{ color: '#de790a' }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#ff9671' }} />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white transform transition hover:scale-105 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #ff67c7 0%, #ff9671 100%)',
              }}
            >
              {isSignUp ? 'Create Account' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </span>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setFormData({ email: '', password: '', name: '', confirmPassword: '' });
              }}
              className="ml-2 font-semibold transition-colors hover:underline"
              style={{ color: '#ff67c7' }}
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </button>
          </div>

          {/* Demo login hint */}
          {!isSignUp && (
            <div 
              className="mt-6 p-4 rounded-xl text-sm"
              style={{ backgroundColor: '#0aabde20', borderLeft: '4px solid #0aabde' }}
            >
              <p className="font-semibold mb-1" style={{ color: '#0aabde' }}>
                🎯 Demo Login:
              </p>
              <p className="text-gray-700">Email: priya@example.com</p>
              <p className="text-gray-600 text-xs mt-1">(Use any password)</p>
              <div className="mt-2 pt-2 border-t border-blue-200">
                <p className="text-xs text-gray-600">Or use your created account!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;