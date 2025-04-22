import { Helmet } from "react-helmet";
import { Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentDataTable from "@/components/admin/ContentDataTable";
import TestimonialForm from "@/components/admin/TestimonialForm";

const TestimonialsPage = () => {
  // Define columns for the testimonials data table
  const columns = [
    {
      key: "name",
      title: "Client",
      render: (value: string, item: any) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={item.image || undefined} alt={value} />
            <AvatarFallback>
              {value.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium">{value}</div>
        </div>
      ),
    },
    {
      key: "position",
      title: "Position",
    },
    {
      key: "company",
      title: "Company",
    },
    {
      key: "content",
      title: "Testimonial",
      render: (value: string) => (
        <div className="flex items-start max-w-[400px]">
          <Quote className="h-4 w-4 mr-1 text-muted-foreground shrink-0 mt-1" />
          <div className="truncate">{value}</div>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Helmet>
        <title>Manage Testimonials | GodivaTech Admin</title>
      </Helmet>
      
      <ContentDataTable
        title="Testimonials"
        endpoint="/testimonials"
        columns={columns}
        renderForm={(testimonial, onSave, onCancel) => (
          <TestimonialForm testimonial={testimonial} onSave={onSave} onCancel={onCancel} />
        )}
      />
    </AdminLayout>
  );
};

export default TestimonialsPage;