import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  resetPassword, 
  onAuthStateChange, 
  getCurrentUser 
} from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  isLoading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useFirebaseAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useFirebaseAuth must be used within an AuthProvider');
  }
  return context;
};

export const FirebaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      setIsLoading(true);
      await registerUser(email, password, displayName);
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create an account.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await loginUser(email, password);
      toast({
        title: "Logged in",
        description: "You've been logged in successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Failed to sign in.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // First sign out from Firebase
      await logoutUser();
      
      // Then explicitly clear the current user state
      setCurrentUser(null);
      
      // Clear any tokens or session data that might be stored
      try {
        localStorage.removeItem('firebase:authUser');
        localStorage.removeItem('firebase:auth');
        sessionStorage.removeItem('firebase:authUser');
        sessionStorage.removeItem('firebase:auth');
      } catch (e) {
        console.error("Error clearing Firebase auth data from storage:", e);
      }
      
      toast({
        title: "Logged out",
        description: "You've been logged out successfully.",
      });
      
      // More aggressive navigation to auth page
      setTimeout(() => {
        // If we're still on a page that should be protected
        if (
          window.location.pathname.includes('/admin') || 
          window.location.pathname.includes('/protected')
        ) {
          console.log("Protected route detected after logout, forcing navigation to auth");
          window.location.pathname = '/auth';
        }
      }, 200);
      
    } catch (error: any) {
      console.error("Firebase signOut failed:", error);
      
      toast({
        title: "Logout failed",
        description: error.message || "Failed to sign out.",
        variant: "destructive",
      });
      
      // Try to clear user state even on error
      setCurrentUser(null);
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Send password reset email
  const sendPasswordResetEmail = async (email: string) => {
    try {
      setIsLoading(true);
      await resetPassword(email);
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to send reset email",
        description: error.message || "Failed to send password reset email.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    isLoading,
    signUp,
    signIn,
    signOut,
    sendPasswordResetEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};