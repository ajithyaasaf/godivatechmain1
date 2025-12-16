import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import authService from '@/services/AuthService';
import { useToast } from '@/hooks/use-toast';
import { User as SelectUser } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';

// Define context type
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: SelectUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch user data
  const { data: user = null } = useQuery<SelectUser | null>({
    queryKey: ['/api/user'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: isAuthenticated,
  });

  // Subscribe to auth service on mount
  useEffect(() => {
    const unsubscribe = authService.subscribe((authenticated) => {
      console.log('Auth state changed:', authenticated);
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    });

    // Check initial auth state
    authService.isAuthenticated().then((authenticated) => {
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await authService.login(username, password);
      
      if (success) {
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
        });
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid credentials',
          variant: 'destructive',
        });
      }
      
      return success;
    } catch (error) {
      console.error('Login error:', error);
      
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
    } catch (error) {
      console.error('Logout error:', error);
      
      toast({
        title: 'Logout issue',
        description: 'There was an issue during logout, but you have been redirected',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Provide the context value
  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    user: user || null,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};