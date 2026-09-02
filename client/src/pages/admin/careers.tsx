import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Briefcase, 
  Mail, 
  Phone, 
  User, 
  ExternalLink, 
  FileText, 
  Trash2, 
  Search, 
  RefreshCw,
  Clock,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import AdminLayout from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface ApplicationDetailProps {
  application: any;
  onClose: () => void;
}

const ApplicationDetail = ({ application, onClose }: ApplicationDetailProps) => {
  if (!application) return null;

  // Extract resume link if present in message or properties
  const messageText = application.message || "";
  const resumeMatch = messageText.match(/Resume(?:\s*Link)?:\s*(https?:\/\/[^\s\n\r]+)/i);
  const resumeUrl = application.resumeUrl || (resumeMatch ? resumeMatch[1] : null);

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <DialogTitle>Application from {application.name}</DialogTitle>
        </div>
        <DialogDescription>
          Submitted on {application.createdAt ? format(new Date(application.createdAt), "PPP 'at' p") : "Recent"}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-3">
        {/* Candidate Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/40 border">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Candidate Name</div>
              <div className="font-semibold text-sm">{application.name}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Email Address</div>
              <a href={`mailto:${application.email}`} className="font-medium text-sm text-primary hover:underline">
                {application.email}
              </a>
            </div>
          </div>

          {application.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Phone Number</div>
                <a href={`tel:${application.phone}`} className="font-medium text-sm text-primary hover:underline">
                  {application.phone}
                </a>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Position / Role</div>
              <Badge variant="secondary" className="font-medium mt-0.5">
                {application.subject?.replace(/^Career Application:\s*/i, "") || "General Application"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Resume Button if provided */}
        {resumeUrl && (
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium text-sm text-blue-900">Candidate Resume / Portfolio</div>
                <div className="text-xs text-blue-700 truncate max-w-[320px] sm:max-w-md">{resumeUrl}</div>
              </div>
            </div>
            <Button size="sm" asChild variant="default" className="gap-1 bg-blue-600 hover:bg-blue-700">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <span>Open Resume</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        )}

        {/* Message / Cover Note */}
        <div>
          <div className="font-semibold text-sm mb-1.5 flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Cover Note & Message
          </div>
          <div className="whitespace-pre-wrap bg-muted/60 p-4 rounded-lg text-sm border font-mono">
            {application.message || "No cover note provided."}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={onClose} variant="outline">Close</Button>
      </div>
    </DialogContent>
  );
};

const AdminCareersPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch contact messages (auto-polls every 3s so new applicants appear in real-time)
  const { data: messages = [], isLoading, refetch } = useQuery<any[]>({
    queryKey: ["/api/contact-messages"],
    refetchInterval: 3000,
    refetchOnWindowFocus: true,
  });

  // Filter career applications specifically
  const careerApplications = messages.filter((msg: any) => {
    const subject = (msg.subject || "").toLowerCase();
    const message = (msg.message || "").toLowerCase();
    return (
      subject.includes("career") ||
      subject.includes("job") ||
      subject.includes("application") ||
      subject.includes("designer") ||
      subject.includes("marketing") ||
      subject.includes("intern") ||
      subject.includes("developer") ||
      message.includes("resume") ||
      message.includes("applying for")
    );
  });

  // Delete application mutation with instant 0ms optimistic UI update
  const deleteMutation = useMutation({
    mutationFn: async (id: number | string) => {
      const response = await fetch(`/api/admin/contact-messages/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete application from server");
      }
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["/api/contact-messages"] });
      const previousData = queryClient.getQueryData(["/api/contact-messages"]);

      // Instant optimistic removal from UI
      queryClient.setQueryData(["/api/contact-messages"], (old: any[] = []) => {
        if (!Array.isArray(old)) return old;
        return old.filter(item => {
          const id = item.id || item.docId || item.firebaseId;
          return String(id) !== String(deletedId);
        });
      });

      return { previousData };
    },
    onSuccess: () => {
      toast({
        title: "Application Deleted",
        description: "The application has been successfully removed.",
      });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
      }, 300);
    },
    onError: (error: Error, _, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(["/api/contact-messages"], context.previousData);
      }
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (item: any) => {
    if (confirm(`Are you sure you want to delete the job application from ${item.name}?`)) {
      const id = item.id || item.docId || item.firebaseId;
      deleteMutation.mutate(id);
    }
  };

  const handleOpenDetail = (app: any) => {
    setSelectedApp(app);
    setIsDialogOpen(true);
  };

  // Search filter
  const filteredApps = careerApplications.filter((app: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (app.name && app.name.toLowerCase().includes(q)) ||
      (app.email && app.email.toLowerCase().includes(q)) ||
      (app.subject && app.subject.toLowerCase().includes(q)) ||
      (app.phone && app.phone.toLowerCase().includes(q))
    );
  });

  return (
    <AdminLayout>
      <Helmet>
        <title>Job Applications | GodivaTech Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2.5">
              <Briefcase className="h-7 w-7 text-primary" />
              Job Applications
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Review and manage incoming candidate applications from the Careers page.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetch();
                toast({ title: "Refreshed", description: "Application list is up to date." });
              }}
              className="gap-1.5"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{careerApplications.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Openings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">3 Roles</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Live Auto-Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Active (3s Interval)
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by candidate name, role, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Applications Table */}
        <div className="rounded-md border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Candidate</TableHead>
                <TableHead>Applied Position</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    Loading applications...
                  </TableCell>
                </TableRow>
              ) : filteredApps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <Briefcase className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                    No job applications found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredApps.map((app: any) => {
                  const role = app.subject?.replace(/^Career Application:\s*/i, "") || "General Application";
                  const messageText = app.message || "";
                  const resumeMatch = messageText.match(/Resume(?:\s*Link)?:\s*(https?:\/\/[^\s\n\r]+)/i);
                  const resumeUrl = app.resumeUrl || (resumeMatch ? resumeMatch[1] : null);

                  return (
                    <TableRow key={app.id || app.docId} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="font-semibold text-slate-900">{app.name}</div>
                        <a href={`mailto:${app.email}`} className="text-xs text-primary hover:underline">
                          {app.email}
                        </a>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="font-medium bg-blue-50/50 text-blue-700 border-blue-200">
                          {role}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="text-xs text-muted-foreground">
                          {app.phone ? (
                            <a href={`tel:${app.phone}`} className="hover:underline flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {app.phone}
                            </a>
                          ) : (
                            "—"
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        {resumeUrl ? (
                          <Button size="sm" variant="outline" asChild className="h-8 text-xs gap-1">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                              <span>Resume</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">In Note</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {app.createdAt ? format(new Date(app.createdAt), "MMM d, yyyy") : "Recent"}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 gap-1 text-xs"
                            onClick={() => handleOpenDetail(app)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View</span>
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(app)}
                            title="Delete Application"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <ApplicationDetail
          application={selectedApp}
          onClose={() => setIsDialogOpen(false)}
        />
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCareersPage;
