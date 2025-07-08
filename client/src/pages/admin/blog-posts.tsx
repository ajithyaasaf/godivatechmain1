import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { Check, FileText, X } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentDataTable from "@/components/admin/ContentDataTable";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { Badge } from "@/components/ui/badge";

const BlogPostsPage = () => {
  // Define columns for the data table
  const columns = [
    {
      key: "title",
      title: "Title",
      render: (value: string, item: any) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <div className="font-medium">{value}</div>
        </div>
      ),
    },
    {
      key: "categoryId",
      title: "Category", 
      render: (value: number, item: any) => (
        <div>{item.category?.name || "Uncategorized"}</div>
      ),
    },
    {
      key: "authorName",
      title: "Author",
    },
    {
      key: "publishedAt",
      title: "Published Date",
      render: (value: string) => (
        <div>{format(new Date(value), "MMM d, yyyy")}</div>
      ),
    },
    {
      key: "published",
      title: "Status",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "outline"}>
          {value ? (
            <div className="flex items-center gap-1">
              <Check className="h-3.5 w-3.5" />
              <span>Published</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <X className="h-3.5 w-3.5" />
              <span>Draft</span>
            </div>
          )}
        </Badge>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Helmet>
        <title>Manage Blog Posts | GodivaTech Admin</title>
      </Helmet>
      
      <ContentDataTable
        title="Blog Posts"
        endpoint="/blog-posts"
        columns={columns}
        renderForm={(post, onSave, onCancel) => (
          <BlogPostForm post={post} onSave={onSave} onCancel={onCancel} />
        )}
      />
    </AdminLayout>
  );
};

export default BlogPostsPage;