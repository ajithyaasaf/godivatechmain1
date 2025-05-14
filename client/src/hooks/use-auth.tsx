import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<Response, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, InsertUser>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | null, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Welcome back!",
        description: `You're now logged in as ${user.name || user.username}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Account created!",
        description: `Welcome to GodivaTech, ${user.name || user.username}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        console.log("Logging out via API request...");
        const response = await apiRequest("POST", "/api/logout");
        console.log("Logout API response:", response.status);
        return response;
      } catch (error) {
        console.error("Logout API request failed:", error);
        throw error;
      }
    },
    onMutate: () => {
      console.log("Logout mutation started");
      // Immediately set user to null without waiting for API response
      // This ensures UI updates immediately
      queryClient.setQueryData(["/api/user"], null);
    },
    onSuccess: () => {
      // Clear any cached admin data
      console.log("Successfully logged out, clearing query cache");
      queryClient.setQueryData(["/api/user"], null);
      queryClient.invalidateQueries();
      
      // Clear any auth-related local storage items
      try {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_user');
        sessionStorage.removeItem('auth_token');
      } catch (e) {
        console.error("Error clearing auth data from storage:", e);
      }
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      // Force navigation if still on a protected route
      setTimeout(() => {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/admin') || currentPath.includes('/protected')) {
          console.log("Still on protected route after logout, forcing navigation");
          window.location.pathname = '/auth';
        }
      }, 100);
    },
    onError: (error: Error) => {
      console.error("Logout mutation error:", error);
      
      // Even on error, we should clear the user data
      queryClient.setQueryData(["/api/user"], null);
      
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
      
      // Still try to navigate away from protected routes
      setTimeout(() => {
        if (window.location.pathname.includes('/admin')) {
          window.location.pathname = '/auth';
        }
      }, 100);
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}