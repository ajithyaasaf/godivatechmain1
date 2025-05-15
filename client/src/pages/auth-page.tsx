import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertUserSchema } from "@/lib/schema";
import { Loader2 } from "lucide-react";

// Create login schema (subset of user schema)
const loginSchema = insertUserSchema.pick({
  username: true,
  password: true,
});

export default function AuthPage() {
  const { user, isAuthenticated, login, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is already logged in, redirect to admin page
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User is already authenticated, redirecting to /admin");
      setLocation("/admin");
    }
  }, [isAuthenticated, user, setLocation]);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "admin",
      password: ""
    }
  });

  // Handle login submission
  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    try {
      setIsSubmitting(true);
      console.log("Attempting login with:", values.username);
      
      const success = await login(values.username, values.password);
      
      if (success) {
        console.log("Login successful, redirecting to /admin");
        // Redirect to admin dashboard after successful login
        setTimeout(() => {
          window.location.href = '/admin';
        }, 500);
      } else {
        console.log("Login failed");
        loginForm.setError("password", { 
          type: "manual", 
          message: "Invalid username or password" 
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      loginForm.setError("password", { 
        type: "manual", 
        message: error instanceof Error ? error.message : "An unknown error occurred" 
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              GodivaTech Admin
            </CardTitle>
            <CardDescription className="text-center">
              Admin users only - Sign in to access the portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Login form */}
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <div className="text-[10px] text-muted-foreground mt-1 italic opacity-70">
                        Hint: Default is admin123
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting || isLoading}
                >
                  {(isSubmitting || isLoading) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Administration Portal - GodivaTech
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right side - Hero image and content */}
      <div className="hidden lg:block lg:w-1/2 bg-primary-50 p-8">
        <div className="h-full flex flex-col justify-center items-center text-center px-8">
          <h1 className="text-4xl font-bold mb-6 text-primary">
            Advanced Technology Solutions
          </h1>
          <p className="text-lg mb-8 text-gray-700">
            Join our platform to access premium technology services, expert consultations, and exclusive content to help your business grow in the digital age.
          </p>
          <div className="space-y-4 text-left w-full max-w-md">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                ✓
              </div>
              <div>
                <h3 className="font-medium">Custom Software Development</h3>
                <p className="text-sm text-gray-600">Tailored solutions for your unique business needs</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                ✓
              </div>
              <div>
                <h3 className="font-medium">Digital Transformation</h3>
                <p className="text-sm text-gray-600">Modernize your business processes and systems</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                ✓
              </div>
              <div>
                <h3 className="font-medium">IT Consulting</h3>
                <p className="text-sm text-gray-600">Expert guidance for your technology decisions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}