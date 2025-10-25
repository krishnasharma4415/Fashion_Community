import React, { useContext, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail } from '../utils/validation';
import { debounce } from '../utils/validation';
import authService from '../services/authService';
import GoogleSignInButton from '../components/ui/GoogleSignInButton';
import loginBg from '../assets/loginbg.png';

const LoginMinimal = () => {
  const { login } = useContext(AuthContext);
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const navigate = useNavigate();

  // Debounced email validation
  const debouncedEmailValidation = useCallback(
    debounce((email) => {
      if (email) {
        const validation = validateEmail(email);
        setFormErrors(prev => ({
          ...prev,
          email: validation.isValid ? '' : validation.message
        }));
      }
    }, 300),
    []
  );

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear previous errors
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Real-time validation for email
    if (field === 'email') {
      debouncedEmailValidation(value);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else {
      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid) {
        errors.email = emailValidation.message;
      }
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.login(formData, rememberMe);

      if (result.success) {
        const userData = {
          ...result.data.user,
          _id: result.data.user._id || result.data.user.id 
        };
        
        login(result.data.token, userData);
        showSuccess('Welcome back!');
        navigate('/Home', { replace: true });
        
      } else {
        setFormErrors({ general: result.message });
        showError(result.message);
      }
    } catch (err) {
      const errorMessage = 'Something went wrong. Please try again.';
      setFormErrors({ general: errorMessage });
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!resetEmail) {
      setResetMessage('Please enter your email address');
      return;
    }

    const emailValidation = validateEmail(resetEmail);
    if (!emailValidation.isValid) {
      setResetMessage('Please enter a valid email address');
      return;
    }

    setResetLoading(true);
    setResetMessage('');

    try {
      const result = await authService.requestPasswordReset(resetEmail);
      setResetMessage(result.message);
      
      if (result.success) {
        showSuccess('Password reset instructions sent!');
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetEmail('');
          setResetMessage('');
        }, 3000);
      }
    } catch (err) {
      const errorMessage = 'Something went wrong. Please try again.';
      setResetMessage(errorMessage);
      showError(errorMessage);
    } finally {
      setResetLoading(false);
    }
  };

  const handleGoogleSuccess = (userData) => {
    const user = {
      ...userData.user,
      _id: userData.user._id || userData.user.id 
    };
    
    login(userData.token, user);
    
    // Only redirect to profile setup for NEW Google users
    if (userData.isNewUser && userData.user.isGoogleUser && !userData.user.profileCompleted) {
      showSuccess('Welcome to Fashion Community! Let\'s set up your profile.');
      navigate('/edit-profile?welcome=true&newUser=true', { replace: true });
    } else {
      showSuccess('Welcome back!');
      navigate('/Home', { replace: true });
    }
  };

  const handleGoogleError = (error) => {
    showError(error || 'Google sign-in failed. Please try again.');
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-12">
            <h1 className="text-2xl font-light text-gray-900 mb-2">Reset Password</h1>
            <p className="text-sm text-gray-500">Enter your email to receive reset instructions</p>
          </div>

          {resetMessage && (
            <div className={`mb-6 p-3 rounded text-sm ${
              resetMessage.includes('sent') || resetMessage.includes('instructions') 
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}>
              {resetMessage}
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-6">
            <input
              type="email"
              placeholder="Email address"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full px-0 py-4 text-gray-900 placeholder-gray-400 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-lg"
              required
            />

            <button 
              type="submit" 
              disabled={resetLoading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded font-medium transition-colors disabled:opacity-50"
            >
              {resetLoading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </form>

          <div className="mt-12 text-center">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-gray-900 mb-3">Fashion Community</h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>
        
        {/* Error Message */}
        {formErrors.general && (
          <div className="mb-8 p-4 bg-red-50 text-red-800 rounded text-sm">
            {formErrors.general}
          </div>
        )}
        
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-0 py-4 text-gray-900 placeholder-gray-400 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-lg"
              required
            />
            {formErrors.email && (
              <p className="mt-2 text-xs text-red-600">{formErrors.email}</p>
            )}
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full px-0 py-4 text-gray-900 placeholder-gray-400 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-lg"
              required
            />
            {formErrors.password && (
              <p className="mt-2 text-xs text-red-600">{formErrors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-gray-900 focus:ring-0 border-gray-300 rounded"
              />
              <span className="ml-2">Remember me</span>
            </label>
            
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              Forgot password?
            </button>
          </div>
          
          {/* Sign In Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-12">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-gray-400 uppercase tracking-wider">Or</span>
            </div>
          </div>
        </div>

        {/* Social Login */}
        <GoogleSignInButton
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          disabled={isLoading}
          text="Continue with Google"
          className="w-full border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-4 rounded font-medium transition-colors"
        />
        
        {/* Sign Up Link */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-gray-900 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
        
        {/* Demo Account */}
        <div className="mt-12 p-6 bg-gray-50 rounded">
          <p className="text-xs font-medium text-gray-700 mb-3">Demo Account</p>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Email: demo@fashion.com</p>
            <p>Password: demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginMinimal;