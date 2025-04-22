import { ReactNode } from 'react';
import { Redirect, useLocation } from 'wouter';
import { useFirebaseAuth } from '@/hooks/use-firebase-auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  allowRoles?: string[];
}

/**
 * A component that protects routes requiring authentication
 * If user is not authenticated, redirects to login page
 */
export const FirebaseProtectedRoute = ({ 
  children, 
  redirectTo = '/auth',
  allowRoles = []
}: ProtectedRouteProps) => {
  const { currentUser, isLoading } = useFirebaseAuth();
  const [, setLocation] = useLocation();

  // If auth is still initializing, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  // If no user is logged in, redirect to auth page
  if (!currentUser) {
    // Store the intended destination for redirect after login
    const currentPath = window.location.pathname;
    sessionStorage.setItem('redirectAfterLogin', currentPath);
    
    return <Redirect to={redirectTo} />;
  }

  // If role-based permissions are required, check for custom claims/roles
  // This is a placeholder - you'd implement based on your Firebase auth setup
  if (allowRoles.length > 0) {
    // Get user's custom claims - you would need to fetch these from your backend
    // or store in Firestore. This is just a placeholder.
    const userRoles: string[] = []; // Replace with actual user roles
    
    const hasRequiredRole = allowRoles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-center mb-4">
            You don't have permission to access this page.
          </p>
          <button 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            onClick={() => setLocation('/')}
          >
            Return to Home
          </button>
        </div>
      );
    }
  }

  // User is authenticated (and has required roles if specified)
  return <>{children}</>;
};