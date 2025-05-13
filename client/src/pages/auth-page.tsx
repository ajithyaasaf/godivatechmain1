import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertUserSchema } from "@/lib/schema";
import { Loader2 } from "lucide-react";

// Create login schema (subset of user schema)
const loginSchema = insertUserSchema.pick({
  username: true,
  password: true,
});

// Create registration schema including confirmPassword
const registrationSchema = insertUserSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Registration schema type
type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [location, setLocation] = useLocation();

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  // Registration form
  const registrationForm = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      name: ""
    }
  });

  // Handle login submission
  function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    loginMutation.mutate(values);
  }

  // Handle registration submission
  function onRegisterSubmit(values: RegistrationFormValues) {
    // Remove confirmPassword as it's not in the user schema
    const { confirmPassword, ...userData } = values;
    registerMutation.mutate(userData);
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Welcome to GodivaTech
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to access your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
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
                          <FormMessage />
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
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registrationForm}>
                  <form onSubmit={registrationForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registrationForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registrationForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registrationForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Create a password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registrationForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm your password" {...field} />
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
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              {activeTab === "login" 
                ? "Don't have an account? " 
                : "Already have an account? "}
              <Button 
                variant="link" 
                className="p-0" 
                onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
              >
                {activeTab === "login" ? "Register" : "Login"}
              </Button>
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