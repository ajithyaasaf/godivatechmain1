import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

import { 
  BarChart3, 
  Files, 
  FolderKanban, 
  Home, 
  LayoutDashboard, 
  LogOut, 
  LucideIcon, 
  Mail, 
  Menu, 
  MessageSquare, 
  PenTool, 
  Users, 
  UserPlus,
  Wrench,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";


interface NavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, href, active, onClick }: NavItemProps) => (
  <Link href={href}>
    <div 
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
        active 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-secondary"
      }`}
      onClick={onClick}
    >
      <Icon size={18} />
      <span>{label}</span>
    </div>
  </Link>
);

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Get first letter of username for avatar
  const userInitial = user?.username?.charAt(0).toUpperCase() || 'A';

  const handleLogout = async () => {
    try {
      console.log("Starting logout process...");
      
      // 1. Check if we're using Firebase Auth
      const firebaseLogout = async () => {
        try {
          // Import firebase auth functions dynamically to avoid circular dependencies
          const { logoutUser } = await import('@/lib/auth');
          await logoutUser();
          console.log("Firebase logout completed successfully");
          return true;
        } catch (error) {
          console.error("Firebase logout failed:", error);
          return false;
        }
      };
      
      // 2. Clear client-side auth state via the auth context
      if (logoutMutation && typeof logoutMutation.mutateAsync === 'function') {
        try {
          await logoutMutation.mutateAsync();
          console.log("Auth context logout mutation completed");
        } catch (err) {
          console.error("Auth context logout mutation failed:", err);
        }
      }
      
      // 3. Try Firebase logout
      await firebaseLogout();
      
      // 4. Call server-side logout API
      try {
        const response = await fetch('/api/logout', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response.ok) {
          console.log("Server-side logout successful");
        } else {
          console.error("Server-side logout failed with status:", response.status);
        }
      } catch (apiError) {
        console.error("Server-side logout API call failed:", apiError);
      }
      
      // 5. Clear all local storage and session storage items that might contain auth state
      console.log("Clearing all storage...");
      const itemsToClear = [
        'auth_token', 'auth_state', 'user', 'session', 'firebase:auth', 
        'firebase:authUser', 'currentUser', 'token'
      ];
      
      itemsToClear.forEach(item => {
        try {
          localStorage.removeItem(item);
          sessionStorage.removeItem(item);
        } catch (e) {
          console.error(`Failed to remove ${item} from storage:`, e);
        }
      });
      
      // 6. Force clear auth related cookies
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
      
      // 7. Redirect with multiple fallbacks
      console.log("Redirecting to auth page...");
      
      // First try React Router navigation
      setLocation('/auth');
      
      // Then set a timeout to force window location change if still on admin page
      setTimeout(() => {
        if (window.location.pathname.includes('admin')) {
          console.log("Still on admin page after 200ms, forcing hard redirect");
          window.location.pathname = '/auth';
          
          // Final fallback
          setTimeout(() => {
            if (window.location.pathname.includes('admin')) {
              console.log("Still on admin page after 500ms, using full URL redirect");
              window.location.href = `${window.location.origin}/auth`;
            }
          }, 300);
        }
      }, 200);
      
    } catch (error) {
      console.error("Logout process failed with unexpected error:", error);
      
      // Even if everything fails, try to redirect
      alert("Logout had some issues. Redirecting to login page.");
      window.location.href = '/auth';
    }
  };

  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };

  // Navigation items for admin dashboard
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Files, label: "Blog Posts", href: "/admin/blog-posts" },
    { icon: FolderKanban, label: "Categories", href: "/admin/categories" },
    { icon: PenTool, label: "Services", href: "/admin/services" },
    { icon: Users, label: "Team Members", href: "/admin/team-members" },
    { icon: BarChart3, label: "Projects", href: "/admin/projects" },
    { icon: MessageSquare, label: "Testimonials", href: "/admin/testimonials" },
    { icon: Mail, label: "Contact Messages", href: "/admin/contact-messages" },
    { icon: UserPlus, label: "Subscribers", href: "/admin/subscribers" },
    { icon: Wrench, label: "Diagnostics", href: "/diagnostics" },
    { icon: Home, label: "Back to Website", href: "/" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col border-r bg-card">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">GodivaTech</h1>
          <p className="text-sm text-muted-foreground">Admin Dashboard</p>
        </div>
        
        <Separator />
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavItem 
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={location === item.href}
            />
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </aside>

      {/* Mobile Nav Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full"
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu size={20} />
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {mobileNavOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden">
          <motion.div 
            className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-card shadow-lg p-4"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold text-primary">GodivaTech</h1>
              <Button variant="ghost" size="icon" onClick={closeMobileNav}>
                <X size={20} />
              </Button>
            </div>
            
            <Separator className="mb-4" />
            
            <nav className="space-y-1 mb-6">
              {navItems.map((item) => (
                <NavItem 
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  active={location === item.href}
                  onClick={closeMobileNav}
                />
              ))}
            </nav>
            
            <div className="border-t pt-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.username}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen flex flex-col">
        <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;