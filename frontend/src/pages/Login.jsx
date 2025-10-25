import React, { useContext, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail } from '../utils/validation';
import { debounce } from '../utils/validation';
import authService from '../services/authService';
import GoogleSignInButton from '../components/ui/GoogleSignInButton';

const LoginPage = () => {
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
        console.log('✅ Login successful:', result.data);
        
        const userData = {
          ...result.data.user,
          _id: result.data.user._id || result.data.user.id 
        };
        
        login(result.data.token, userData);
        showSuccess('Welcome back! Login successful.');
        navigate('/Home', { replace: true });
        
      } else {
        setFormErrors({ general: result.message });
        showError(result.message);
      }
    } catch (err) {
      console.error('❌ Login error:', err);
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
        showSuccess('Password reset instructions sent to your email!');
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
    console.log('✅ Google login successful:', userData);
    
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
      showSuccess('Welcome back! Google sign-in successful.');
      navigate('/Home', { replace: true });
    }
  };

  const handleGoogleError = (error) => {
    console.error('❌ Google login error:', error);
    showError(error || 'Google sign-in failed. Please try again.');
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light text-gray-900 mb-2">Reset Password</h1>
            <p className="text-sm text-gray-600">Enter your email to receive reset instructions</p>
          </div>

          {resetMessage && (
            <div className={`p-3 mb-6 rounded-md text-sm ${
              resetMessage.includes('sent') || resetMessage.includes('instructions') 
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {resetMessage}
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full px-0 py-3 text-gray-900 placeholder-gray-500 bg-transparent border-0 border-b border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors"
              required
            />

            <button 
              type="submit" 
              disabled={resetLoading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resetLoading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#9fb3df] rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex justify-center mb-4">
            <img 
              src={logo} 
              alt="Fashion Community" 
              className="h-12 w-auto"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Welcome Back</h2>
          <p className="text-gray-500">Sign in to continue your fashion journey</p>
        </div>
        
        {formErrors.general && (
          <div className="error-message bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {formErrors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={formErrors.email}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            }
          />
          
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={formErrors.password}
            showPasswordToggle={true}
          />

          {/* Remember Me checkbox */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-[#9fb3df] focus:ring-[#9fb3df] border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-[#8c9cc8] hover:text-[#9fb3df] transition-colors duration-200"
            >
              Forgot password?
            </button>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#9fb3df] hover:bg-[#8c9cc8] text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Social Login Section */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <GoogleSignInButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              disabled={isLoading}
              text="Sign in with Google"
            />

            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
              onClick={() => {
                // TODO: Implement Facebook OAuth
                showError('Facebook sign-in coming soon!');
              }}
            >
              <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Sign in with Facebook
            </button>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="auth-switch text-gray-600">
            Don't have an account? {' '}
            <Link to="/signup" className="text-[#8c9cc8] hover:text-[#9fb3df] font-semibold transition-colors duration-200">
              Sign up
            </Link>
          </p>
        </div>
        
        <div className="mt-6 text-center">
          <div className="bg-[#f2ecf9] border border-[#e0d7f9] rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Demo Account</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Email:</strong> demo@fashion.com</p>
              <p><strong>Password:</strong> demo123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
