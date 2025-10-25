import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { validatePassword, validatePasswordMatch } from '../utils/validation';
import authService from '../services/authService';
import Input from '../components/ui/Input';
import PasswordStrengthIndicator from '../components/ui/PasswordStrengthIndicator';
import logo from '../assets/logo.png';
import '../styles/Auth.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear previous errors
    setFormErrors(prev => ({ ...prev, [field]: '' }));

    // Real-time validation
    if (field === 'password') {
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
    } else if (field === 'confirmPassword') {
      const matchValidation = validatePasswordMatch(formData.password, value);
      if (value && !matchValidation.isValid) {
        setFormErrors(prev => ({ ...prev, confirmPassword: matchValidation.message }));
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    
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
      const result = await authService.resetPassword(token, formData.password);

      if (result.success) {
        setIsSuccess(true);
        showSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
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

  if (isSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Password Reset Successfully!</h2>
            <p className="text-gray-500 mb-4">Your password has been updated.</p>
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
      <div className="auth-form">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#9fb3df] rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div className="flex justify-center mb-4">
            <img 
              src={logo} 
              alt="Fashion Community" 
              className="h-12 w-auto"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Set New Password</h2>
          <p className="text-gray-500">Enter your new password below</p>
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
          <div>
            <Input
              type="password"
              placeholder="New Password"
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
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            error={formErrors.confirmPassword}
            showPasswordToggle={true}
          />

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
                Updating Password...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-[#8c9cc8] hover:text-[#9fb3df] font-semibold transition-colors duration-200"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;