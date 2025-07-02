import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

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
  const { user, logout, isLoading } = useAuth();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get first letter of username for avatar
  const userInitial = user?.username?.charAt(0).toUpperCase() || 'A';

  const handleLogout = async () => {
    try {
      // Set loading state
      setIsLoggingOut(true);
      
      // Log for debugging
      console.log("AdminLayout: Initiating logout process");
      
      // Use centralized logout from AuthService via AuthContext
      await logout();
      
      // Note: No need to manually redirect as our AuthService handles it
      console.log("AdminLayout: Logout sequence completed");
      
    } catch (error) {
      console.error("AdminLayout: Error during logout:", error);
      
      // Even if there's an error, force redirect to auth page
      window.location.replace('/auth');
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
            disabled={isLoggingOut || isLoading}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut || isLoading ? "Logging out..." : "Logout"}
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
                disabled={isLoggingOut || isLoading}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut || isLoading ? "Logging out..." : "Logout"}
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