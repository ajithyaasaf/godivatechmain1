import { Helmet } from "react-helmet";
import { Mail, Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentDataTable from "@/components/admin/ContentDataTable";

const SubscribersPage = () => {
  // Define columns for the subscribers data table
  const columns = [
    {
      key: "email",
      title: "Email",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <a 
            href={`mailto:${value}`} 
            className="font-medium text-primary hover:underline"
          >
            {value}
          </a>
        </div>
      ),
    },
    {
      key: "createdAt",
      title: "Subscribed On",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{format(new Date(value), "PPP")}</span>
        </div>
      ),
    },
    {
      key: "source",
      title: "Source",
      render: (value: string) => (
        value ? (
          <div className="flex items-center gap-1">
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{value}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">Direct subscription</span>
        )
      ),
    },
  ];

  return (
    <AdminLayout>
      <Helmet>
        <title>Newsletter Subscribers | GodivaTech Admin</title>
      </Helmet>
      
      <ContentDataTable
        title="Newsletter Subscribers"
        endpoint="/subscribers"
        columns={columns}
        renderForm={() => null} // No form needed as subscribers are read-only
      />
    </AdminLayout>
  );
};

export default SubscribersPage;