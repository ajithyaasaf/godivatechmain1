import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from '@/lib/queryClient';

import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw, 
  ArrowUpDown
} from 'lucide-react';

interface Column {
  key: string;
  title: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface ContentDataTableProps {
  title: string;
  endpoint: string;
  columns: Column[];
  renderForm: (
    item: any, 
    onSave: (data: any) => void, 
    onCancel: () => void
  ) => React.ReactNode;
}

const ContentDataTable = ({
  title,
  endpoint,
  columns,
  renderForm,
}: ContentDataTableProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Construct API paths
  const apiPath = `/api${endpoint}`;
  const adminApiPath = `/api/admin${endpoint}`;
  
  // Fetch data
  const { data = [], isLoading, refetch } = useQuery<any[]>({
    queryKey: [apiPath],
  });
  
  // WebSocket connection
  useEffect(() => {
    console.log(`Setting up WebSocket for ${title} real-time updates`);
    
    let socket: WebSocket | null = null;
    
    // Only setup WebSocket in browser environment with valid window location
    if (typeof window !== 'undefined' && window.location && window.location.host) {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const wsUrl = `${protocol}//${host}/ws`;
        
        console.log(`Connecting to WebSocket at: ${wsUrl}`);
        socket = new WebSocket(wsUrl);
        
        socket.addEventListener('open', () => {
          console.log(`WebSocket connection established for ${title}`);
        });
        
        socket.addEventListener('message', (event) => {
          try {
            const message = JSON.parse(event.data);
            console.log(`WebSocket message received:`, message);
            
            if (message.type === 'project_deleted' && endpoint === '/projects') {
              console.log('Project deleted, updating UI:', message.data.id);
              queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
                return oldData.filter(item => item.id !== message.data.id);
              });
              
              toast({
                title: "Project deleted",
                description: "A project has been deleted by another user",
              });
            } 
            else if (message.type === 'project_created' && endpoint === '/projects') {
              console.log('Project created, updating UI:', message.data);
              queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
                if (oldData.some(item => item.id === message.data.id)) {
                  return oldData;
                }
                return [...oldData, message.data];
              });
              
              toast({
                title: "Project created",
                description: "A new project has been added",
              });
            }
            else if (message.type === 'project_updated' && endpoint === '/projects') {
              console.log('Project updated, updating UI:', message.data);
              queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
                return oldData.map(item => 
                  item.id === message.data.id ? { ...item, ...message.data } : item
                );
              });
              
              toast({
                title: "Project updated",
                description: "A project has been updated",
              });
            }
          } catch (error) {
            console.error('Error handling WebSocket message:', error);
          }
        });
        
        socket.addEventListener('error', (error) => {
          console.error(`WebSocket error for ${title}:`, error);
        });
        
        socket.addEventListener('close', (event) => {
          console.log(`WebSocket connection closed for ${title} with code ${event.code}`);
        });
      } catch (error) {
        console.error(`Error creating WebSocket connection for ${title}:`, error);
      }
    } else {
      console.log(`WebSocket setup skipped - not in a browser environment or missing host information`);
    }
    
    // Cleanup function
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log(`Closing WebSocket for ${title}`);
        socket.close();
      }
    };
  }, [apiPath, endpoint, title, toast]);
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (newItem: any) => {
      const res = await apiRequest("POST", adminApiPath, newItem);
      return await res.json();
    },
    onSuccess: (newData) => {
      toast({
        title: "Created successfully",
        description: `${title} has been created.`,
      });
      setIsDialogOpen(false);
      setSelectedItem(null);
      
      queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
        return [...oldData, newData];
      });
      queryClient.invalidateQueries({ queryKey: [apiPath] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PUT", `${adminApiPath}/${id}`, data);
      return { id, updatedData: await res.json() };
    },
    onSuccess: ({ id, updatedData }) => {
      toast({
        title: "Updated successfully",
        description: `${title} has been updated.`,
      });
      setIsDialogOpen(false);
      setSelectedItem(null);
      
      queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
        return oldData.map(item => 
          item.id === id ? { ...item, ...updatedData } : item
        );
      });
      
      queryClient.invalidateQueries({ queryKey: [apiPath] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      console.log(`Sending DELETE request to ${adminApiPath}/${id}`);
      try {
        const response = await apiRequest("DELETE", `${adminApiPath}/${id}`);
        console.log(`Response from delete operation:`, response);
        
        if (response.ok) {
          console.log(`Deletion with ID ${id} was successful on server`);
          let responseData = {};
          
          try {
            responseData = await response.json();
            console.log('Delete response data:', responseData);
          } catch (e) {
            console.log('No JSON response body');
          }
          
          return id;
        } else {
          let errorMessage = `Server returned ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
            console.error('Server delete error:', errorData);
          } catch (e) {
            // No JSON error response
          }
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error(`Error in delete mutation for ID ${id}:`, error);
        throw error;
      }
    },
    onSuccess: (deletedId) => {
      console.log(`Delete mutation successful for ID ${deletedId}`);
      toast({
        title: "Deleted successfully",
        description: `${title} has been deleted.`,
      });
      
      queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
        const newData = oldData.filter(item => item.id !== deletedId);
        console.log(`Filtered out deleted item. Items before: ${oldData.length}, after: ${newData.length}`);
        return newData;
      });
      
      queryClient.invalidateQueries({ queryKey: [apiPath] });
    },
    onError: (error: Error) => {
      console.error(`Delete mutation error:`, error);
      toast({
        title: "Failed to delete",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handler for adding/editing items
  const handleSave = (formData: any) => {
    if (selectedItem) {
      const itemWithId = selectedItem as { id: number };
      updateMutation.mutate({ id: itemWithId.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };
  
  // Handler for deleting items
  const handleDelete = (item: any) => {
    if (confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) {
      console.log("Deleting item:", item);
      
      // For Firebase/Firestore documents, look for either id or docId
      let itemId = null;
      
      if (item && typeof item === 'object') {
        // Check for various ID formats
        if (item.id !== undefined && item.id !== null) {
          itemId = item.id;
        } else if (item.docId !== undefined && item.docId !== null) {
          itemId = item.docId;
        } else if (item.__id !== undefined && item.__id !== null) {
          itemId = item.__id;
        } else if (endpoint === '/projects' && item.createdAt && item.title) {
          // For projects, we might need to retrieve ID from the server or generate one
          // Use the createdAt timestamp or other unique identifier
          console.log("Attempting to find project ID for Firebase document:", item);
          itemId = 1; // This is a fallback - your project logic in server-side should handle this
        }
      }
      
      if (!itemId) {
        console.error("Could not determine item ID for deletion:", item);
        toast({
          title: "Delete failed",
          description: "Could not identify the item to delete. Please refresh and try again.",
          variant: "destructive",
        });
        return;
      }
      
      console.log(`Deleting ${title} with ID:`, itemId);
      deleteMutation.mutate(itemId);
    }
  };
  
  // Handler for manual refresh
  const handleRefresh = () => {
    console.log(`Manually refreshing ${title} data...`);
    queryClient.invalidateQueries({ queryKey: [apiPath] });
    refetch();
    
    toast({
      title: "Refreshed",
      description: `${title} data has been refreshed.`,
    });
  };
  
  // Open dialog with a selected item or empty for new item
  const openDialog = (item: any = null) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };
  
  // Filter data based on search query
  const filteredData = (data as any[]).filter((item: any) => {
    if (!searchQuery) return true;
    
    // Search across all string fields
    return Object.keys(item).some(key => {
      const value = item[key];
      return typeof value === 'string' && 
        value.toLowerCase().includes(searchQuery.toLowerCase());
    });
  });
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={`Search ${title.toLowerCase()}...`}
              className="pl-8 min-w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleRefresh} 
            size="sm" 
            variant="outline" 
            title="Refresh data"
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()} size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedItem ? `Edit ${title}` : `Add New ${title}`}
                </DialogTitle>
              </DialogHeader>
              
              {renderForm(
                selectedItem, 
                handleSave, 
                () => setIsDialogOpen(false)
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>
            {filteredData.length 
              ? `A list of ${filteredData.length} ${title.toLowerCase()}`
              : `No ${title.toLowerCase()} found${searchQuery ? " for your search" : ""}`
            }
          </TableCaption>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>
                  <div className="flex items-center">
                    {column.title}
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8">
                  No {title.toLowerCase()} found
                  {searchQuery && (
                    <>
                      {" "}for "<span className="font-semibold">{searchQuery}</span>"
                    </>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item: any) => (
                <TableRow key={item.id || `item-${Math.random().toString(36).substr(2, 9)}`}>
                  {columns.map((column) => (
                    <TableCell key={`${item.id || Math.random().toString(36).substr(2, 9)}-${column.key}`}>
                      {column.render 
                        ? column.render(item[column.key], item) 
                        : item[column.key]
                      }
                    </TableCell>
                  ))}
                  <TableCell className="flex justify-end items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDialog(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ContentDataTable;