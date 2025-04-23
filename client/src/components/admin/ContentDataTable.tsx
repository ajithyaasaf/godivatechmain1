import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowUpDown, 
  Check, 
  Edit, 
  Plus, 
  Search, 
  Trash2, 
  X,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  renderForm 
}: ContentDataTableProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // API endpoint paths
  const apiPath = `/api${endpoint}`;
  const adminApiPath = `/api/admin${endpoint}`;
  
  // Fetch data with React Query
  const { data = [], isLoading, refetch } = useQuery<any[]>({
    queryKey: [apiPath],
  });
  
  // Setup Firebase real-time listener for the collection
  useEffect(() => {
    // Remove the leading '/api/' and trailing 's' to match Firebase collection name
    const collectionName = endpoint.replace(/^\//, '').replace(/s$/, '');
    console.log(`Setting up real-time listener for ${collectionName} collection`);
    
    // Create a query against the collection
    const q = query(collection(db, collectionName));
    
    // Set up the real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log(`Real-time update for ${collectionName} collection received`);
      
      const updatedData: any[] = [];
      querySnapshot.forEach((doc) => {
        // Include the document ID as the item ID
        // Handle the case where the ID might be a string in Firestore
        const docId = doc.id;
        const idAsNumber = !isNaN(parseInt(docId)) ? parseInt(docId) : 0;
        const item = { id: idAsNumber, ...doc.data() };
        updatedData.push(item);
      });
      
      // Update the cache with the latest data from Firebase
      queryClient.setQueryData([apiPath], updatedData);
    }, (error: Error) => {
      console.error(`Error setting up real-time listener for ${collectionName}:`, error);
    });
    
    // Cleanup the listener when the component unmounts
    return () => {
      console.log(`Cleaning up real-time listener for ${collectionName}`);
      unsubscribe();
    };
  }, [endpoint, apiPath]);
  
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
      // Close dialog and refetch data
      setIsDialogOpen(false);
      setSelectedItem(null);
      // Immediately update the cache with the new data
      queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
        return [...oldData, newData];
      });
      // Also invalidate the query to ensure data consistency
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
      // Close dialog and update cache immediately
      setIsDialogOpen(false);
      setSelectedItem(null);
      
      // Update the cache with the updated data
      queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
        return oldData.map(item => 
          item.id === id ? { ...item, ...updatedData } : item
        );
      });
      
      // Also invalidate the query to ensure data consistency
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
      await apiRequest("DELETE", `${adminApiPath}/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      toast({
        title: "Deleted successfully",
        description: `${title} has been deleted.`,
      });
      
      // Immediately update the cache to remove the deleted item
      queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
        return oldData.filter(item => item.id !== deletedId);
      });
      
      // Also invalidate the query to ensure data consistency
      queryClient.invalidateQueries({ queryKey: [apiPath] });
    },
    onError: (error: Error) => {
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
      // Update existing item
      const itemWithId = selectedItem as { id: number };
      updateMutation.mutate({ id: itemWithId.id, data: formData });
    } else {
      // Create new item
      createMutation.mutate(formData);
    }
  };
  
  // Handler for deleting items
  const handleDelete = (item: any) => {
    if (confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) {
      const itemWithId = item as { id: number };
      deleteMutation.mutate(itemWithId.id);
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
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={`${item.id}-${column.key}`}>
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