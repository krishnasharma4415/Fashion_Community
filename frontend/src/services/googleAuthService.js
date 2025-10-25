// Google OAuth Service using Google Identity Services (GSI)
class GoogleAuthService {
  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '238655844704-tmfnritcgcc6pb7mh9vuir47t8qfl6sv.apps.googleusercontent.com';
    this.isInitialized = false;
  }

  // Initialize Google Identity Services
  async initialize() {
    if (this.isInitialized) return Promise.resolve();

    return new Promise((resolve, reject) => {
      // Load Google Identity Services script
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => {
          this.isInitialized = true;
          resolve();
        };
        script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
        document.head.appendChild(script);
      } else {
        this.isInitialized = true;
        resolve();
      }
    });
  }

  // Sign in with Google using popup
  async signInWithPopup() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      return new Promise((resolve, reject) => {
        window.google.accounts.id.initialize({
          client_id: this.clientId,
          callback: (response) => {
            this.handleCredentialResponse(response)
              .then(resolve)
              .catch(reject);
          }
        });

        // Trigger the sign-in flow
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback to renderButton if prompt is not shown
            this.renderSignInButton()
              .then(resolve)
              .catch(reject);
          }
        });
      });
    } catch (error) {
      console.error('Google sign-in error:', error);
      return {
        success: false,
        error: error.message || 'Google sign-in failed'
      };
    }
  }

  // Render sign-in button (fallback method)
  async renderSignInButton() {
    return new Promise((resolve, reject) => {
      // Create a temporary container for the button
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.top = '-9999px';
      container.id = 'google-signin-button-temp';
      document.body.appendChild(container);

      window.google.accounts.id.renderButton(container, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left'
      });

      // Simulate button click
      setTimeout(() => {
        const button = container.querySelector('div[role="button"]');
        if (button) {
          button.click();
        } else {
          reject(new Error('Could not find Google sign-in button'));
        }
        
        // Clean up
        document.body.removeChild(container);
      }, 100);

      // Set up callback for when sign-in completes
      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response) => {
          this.handleCredentialResponse(response)
            .then(resolve)
            .catch(reject);
        }
      });
    });
  }

  // Handle the credential response from Google
  async handleCredentialResponse(response) {
    try {
      // Decode the JWT token to get user info
      const userInfo = this.parseJwt(response.credential);
      
      return {
        success: true,
        data: {
          id: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          imageUrl: userInfo.picture,
          idToken: response.credential,
          emailVerified: userInfo.email_verified
        }
      };
    } catch (error) {
      console.error('Error handling Google credential:', error);
      return {
        success: false,
        error: 'Failed to process Google authentication'
      };
    }
  }

  // Parse JWT token (simple implementation for client-side)
  parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid JWT token');
    }
  }

  // Sign out (revoke Google session)
  async signOut() {
    try {
      if (!this.isInitialized) return { success: true };
      
      // Google Identity Services doesn't have a direct sign-out method
      // The sign-out is handled by clearing local session
      return { success: true };
    } catch (error) {
      console.error('Google sign-out error:', error);
      return { success: false, error: error.message };
    }
  }

  // One-tap sign-in
  async initializeOneTap(callback) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: callback,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      window.google.accounts.id.prompt();
    } catch (error) {
      console.error('One-tap initialization error:', error);
    }
  }

  // Render Google Sign-In button in a specific element
  renderButton(elementId, options = {}) {
    if (!this.isInitialized) {
      console.error('Google Auth Service not initialized');
      return;
    }

    const defaultOptions = {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      text: 'signin_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      ...options
    };

    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      defaultOptions
    );
  }
}

export default new GoogleAuthService();