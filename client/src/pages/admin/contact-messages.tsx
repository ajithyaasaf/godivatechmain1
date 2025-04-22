import { Helmet } from "react-helmet";
import { Mail, Phone, User } from "lucide-react";
import { format } from "date-fns";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentDataTable from "@/components/admin/ContentDataTable";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// ContactMessage detail dialog
const ContactMessageDetail = ({ 
  message, 
  onClose 
}: { 
  message: any; 
  onClose: () => void;
}) => {
  if (!message) return null;
  
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Message from {message.name}</DialogTitle>
        <DialogDescription>
          Received on {format(new Date(message.createdAt), "PPP 'at' p")}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">From:</span> {message.name}
          </div>
          
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Email:</span> 
            <a href={`mailto:${message.email}`} className="text-primary hover:underline">
              {message.email}
            </a>
          </div>
        </div>
        
        {message.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Phone:</span> 
            <a href={`tel:${message.phone}`} className="text-primary hover:underline">
              {message.phone}
            </a>
          </div>
        )}
        
        <div>
          <div className="font-medium mb-1">Subject:</div>
          <Badge variant="outline" className="font-normal">
            {message.subject}
          </Badge>
        </div>
        
        <div>
          <div className="font-medium mb-2">Message:</div>
          <div className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">
            {message.message}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={onClose}>Close</Button>
      </div>
    </DialogContent>
  );
};

const ContactMessagesPage = () => {
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Open message dialog
  const openMessageDialog = (message: any) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
  };
  
  // Define columns for the contact messages data table
  const columns = [
    {
      key: "name",
      title: "Name",
      render: (value: string) => (
        <div className="font-medium">{value}</div>
      ),
    },
    {
      key: "email",
      title: "Email",
      render: (value: string) => (
        <a 
          href={`mailto:${value}`} 
          className="text-primary hover:underline"
        >
          {value}
        </a>
      ),
    },
    {
      key: "subject",
      title: "Subject",
      render: (value: string) => (
        <Badge variant="outline" className="font-normal">
          {value}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      title: "Received",
      render: (value: string) => (
        <div className="text-muted-foreground">
          {format(new Date(value), "PPP")}
        </div>
      ),
    },
    {
      key: "message",
      title: "Message",
      render: (value: string, item: any) => (
        <div>
          <Button 
            variant="link" 
            className="h-auto p-0"
            onClick={() => openMessageDialog(item)}
          >
            View Message
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Helmet>
        <title>Contact Messages | GodivaTech Admin</title>
      </Helmet>
      
      <ContentDataTable
        title="Contact Messages"
        endpoint="/contact-messages"
        columns={columns}
        renderForm={() => null} // No form needed as messages are read-only
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <ContactMessageDetail 
          message={selectedMessage} 
          onClose={() => setIsDialogOpen(false)} 
        />
      </Dialog>
    </AdminLayout>
  );
};

export default ContactMessagesPage;