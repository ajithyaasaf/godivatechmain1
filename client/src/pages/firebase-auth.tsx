import { useEffect } from "react";
import { useLocation } from "wouter";
import { FirebaseAuthForm } from "@/components/auth/firebase-auth-form";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";

export default function FirebaseAuthPage() {
  const { currentUser, isLoading } = useFirebaseAuth();
  const [, setLocation] = useLocation();

  // Redirect to home/dashboard if already logged in
  useEffect(() => {
    if (!isLoading && currentUser) {
      // Check if there's a redirect URL saved
      const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
      
      if (redirectUrl) {
        sessionStorage.removeItem("redirectAfterLogin");
        setLocation(redirectUrl);
      } else {
        setLocation("/admin");
      }
    }
  }, [currentUser, isLoading, setLocation]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (currentUser) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Auth form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to your account
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your credentials to access the admin dashboard
            </p>
          </div>
          <FirebaseAuthForm />
        </div>
      </div>

      {/* Right side - Hero/branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-center bg-muted p-12">
        <div className="mx-auto w-full max-w-lg">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">
              GodivaTech Admin
            </h2>
            <p className="text-muted-foreground">
              Welcome to the GodivaTech admin dashboard. Manage your website content,
              services, team members, and blog posts from a single interface.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <svg
                  className="h-4 w-4 mr-2 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Manage blog posts and categories
              </li>
              <li className="flex items-center">
                <svg
                  className="h-4 w-4 mr-2 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Update services and team information
              </li>
              <li className="flex items-center">
                <svg
                  className="h-4 w-4 mr-2 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Handle contact messages and subscribers
              </li>
              <li className="flex items-center">
                <svg
                  className="h-4 w-4 mr-2 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Upload media and manage projects
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}