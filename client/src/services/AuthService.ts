import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithRedirect
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { queryClient } from '@/lib/queryClient';

/**
 * AuthService - Centralized service for authentication
 * Handles both Firebase and Session-based authentication
 */
class AuthService {
  // Flag to track if we're using Firebase or session auth
  private _useFirebase: boolean = true;
  
  // Current user from Firebase
  private _currentFirebaseUser: FirebaseUser | null = null;
  
  // Track auth listeners
  private _authListeners: Array<(isAuthenticated: boolean) => void> = [];
  
  constructor() {
    // Set up auth state listener
    this.setupAuthListener();
    
    // Log initialization
    console.log('AuthService initialized. Mode:', this._useFirebase ? 'Firebase' : 'Session');
  }
  
  /**
   * Set up auth state listeners for Firebase
   */
  private setupAuthListener() {
    // Firebase auth state listener
    onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      this._currentFirebaseUser = user;
      this.notifyListeners(!!user);
    });
    
    // Watch for local storage changes (for session auth)
    window.addEventListener('storage', (e) => {
      if (e.key === 'auth_status' || e.key === null) {
        this.checkSessionAuth();
      }
    });
  }
  
  /**
   * Check if we have a valid session auth
   */
  private async checkSessionAuth(): Promise<boolean> {
    try {
      const response = await fetch('/api/user', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to check session auth:', error);
      return false;
    }
  }
  
  /**
   * Subscribe to auth state changes
   */
  public subscribe(callback: (isAuthenticated: boolean) => void): () => void {
    this._authListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this._authListeners = this._authListeners.filter(cb => cb !== callback);
    };
  }
  
  /**
   * Notify all listeners of auth state change
   */
  private notifyListeners(isAuthenticated: boolean) {
    this._authListeners.forEach(callback => {
      try {
        callback(isAuthenticated);
      } catch (error) {
        console.error('Error in auth listener callback:', error);
      }
    });
  }
  
  /**
   * Login with email and password
   */
  public async login(username: string, password: string): Promise<boolean> {
    try {
      if (this._useFirebase) {
        // Firebase login
        await signInWithEmailAndPassword(auth, username, password);
        this.notifyListeners(true);
        return true;
      } else {
        // Session based login
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
          credentials: 'include',
        });
        
        if (response.ok) {
          localStorage.setItem('auth_status', 'authenticated');
          this.notifyListeners(true);
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }
  
  /**
   * Login with Google (Firebase only)
   */
  public async loginWithGoogle(): Promise<void> {
    if (!this._useFirebase) {
      throw new Error('Google login is only available with Firebase authentication');
    }
    
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  }
  
  /**
   * Logout user from both Firebase and session
   */
  public async logout(): Promise<void> {
    try {
      console.log("AuthService: Executing comprehensive logout process");
      
      // Clear client data first
      this.clearAuthData();
      
      // Try session logout
      try {
        const response = await fetch('/api/logout', {
          method: 'POST',
          credentials: 'include',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache'
          }
        });
        
        console.log("AuthService: Session logout response:", response.status);
        
      } catch (error) {
        console.error('AuthService: Session logout error:', error);
      }
      
      // Try Firebase logout if we're using it
      if (this._useFirebase) {
        try {
          console.log("AuthService: Attempting Firebase signOut");
          await signOut(auth);
          console.log("AuthService: Firebase signOut successful");
        } catch (error) {
          console.error('AuthService: Firebase logout error:', error);
        }
      }
      
      // Notify all listeners
      this.notifyListeners(false);
      
      // Force hard redirect to auth page
      console.log("AuthService: Forcing navigation to /auth page");
      setTimeout(() => {
        window.location.replace('/auth');
      }, 100);
      
    } catch (error) {
      console.error('AuthService: Logout failed:', error);
      
      // Even if logout fails, redirect to auth page
      console.log("AuthService: Error during logout, still redirecting to /auth");
      window.location.replace('/auth');
    }
  }
  
  /**
   * Clear all auth related data
   */
  private clearAuthData() {
    console.log("AuthService: Clearing all auth data");
    
    // Clear query cache
    queryClient.clear();
    
    // Clear localStorage
    try {
      const keysToRemove = [
        'auth_status', 'auth_token', 'user', 'firebase:authUser', 
        'firebase:auth', 'session', 'currentUser'
      ];
      
      console.log("AuthService: Clearing localStorage items:", keysToRemove.join(', '));
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (e) {
      console.error('AuthService: Error clearing localStorage:', e);
    }
    
    // Clear sessionStorage
    try {
      console.log("AuthService: Clearing sessionStorage");
      sessionStorage.clear();
    } catch (e) {
      console.error('AuthService: Error clearing sessionStorage:', e);
    }
    
    // Clear cookies
    try {
      console.log("AuthService: Clearing cookies");
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
    } catch (e) {
      console.error('AuthService: Error clearing cookies:', e);
    }
  }
  
  /**
   * Check if user is authenticated
   */
  public async isAuthenticated(): Promise<boolean> {
    if (this._useFirebase && this._currentFirebaseUser) {
      return true;
    }
    
    return await this.checkSessionAuth();
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;