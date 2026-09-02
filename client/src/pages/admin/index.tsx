import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Briefcase,
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
    <>
      <Helmet>
        <title>Admin Dashboard - Godiva Tech</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AdminLayout>

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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <a href="/admin/careers" className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                <span>Job Applications</span>
              </a>
            </Button>
            <Button asChild>
              <a href="/admin/contact-messages">Contact Messages</a>
            </Button>
            <Button asChild>
              <a href="/admin/blog-posts">Manage Blog Posts</a>
            </Button>
            <Button asChild>
              <a href="/admin/services">Manage Services</a>
            </Button>
            <Button asChild>
              <a href="/admin/testimonials">Manage Testimonials</a>
            </Button>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;