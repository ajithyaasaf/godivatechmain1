import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DeploymentDiagnostic } from "@/components/admin/DeploymentDiagnostic";
import {
  BarChart3,
  CalendarDays,
  FileText,
  MessageSquareText,
  RefreshCw,
  Users2,
  Wrench,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

const StatCard = ({ title, value, icon, description }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [today] = useState(new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }));

  // Fetch count data for dashboard
  const { data: blogPosts = [] } = useQuery<any[]>({ 
    queryKey: ['/api/blog-posts'],
  });
  
  const { data: services = [] } = useQuery<any[]>({ 
    queryKey: ['/api/services'],
  });
  
  const { data: testimonials = [] } = useQuery<any[]>({ 
    queryKey: ['/api/testimonials'],
  });
  
  const { data: teamMembers = [] } = useQuery<any[]>({ 
    queryKey: ['/api/team-members'],
  });

  // For contact messages and subscribers, we'll create a placeholder as these require admin access
  const { data: contactMessages = [], isLoading: messagesLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/contact-messages'],
    retry: false, // Don't retry if unauthorized
  });

  const { data: subscribers = [], isLoading: subscribersLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/subscribers'],
    retry: false, // Don't retry if unauthorized
  });

  return (
    <AdminLayout>
      <Helmet>
        <title>Admin Dashboard | GodivaTech</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">{today}</p>
        </div>
        <Button variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Total Blog Posts" 
          value={(blogPosts as any[]).length} 
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          description="Manage your blog content from the Blog Posts section"
        />
        <StatCard 
          title="Services" 
          value={(services as any[]).length} 
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
          description="Update your service offerings to showcase your expertise"
        />
        <StatCard 
          title="Team Members" 
          value={(teamMembers as any[]).length} 
          icon={<Users2 className="h-4 w-4 text-muted-foreground" />}
          description="Showcase your team members on the About page"
        />
        <StatCard 
          title="Testimonials" 
          value={(testimonials as any[]).length} 
          icon={<MessageSquareText className="h-4 w-4 text-muted-foreground" />}
          description="Client reviews and testimonials"
        />
        <StatCard 
          title="Contact Messages" 
          value={messagesLoading ? "Loading..." : (contactMessages as any[]).length} 
          icon={<MessageSquareText className="h-4 w-4 text-muted-foreground" />}
          description="Messages from your contact form"
        />
        <StatCard 
          title="Newsletter Subscribers" 
          value={subscribersLoading ? "Loading..." : (subscribers as any[]).length} 
          icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
          description="Email subscribers for your newsletter"
        />
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button asChild>
            <a href="/admin/blog-posts">Manage Blog Posts</a>
          </Button>
          <Button asChild>
            <a href="/admin/services">Manage Services</a>
          </Button>
          <Button asChild>
            <a href="/admin/testimonials">Manage Testimonials</a>
          </Button>
          <Button asChild>
            <a href="/admin/team-members">Manage Team</a>
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Dashboard Overview</TabsTrigger>
            <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
            <TabsTrigger value="diagnostic">Deployment Diagnostic</TabsTrigger>
            <TabsTrigger value="tips">Admin Tips</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="p-4">
            <h3 className="text-lg font-medium mb-2">Welcome to your Admin Dashboard</h3>
            <p className="text-muted-foreground">
              This dashboard gives you an overview of your website content and provides
              quick access to manage various aspects of your GodivaTech website. Use the 
              sidebar navigation to access specific content management areas.
            </p>
          </TabsContent>
          <TabsContent value="analytics" className="p-4">
            <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
            <p className="text-muted-foreground">
              Website analytics and visitor statistics will be available in a future update.
              For now, focus on managing your content and keeping your website up-to-date.
            </p>
          </TabsContent>
          <TabsContent value="diagnostic" className="p-4">
            <DeploymentDiagnostic />
          </TabsContent>
          <TabsContent value="tips" className="p-4">
            <h3 className="text-lg font-medium mb-2">Admin Tips</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Regularly update your blog with fresh content to improve SEO</li>
              <li>Add testimonials from satisfied clients to build trust</li>
              <li>Keep your services section up-to-date with your current offerings</li>
              <li>Showcase your team members to add a personal touch to your business</li>
              <li>Respond to contact messages promptly to engage potential clients</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;