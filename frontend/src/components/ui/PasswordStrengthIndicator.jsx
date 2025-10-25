import React from 'react';
import PropTypes from 'prop-types';

const PasswordStrengthIndicator = ({ password, validation }) => {
  if (!password) return null;

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getStrengthWidth = (score) => {
    return `${(score / 5) * 100}%`;
  };

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 min-w-0 flex-shrink-0">Password strength:</span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(validation.strength)}`}
            style={{ width: getStrengthWidth(validation.score) }}
          />
        </div>
        <span className={`text-sm font-medium capitalize ${
          validation.strength === 'weak' ? 'text-red-600' :
          validation.strength === 'medium' ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          {validation.strength}
        </span>
      </div>

      {/* Requirements checklist */}
      {validation.messages.length > 0 && (
        <div className="text-sm">
          <p className="text-gray-600 mb-1">Password must contain:</p>
          <ul className="space-y-1">
            <li className={`flex items-center ${validation.checks.length ? 'text-green-600' : 'text-gray-500'}`}>
              <svg className={`w-4 h-4 mr-2 ${validation.checks.length ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              At least 8 characters
            </li>
            <li className={`flex items-center ${validation.checks.upperCase ? 'text-green-600' : 'text-gray-500'}`}>
              <svg className={`w-4 h-4 mr-2 ${validation.checks.upperCase ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              One uppercase letter
            </li>
            <li className={`flex items-center ${validation.checks.lowerCase ? 'text-green-600' : 'text-gray-500'}`}>
              <svg className={`w-4 h-4 mr-2 ${validation.checks.lowerCase ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              One lowercase letter
            </li>
            <li className={`flex items-center ${validation.checks.numbers ? 'text-green-600' : 'text-gray-500'}`}>
              <svg className={`w-4 h-4 mr-2 ${validation.checks.numbers ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              One number
            </li>
            <li className={`flex items-center ${validation.checks.specialChar ? 'text-green-600' : 'text-gray-500'}`}>
              <svg className={`w-4 h-4 mr-2 ${validation.checks.specialChar ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              One special character
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

PasswordStrengthIndicator.propTypes = {
  password: PropTypes.string.isRequired,
  validation: PropTypes.shape({
    strength: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    checks: PropTypes.object.isRequired,
    messages: PropTypes.array.isRequired,
  }).isRequired,
};

export default PasswordStrengthIndicator;