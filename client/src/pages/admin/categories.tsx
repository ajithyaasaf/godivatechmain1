import { Helmet } from "react-helmet";
import { FolderOpen } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentDataTable from "@/components/admin/ContentDataTable";
import CategoryForm from "@/components/admin/CategoryForm";

const CategoriesPage = () => {
  // Define columns for the categories data table
  const columns = [
    {
      key: "name",
      title: "Name",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
          <div className="font-medium">{value}</div>
        </div>
      ),
    },
    {
      key: "slug",
      title: "Slug",
      render: (value: string) => (
        <div className="font-mono text-xs">{value}</div>
      ),
    },
    {
      key: "description",
      title: "Description",
      render: (value: string) => (
        <div className="truncate max-w-[400px]">
          {value || <span className="text-muted-foreground italic">No description</span>}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Helmet>
        <title>Manage Categories | GodivaTech Admin</title>
      </Helmet>
      
      <ContentDataTable
        title="Categories"
        endpoint="/categories"
        columns={columns}
        renderForm={(category, onSave, onCancel) => (
          <CategoryForm category={category} onSave={onSave} onCancel={onCancel} />
        )}
      />
    </AdminLayout>
  );
};

export default CategoriesPage;