import { getApiUrl } from '../config/api.js';

class AuthService {
  // Check if username is available
  async checkUsernameAvailability(username) {
    try {
      const response = await fetch(getApiUrl('/api/auth/check-username'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      
      const data = await response.json();
      return {
        available: data.available,
        message: data.message
      };
    } catch (error) {
      console.error('Username check error:', error);
      return {
        available: false,
        message: 'Unable to check username availability'
      };
    }
  }

  // Check if email is available
  async checkEmailAvailability(email) {
    try {
      const response = await fetch(getApiUrl('/api/auth/check-email'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      return {
        available: data.available,
        message: data.message
      };
    } catch (error) {
      console.error('Email check error:', error);
      return {
        available: false,
        message: 'Unable to check email availability'
      };
    }
  }

  // Login user
  async login(credentials, rememberMe = false) {
    try {
      const response = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...credentials,
          rememberMe
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token based on remember me preference
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('authToken', data.token);
        
        // Always store user data in localStorage for consistency
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return {
          success: true,
          data: data
        };
      } else {
        return {
          success: false,
          message: data.message || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await fetch(getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      return {
        success: response.ok,
        message: data.message,
        data: response.ok ? data : null
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  // Request password reset
  async requestPasswordReset(email) {
    try {
      const response = await fetch(getApiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      return {
        success: response.ok,
        message: data.message
      };
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  // Reset password with token
  async resetPassword(token, newPassword) {
    try {
      const response = await fetch(getApiUrl('/api/auth/reset-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password: newPassword }),
      });

      const data = await response.json();

      return {
        success: response.ok,
        message: data.message
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  // Verify token
  async verifyToken(token) {
    try {
      const response = await fetch(getApiUrl('/api/auth/check-token'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }

  // Get stored token
  getStoredToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }

  // Google OAuth login
  async googleLogin(googleData) {
    try {
      const response = await fetch(getApiUrl('/api/auth/google'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: googleData.idToken,
          email: googleData.email,
          name: googleData.name,
          firstName: googleData.firstName,
          lastName: googleData.lastName,
          imageUrl: googleData.imageUrl,
          googleId: googleData.id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage for Google OAuth (always remember)
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return {
          success: true,
          data: data
        };
      } else {
        return {
          success: false,
          message: data.message || 'Google authentication failed'
        };
      }
    } catch (error) {
      console.error('Google login error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  // Clear stored auth data
  clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
  }
}

export default new AuthService();