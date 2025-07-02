import { Helmet } from "react-helmet";
import { Settings } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentDataTable from "@/components/admin/ContentDataTable";
import ServiceForm from "@/components/admin/ServiceForm";

const ServicesPage = () => {
  // Define columns for the services data table
  const columns = [
    {
      key: "title",
      title: "Service Name",
      render: (value: string, item: any) => (
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <div className="font-medium">{value}</div>
        </div>
      ),
    },
    {
      key: "description",
      title: "Description",
      render: (value: string) => (
        <div className="truncate max-w-[400px]">{value}</div>
      ),
    },
    {
      key: "slug",
      title: "URL Slug",
      render: (value: string) => (
        <div className="font-mono text-xs">{value}</div>
      ),
    },
    {
      key: "icon",
      title: "Icon",
    },
  ];

  return (
    <AdminLayout>
      <Helmet>
        <title>Manage Services | GodivaTech Admin</title>
      </Helmet>
      
      <ContentDataTable
        title="Services"
        endpoint="/services"
        columns={columns}
        renderForm={(service, onSave, onCancel) => (
          <ServiceForm service={service} onSave={onSave} onCancel={onCancel} />
        )}
      />
    </AdminLayout>
  );
};

export default ServicesPage;