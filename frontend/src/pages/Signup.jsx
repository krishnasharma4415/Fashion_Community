import React, { useState, useCallback, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail, validateUsername, validatePassword, validatePasswordMatch, debounce } from '../utils/validation';
import authService from '../services/authService';
import Input from '../components/ui/Input';
import PasswordStrengthIndicator from '../components/ui/PasswordStrengthIndicator';
import GoogleSignInButton from '../components/ui/GoogleSignInButton';
import logo from '../assets/logo.png';
import '../styles/Auth.css';

const Signup = () => {
  const { login } = useContext(AuthContext);
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(null);
  const navigate = useNavigate();

  // Debounced username availability check
  const debouncedUsernameCheck = useCallback(
    debounce(async (username) => {
      if (username && validateUsername(username).isValid) {
        setCheckingUsername(true);
        try {
          const result = await authService.checkUsernameAvailability(username);
          if (result.available) {
            setFormSuccess(prev => ({ ...prev, username: 'Username is available' }));
            setFormErrors(prev => ({ ...prev, username: '' }));
          } else {
            setFormErrors(prev => ({ ...prev, username: result.message }));
            setFormSuccess(prev => ({ ...prev, username: '' }));
          }
        } catch (error) {
          setFormErrors(prev => ({ ...prev, username: 'Unable to check username availability' }));
        } finally {
          setCheckingUsername(false);
        }
      }
    }, 500),
    []
  );

  // Debounced email availability check
  const debouncedEmailCheck = useCallback(
    debounce(async (email) => {
      if (email && validateEmail(email).isValid) {
        setCheckingEmail(true);
        try {
          const result = await authService.checkEmailAvailability(email);
          if (result.available) {
            setFormSuccess(prev => ({ ...prev, email: 'Email is available' }));
            setFormErrors(prev => ({ ...prev, email: '' }));
          } else {
            setFormErrors(prev => ({ ...prev, email: result.message }));
            setFormSuccess(prev => ({ ...prev, email: '' }));
          }
        } catch (error) {
          setFormErrors(prev => ({ ...prev, email: 'Unable to check email availability' }));
        } finally {
          setCheckingEmail(false);
        }
      }
    }, 500),
    []
  );

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear previous errors and success messages
    setFormErrors(prev => ({ ...prev, [field]: '' }));
    setFormSuccess(prev => ({ ...prev, [field]: '' }));

    // Real-time validation
    switch (field) {
      case 'email':
        const emailValidation = validateEmail(value);
        if (value && !emailValidation.isValid) {
          setFormErrors(prev => ({ ...prev, email: emailValidation.message }));
        } else if (value && emailValidation.isValid) {
          debouncedEmailCheck(value);
        }
        break;
        
      case 'username':
        const usernameValidation = validateUsername(value);
        if (value && !usernameValidation.isValid) {
          setFormErrors(prev => ({ ...prev, username: usernameValidation.message }));
        } else if (value && usernameValidation.isValid) {
          debouncedUsernameCheck(value);
        }
        break;
        
      case 'password':
        const passwordValidation = validatePassword(value);
        setPasswordValidation(passwordValidation);
        if (value && !passwordValidation.isValid) {
          setFormErrors(prev => ({ ...prev, password: 'Password does not meet requirements' }));
        }
        
        // Re-validate confirm password if it exists
        if (formData.confirmPassword) {
          const matchValidation = validatePasswordMatch(value, formData.confirmPassword);
          if (!matchValidation.isValid) {
            setFormErrors(prev => ({ ...prev, confirmPassword: matchValidation.message }));
          }
        }
        break;
        
      case 'confirmPassword':
        const matchValidation = validatePasswordMatch(formData.password, value);
        if (value && !matchValidation.isValid) {
          setFormErrors(prev => ({ ...prev, confirmPassword: matchValidation.message }));
        } else if (value && matchValidation.isValid) {
          setFormSuccess(prev => ({ ...prev, confirmPassword: 'Passwords match' }));
        }
        break;
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else {
      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid) {
        errors.email = emailValidation.message;
      }
    }
    
    // Username validation
    if (!formData.username) {
      errors.username = 'Username is required';
    } else {
      const usernameValidation = validateUsername(formData.username);
      if (!usernameValidation.isValid) {
        errors.username = usernameValidation.message;
      }
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        errors.password = 'Password does not meet requirements';
      }
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else {
      const matchValidation = validatePasswordMatch(formData.password, formData.confirmPassword);
      if (!matchValidation.isValid) {
        errors.confirmPassword = matchValidation.message;
      }
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
      const result = await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        setIsSuccess(true);
        showSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setFormErrors({ general: result.message });
        showError(result.message);
      }
    } catch (err) {
      const errorMessage = 'Server error. Please try again later.';
      setFormErrors({ general: errorMessage });
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (userData) => {
    console.log('✅ Google signup successful:', userData);
    
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
      showSuccess('Welcome back to Fashion Community!');
      navigate('/Home', { replace: true });
    }
  };

  const handleGoogleError = (error) => {
    console.error('❌ Google signup error:', error);
    showError(error || 'Google sign-up failed. Please try again.');
  };

  if (isSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-form animate-slideup">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">🎉 Account Created!</h2>
            <p className="text-gray-500 mb-4">Welcome to Fashion Community!</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700">Redirecting to login page...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form animate-slideup">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#9fb3df] rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div className="flex justify-center mb-4">
            <img 
              src={logo} 
              alt="Fashion Community" 
              className="h-12 w-auto"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Join Fashion Community</h2>
          <p className="text-gray-500">Create your account to start your fashion journey</p>
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
            success={formSuccess.email}
            loading={checkingEmail}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            }
          />

          <Input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            error={formErrors.username}
            success={formSuccess.username}
            loading={checkingUsername}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />

          <div>
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={formErrors.password}
              showPasswordToggle={true}
            />
            {passwordValidation && (
              <PasswordStrengthIndicator 
                password={formData.password} 
                validation={passwordValidation} 
              />
            )}
          </div>

          <Input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            error={formErrors.confirmPassword}
            success={formSuccess.confirmPassword}
            showPasswordToggle={true}
          />

          <button 
            type="submit" 
            disabled={isLoading || checkingUsername || checkingEmail}
            className="w-full bg-[#9fb3df] hover:bg-[#8c9cc8] text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Social Signup Section */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <GoogleSignInButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              disabled={isLoading || checkingUsername || checkingEmail}
              text="Sign up with Google"
            />

            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
              onClick={() => {
                // TODO: Implement Facebook OAuth
                showError('Facebook sign-up coming soon!');
              }}
            >
              <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Sign up with Facebook
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="auth-switch text-gray-600">
            Already have an account? {' '}
            <Link to="/login" className="text-[#8c9cc8] hover:text-[#9fb3df] font-semibold transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;