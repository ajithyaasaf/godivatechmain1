import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, Redirect } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lock, User, AlertCircle, ArrowRight } from "lucide-react";

// Form schemas
const loginFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

const registerFormSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Form value types
type LoginFormValues = z.infer<typeof loginFormSchema>;
type RegisterFormValues = z.infer<typeof registerFormSchema>;

const AuthPage = () => {
  const { user, loginMutation, registerMutation } = useAuth();
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Clear errors when switching tabs
  useEffect(() => {
    setLoginError(null);
    setRegisterError(null);
  }, [activeTab]);

  // Get redirect path from URL query parameters or session storage
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const redirectPath = queryParams.get('redirect');
    
    if (redirectPath) {
      sessionStorage.setItem('redirectAfterLogin', redirectPath);
    }
  }, []);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Form handlers
  const onLoginSubmit = (values: LoginFormValues) => {
    setLoginError(null);
    
    // Save remember me preference
    if (values.rememberMe) {
      localStorage.setItem("rememberAuth", "true");
    } else {
      localStorage.removeItem("rememberAuth");
    }
    
    // Handle login
    loginMutation.mutate(values, {
      onSuccess: () => {
        // Directly redirect to admin page after successful login
        const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/admin';
        sessionStorage.removeItem('redirectAfterLogin');
        setLocation(redirectPath);
      },
      onError: (error) => {
        setLoginError(error.message || "Login failed. Please check your credentials and try again.");
      }
    });
  };

  const onRegisterSubmit = (values: RegisterFormValues) => {
    setRegisterError(null);
    
    // Omit confirmPassword before submitting
    const { confirmPassword, ...registerData } = values;
    
    registerMutation.mutate(registerData, {
      onSuccess: () => {
        // Directly redirect to admin page after successful registration
        const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/admin';
        sessionStorage.removeItem('redirectAfterLogin');
        setLocation(redirectPath);
      },
      onError: (error) => {
        setRegisterError(error.message || "Registration failed. This username may already be taken.");
      }
    });
  };

  // Determine redirect path after login
  const getRedirectPath = () => {
    // Check for stored redirect path
    const redirectPath = sessionStorage.getItem('redirectAfterLogin');
    if (redirectPath) {
      sessionStorage.removeItem('redirectAfterLogin');
      return redirectPath;
    }
    // Default to admin dashboard
    return "/admin";
  };

  // Redirect if already logged in
  if (user) {
    return <Redirect to={getRedirectPath()} />;
  }

  return (
    <>
      <Helmet>
        <title>Admin Login | GodivaTech Dashboard</title>
        <meta name="description" content="Admin login for GodivaTech website management" />
      </Helmet>

      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/2 bg-primary text-white p-8 lg:p-12 flex items-center justify-center"
        >
          <div className="max-w-md">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">GodivaTech Admin Dashboard</h1>
            <p className="text-lg opacity-90 mb-6">
              Manage your website content with ease. Login to the dashboard to edit your services, 
              blog posts, team members, and more.
            </p>
            <ul className="space-y-2 mb-8">
              <li className="flex items-center">
                <span className="mr-2 bg-white bg-opacity-20 rounded-full p-1">✓</span>
                <span>Manage blog posts and categories</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 bg-white bg-opacity-20 rounded-full p-1">✓</span>
                <span>Add or update services</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 bg-white bg-opacity-20 rounded-full p-1">✓</span>
                <span>Showcase your team and projects</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2 bg-white bg-opacity-20 rounded-full p-1">✓</span>
                <span>View contact messages and subscribers</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Auth Forms */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center bg-muted/10"
        >
          <Card className="w-full max-w-md shadow-xl border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl">Admin Access</CardTitle>
              <CardDescription>
                Login to your admin account or register a new account
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="login" className="mt-0">
                  {loginError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Login failed</AlertTitle>
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                                <Input 
                                  {...field} 
                                  placeholder="Enter your username" 
                                  className="pl-10"
                                  disabled={loginMutation.isPending}
                                  autoComplete="username"
                                />
                              </div>
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
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                                <Input 
                                  {...field} 
                                  type="password" 
                                  placeholder="Enter your password" 
                                  className="pl-10"
                                  disabled={loginMutation.isPending}
                                  autoComplete="current-password"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Remember me
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging in...
                          </>
                        ) : "Login"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                {/* Register Form */}
                <TabsContent value="register" className="mt-0">
                  {registerError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Registration failed</AlertTitle>
                      <AlertDescription>{registerError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                                <Input 
                                  {...field} 
                                  placeholder="Choose a username" 
                                  className="pl-10"
                                  disabled={registerMutation.isPending}
                                  autoComplete="username"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                                <Input 
                                  {...field} 
                                  type="password" 
                                  placeholder="Create a password" 
                                  className="pl-10"
                                  disabled={registerMutation.isPending}
                                  autoComplete="new-password"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                                <Input 
                                  {...field} 
                                  type="password" 
                                  placeholder="Confirm your password" 
                                  className="pl-10"
                                  disabled={registerMutation.isPending}
                                  autoComplete="new-password"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4 text-sm text-muted-foreground border-t pt-6">
              <div className="text-center w-full">
                {activeTab === "login" ? (
                  <p>Don't have an account? <Button variant="link" className="p-0" onClick={() => setActiveTab("register")}>Register</Button></p>
                ) : (
                  <p>Already have an account? <Button variant="link" className="p-0" onClick={() => setActiveTab("login")}>Login</Button></p>
                )}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 mx-auto" 
                onClick={() => setLocation("/")}
              >
                Return to Website <ArrowRight className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default AuthPage;