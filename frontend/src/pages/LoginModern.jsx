import React, { useContext, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail } from '../utils/validation';
import { debounce } from '../utils/validation';
import authService from '../services/authService';
import GoogleSignInButton from '../components/ui/GoogleSignInButton';
import loginBg from '../assets/loginbg.png';
import '../styles/Auth.css';

const LoginModern = () => {
  const { login } = useContext(AuthContext);
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' or 'signup'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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

  const validateSignInForm = () => {
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

  const validateSignUpForm = () => {
    const errors = {};
    
    if (!formData.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else {
      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid) {
        errors.email = emailValidation.message;
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    if (!validateSignInForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.login({
        email: formData.email,
        password: formData.password
      }, false);

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

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!validateSignUpForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const signupData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || ''
      };

      const result = await authService.register(signupData);

      if (result.success) {
        showSuccess('Account created successfully! Please sign in.');
        setActiveTab('signin');
        setFormData({
          firstName: '',
          lastName: '',
          email: formData.email, // Keep email for convenience
          password: '',
          phone: ''
        });
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

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center px-4 py-12"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30"></div>
      
      <div className="relative w-full max-w-md">
        {/* Frosted Glass Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Close Button */}
          <button 
            onClick={() => navigate('/home')}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/50 hover:bg-white/80 transition-all duration-200 group z-10"
          >
            <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Tab Switcher */}
          <div className="flex border-b border-gray-200/50 px-8 pt-8">
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 pb-4 px-6 text-center font-medium transition-all duration-200 border-b-2 ${
                activeTab === 'signup'
                  ? 'text-gray-900 border-gray-900'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Sign up
            </button>
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 pb-4 px-6 text-center font-medium transition-all duration-200 border-b-2 ${
                activeTab === 'signin'
                  ? 'text-gray-900 border-gray-900'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Sign in
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {activeTab === 'signup' ? 'Create an account' : 'Welcome back'}
            </h2>

            {/* Error Message */}
            {formErrors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
                {formErrors.general}
              </div>
            )}

            {/* Sign Up Form */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`px-4 py-3 rounded-xl border ${
                      formErrors.firstName 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-gray-400'
                    } bg-gray-50 focus:bg-white focus:outline-none transition-all duration-200`}
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`px-4 py-3 rounded-xl border ${
                      formErrors.lastName 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-gray-400'
                    } bg-gray-50 focus:bg-white focus:outline-none transition-all duration-200`}
                  />
                </div>
                {(formErrors.firstName || formErrors.lastName) && (
                  <p className="text-xs text-red-600 -mt-2">
                    {formErrors.firstName || formErrors.lastName}
                  </p>
                )}

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                      formErrors.email 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-gray-400'
                    } bg-gray-50 focus:bg-white focus:outline-none transition-all duration-200`}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-xs text-red-600 -mt-2">{formErrors.email}</p>
                )}

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">🇺🇸</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="(775) 351-6501"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-400 focus:outline-none transition-all duration-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 py-3 px-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                >
                  {isLoading ? 'Creating account...' : 'Create an account'}
                </button>
              </form>
            )}

            {/* Sign In Form */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                      formErrors.email 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-gray-400'
                    } bg-gray-50 focus:bg-white focus:outline-none transition-all duration-200`}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-xs text-red-600 -mt-2">{formErrors.email}</p>
                )}

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                      formErrors.password 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-gray-400'
                    } bg-gray-50 focus:bg-white focus:outline-none transition-all duration-200`}
                  />
                </div>
                {formErrors.password && (
                  <p className="text-xs text-red-600 -mt-2">{formErrors.password}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 py-3 px-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-500 uppercase tracking-wider text-xs">
                    Or sign in with
                  </span>
                </div>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <GoogleSignInButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                disabled={isLoading}
                text=""
                className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200"
                showIcon={true}
              />
              
              <button
                type="button"
                className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200"
                onClick={() => {
                  showError('Apple sign-in coming soon!');
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              </button>
            </div>

            {/* Terms */}
            <p className="mt-6 text-center text-xs text-gray-500">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-gray-700 hover:underline">
                Terms & Service
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModern;