// Validation utilities for authentication forms

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: emailRegex.test(email),
    message: emailRegex.test(email) ? '' : 'Please enter a valid email address'
  };
};

export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  const isValid = usernameRegex.test(username);
  
  let message = '';
  if (!isValid) {
    if (username.length < 3) {
      message = 'Username must be at least 3 characters long';
    } else if (username.length > 20) {
      message = 'Username must be less than 20 characters';
    } else {
      message = 'Username can only contain letters, numbers, and underscores';
    }
  }
  
  return { isValid, message };
};

export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const checks = {
    length: password.length >= minLength,
    upperCase: hasUpperCase,
    lowerCase: hasLowerCase,
    numbers: hasNumbers,
    specialChar: hasSpecialChar
  };
  
  const passedChecks = Object.values(checks).filter(Boolean).length;
  let strength = 'weak';
  
  if (passedChecks >= 4) strength = 'strong';
  else if (passedChecks >= 3) strength = 'medium';
  
  const messages = [];
  if (!checks.length) messages.push('At least 8 characters');
  if (!checks.upperCase) messages.push('One uppercase letter');
  if (!checks.lowerCase) messages.push('One lowercase letter');
  if (!checks.numbers) messages.push('One number');
  if (!checks.specialChar) messages.push('One special character');
  
  return {
    isValid: passedChecks >= 3, // Require at least 3 criteria
    strength,
    checks,
    messages,
    score: passedChecks
  };
};

export const validatePasswordMatch = (password, confirmPassword) => {
  const isValid = password === confirmPassword && password.length > 0;
  return {
    isValid,
    message: isValid ? '' : 'Passwords do not match'
  };
};

// Debounce utility for API calls
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};