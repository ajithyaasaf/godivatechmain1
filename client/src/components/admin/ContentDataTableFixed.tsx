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
import './DataTableStyles.css';
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
            
            // Generic message matcher for any content type
            const contentTypeMatch = message.type?.match(/^(\w+)_(deleted|created|updated)$/);
            
            if (contentTypeMatch) {
              const [_, contentType, action] = contentTypeMatch;
              const matchingEndpoint = contentType === 'project' ? '/projects' : 
                                      contentType === 'service' ? '/services' : 
                                      contentType === 'team_member' ? '/team-members' : 
                                      contentType === 'testimonial' ? '/testimonials' : 
                                      contentType === 'blog_post' ? '/blog-posts' : 
                                      contentType === 'category' ? '/categories' : null;
              
              // Check if this message is relevant to this component's endpoint
              if (matchingEndpoint === endpoint) {
                console.log(`${contentType} ${action}, updating UI:`, message.data);
                
                // Handle deletion
                if (action === 'deleted') {
                  queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
                    if (!oldData || !Array.isArray(oldData)) {
                      console.warn('Invalid data in query cache, cannot update UI');
                      return oldData;
                    }
                    
                    // Handle both string and number IDs
                    const itemId = message.data.id;
                    
                    // Log before and after counts
                    const beforeCount = oldData.length;
                    const newData = oldData.filter(item => {
                      const idMatch = item.id !== itemId && String(item.id) !== String(itemId);
                      return idMatch;
                    });
                    console.log(`WebSocket: Filtered out deleted item. Items before: ${beforeCount}, after: ${newData.length}`);
                    
                    return newData;
                  });
                  
                  // Force immediate refetch to ensure UI is synced with server
                  console.log('WebSocket: Immediately refetching data after deletion');
                  queryClient.invalidateQueries({ queryKey: [apiPath] });
                  queryClient.refetchQueries({ queryKey: [apiPath], exact: true });
                  
                  toast({
                    title: `${contentType.replace('_', ' ')} deleted`,
                    description: `A ${contentType.replace('_', ' ')} has been deleted by another user`,
                  });
                }
                // Handle creation
                else if (action === 'created') {
                  queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
                    if (!oldData || !Array.isArray(oldData)) {
                      console.warn('Invalid data in query cache, cannot update UI for creation');
                      return oldData;
                    }
                    
                    // Check if item already exists to avoid duplicates
                    if (oldData.some(item => item.id === message.data.id || String(item.id) === String(message.data.id))) {
                      return oldData;
                    }
                    
                    console.log(`WebSocket: Adding new item to UI. Items before: ${oldData.length}, after: ${oldData.length + 1}`);
                    return [...oldData, message.data];
                  });
                  
                  toast({
                    title: `${contentType.replace('_', ' ')} created`,
                    description: `A new ${contentType.replace('_', ' ')} has been added`,
                  });
                  
                  // Force immediate refetch to ensure UI is synced with server
                  console.log('WebSocket: Immediately refetching data after creation');
                  queryClient.invalidateQueries({ queryKey: [apiPath] });
                  queryClient.refetchQueries({ queryKey: [apiPath], exact: true });
                }
                // Handle updates
                else if (action === 'updated') {
                  queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
                    if (!oldData || !Array.isArray(oldData)) {
                      console.warn('Invalid data in query cache, cannot update UI for update');
                      return oldData;
                    }
                    
                    const newData = oldData.map(item => {
                      // Match using both exact and string conversion approaches
                      if (item.id === message.data.id || String(item.id) === String(message.data.id)) {
                        console.log(`WebSocket: Updating item with ID ${item.id} in UI`);
                        return { ...item, ...message.data };
                      }
                      return item;
                    });
                    
                    return newData;
                  });
                  
                  toast({
                    title: `${contentType.replace('_', ' ')} updated`,
                    description: `A ${contentType.replace('_', ' ')} has been updated`,
                  });
                  
                  // Force immediate refetch to ensure UI is synced with server
                  console.log('WebSocket: Immediately refetching data after update');
                  queryClient.invalidateQueries({ queryKey: [apiPath] });
                  queryClient.refetchQueries({ queryKey: [apiPath], exact: true });
                }
              }
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
  
  // Create mutation with optimistic updates
  const createMutation = useMutation({
    mutationFn: async (newItem: any) => {
      const res = await apiRequest("POST", adminApiPath, newItem);
      return await res.json();
    },
    // Add optimistic UI update before server responds
    onMutate: async (newData) => {
      console.log(`Optimistically creating new ${title}:`, newData);
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [apiPath] });
      
      // Snapshot the previous value
      const previousData = queryClient.getQueryData([apiPath]);
      
      // Create a temporary optimistic item
      const optimisticItem = {
        ...newData,
        id: `temp-${Date.now()}`,
        __optimistic: true // Flag to identify optimistic item
      };
      
      // Add the optimistic item to the cache
      queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
        return [...(oldData || []), optimisticItem];
      });
      
      // Return context
      return { previousData, optimisticItem };
    },
    onSuccess: (newData, variables, context) => {
      console.log(`Successfully created new ${title}:`, newData);
      
      toast({
        title: "Created successfully",
        description: `${title} has been created.`,
      });
      
      setIsDialogOpen(false);
      setSelectedItem(null);
      
      // Replace the optimistic item with the real server data
      queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
        if (!Array.isArray(oldData)) return [newData];
        
        // Filter out the optimistic entry and add the real one
        return oldData
          .filter(item => !item.__optimistic)
          .concat(newData);
      });
      
      // Refetch to ensure consistency
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [apiPath] });
      }, 300);
    },
    onError: (error: Error, variables, context) => {
      // Roll back to the previous state if available
      if (context?.previousData) {
        queryClient.setQueryData([apiPath], context.previousData);
      }
      
      toast({
        title: "Failed to create",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update mutation with optimistic updates
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number | string; data: any }) => {
      const res = await apiRequest("PUT", `${adminApiPath}/${id}`, data);
      return { id, updatedData: await res.json() };
    },
    // Add optimistic update before server responds
    onMutate: async ({ id, data }) => {
      console.log(`Optimistically updating ${title} with ID:`, id);
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [apiPath] });
      
      // Snapshot the previous value
      const previousData = queryClient.getQueryData([apiPath]);
      
      // Apply optimistic update
      queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
        if (!Array.isArray(oldData)) return oldData;
        
        // Handle both string and number IDs
        const itemId = typeof id === 'string' && !isNaN(Number(id)) 
          ? Number(id) 
          : id;
          
        return oldData.map(item => {
          // Match by multiple ID formats for compatibility
          const isMatch = 
            item.id === itemId || 
            String(item.id) === String(itemId) ||
            (item.docId && item.docId === id) ||
            (item.firebaseId && item.firebaseId === id);
          
          // Update the item with optimistic flag
          return isMatch 
            ? { ...item, ...data, __updating: true } 
            : item;
        });
      });
      
      // Return context
      return { previousData, id };
    },
    onSuccess: ({ id, updatedData }, variables, context) => {
      console.log(`Successfully updated ${title} with ID:`, id);
      
      toast({
        title: "Updated successfully",
        description: `${title} has been updated.`,
      });
      
      setIsDialogOpen(false);
      setSelectedItem(null);
      
      // Apply the confirmed server update and remove optimistic flag
      queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
        if (!Array.isArray(oldData)) return oldData;
        
        // Handle both string and number IDs
        const itemId = typeof id === 'string' && !isNaN(Number(id)) 
          ? Number(id) 
          : id;
          
        return oldData.map(item => {
          // Match by multiple ID formats
          const isMatch = 
            item.id === itemId || 
            String(item.id) === String(itemId) ||
            (item.docId && item.docId === id) ||
            (item.firebaseId && item.firebaseId === id);
          
          // Remove __updating flag and apply server data
          return isMatch 
            ? { ...item, ...updatedData, __updating: undefined } 
            : item;
        });
      });
      
      // Final refetch to ensure consistency
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [apiPath] });
      }, 300);
    },
    onError: (error: Error, variables, context) => {
      // Roll back to the previous state
      if (context?.previousData) {
        queryClient.setQueryData([apiPath], context.previousData);
      }
      
      toast({
        title: "Failed to update",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Enhanced delete mutation with optimistic updates for immediate UI response
  const deleteMutation = useMutation({
    mutationFn: async (id: number | string) => {
      console.log(`Sending DELETE request to ${adminApiPath}/${id}`);
      
      try {
        // Added timeout and retry logic
        const maxRetries = 2;
        let currentRetry = 0;
        let lastError = null;
        
        while (currentRetry <= maxRetries) {
          try {
            // If this is a retry, log it
            if (currentRetry > 0) {
              console.log(`Retry attempt ${currentRetry}/${maxRetries} for deletion of ID: ${id}`);
            }
            
            // Make the delete request with a reasonable timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch(`${adminApiPath}/${id}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            console.log(`Response from delete operation:`, response);
            
            if (response.ok) {
              console.log(`Deletion with ID ${id} was successful on server`);
              let responseData = {};
              
              try {
                const text = await response.text();
                if (text) {
                  responseData = JSON.parse(text);
                  console.log('Delete response data:', responseData);
                } else {
                  console.log('Empty response body (successful)');
                }
              } catch (parseError) {
                console.log('Non-JSON response body:', parseError);
              }
              
              return id;
            } else {
              // Server returned an error
              let errorMessage = `Server returned ${response.status}`;
              try {
                const text = await response.text();
                if (text) {
                  try {
                    const errorData = JSON.parse(text);
                    errorMessage = errorData.message || errorMessage;
                    console.error('Server delete error:', errorData);
                  } catch (parseError) {
                    // Non-JSON error response - could be HTML
                    if (text.includes('<!DOCTYPE html>')) {
                      errorMessage = `Server error (${response.status}). The server may be experiencing issues.`;
                      console.error('Server returned HTML error page instead of JSON');
                    } else {
                      errorMessage = text || errorMessage;
                    }
                  }
                }
              } catch (textError) {
                console.error('Could not read error response body:', textError);
              }
              
              // For server errors (5xx) or if HTML error page was detected, retry
              const isHtmlErrorPage = errorMessage.includes('<!DOCTYPE html>') || 
                                     errorMessage.includes('Server error');
                                     
              if ((response.status >= 500 || isHtmlErrorPage) && currentRetry < maxRetries) {
                lastError = new Error(`Server error (${response.status}). Retrying...`);
                console.log(`Server returned error ${response.status}, will retry (${currentRetry + 1}/${maxRetries})`);
                currentRetry++;
                await new Promise(resolve => setTimeout(resolve, 1000 * currentRetry)); // Exponential backoff
                continue; // Try again
              }
              
              throw new Error(errorMessage);
            }
          } catch (fetchError) {
            lastError = fetchError;
            
            // For network errors, retry
            if (
              fetchError instanceof Error && (
                fetchError instanceof TypeError || 
                fetchError.name === 'AbortError'
              )
            ) {
              if (currentRetry < maxRetries) {
                currentRetry++;
                await new Promise(resolve => setTimeout(resolve, 1000 * currentRetry));
                continue; // Try again
              }
            }
            
            throw fetchError; // Rethrow if max retries exceeded or not a network error
          }
        }
        
        // If we get here, we've exhausted retries
        throw lastError || new Error('Failed to delete after multiple attempts');
      } catch (error) {
        console.error(`Error in delete mutation for ID ${id}:`, error);
        throw error;
      }
    },
    // ENHANCED WITH OPTIMISTIC UI UPDATES
    // Immediately update UI even before server responds
    onMutate: async (deletedId) => {
      console.log(`Running optimistic update for deletion of ID: ${deletedId}`);
      
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: [apiPath] });
      
      // Snapshot the previous value for rollback if needed
      const previousData = queryClient.getQueryData([apiPath]);
      
      // Optimistically update by removing the item from cache immediately
      queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
        if (!Array.isArray(oldData)) return oldData;
        
        // Handle both string and number IDs for comparison
        const itemId = typeof deletedId === 'string' && !isNaN(Number(deletedId)) 
          ? Number(deletedId) 
          : deletedId;
          
        const newData = oldData.filter(item => {
          // Check all possible ID formats
          const normalizedItemId = item.id || item.docId || item.firebaseId || item.__id;
          const normalizedDeletedId = typeof itemId === 'string' && !isNaN(Number(itemId)) 
                                    ? Number(itemId) 
                                    : itemId;
          
          // Try to match exactly, or convert both to strings for comparison
          return normalizedItemId !== normalizedDeletedId && 
                 String(normalizedItemId) !== String(normalizedDeletedId);
        });
        
        console.log(`Optimistic update: Filtered out item ${deletedId}. Items before: ${oldData.length}, after: ${newData.length}`);
        return newData;
      });
      
      // Return context with the snapshotted value
      return { previousData };
    },
    // If the deletion is successful
    onSuccess: (deletedId, _, context) => {
      console.log(`Delete mutation successful for ID ${deletedId}`);
      
      toast({
        title: "Deleted successfully",
        description: `${title} has been deleted.`,
      });
      
      // Final UI refresh to ensure consistency with server
      // Use a delay to ensure WebSocket messages don't override our state
      setTimeout(() => {
        // Force refresh the data from server (but don't show loading state)
        queryClient.invalidateQueries({ 
          queryKey: [apiPath],
          refetchType: 'all' 
        });
      }, 200);
    },
    // If the mutation fails, roll back optimistic updates
    onError: (error: Error, deletedId, context: any) => {
      console.error(`Delete mutation error:`, error);
      
      // Rollback to the previous state
      if (context?.previousData) {
        console.log('Rolling back optimistic update due to error');
        queryClient.setQueryData([apiPath], context.previousData);
      }
      
      toast({
        title: "Failed to delete",
        description: error.message,
        variant: "destructive",
      });
    },
    // Always refetch once after mutation completes, successful or not
    onSettled: () => {
      console.log('Delete mutation settled, refreshing data');
      // Final cleanup, query again to ensure UI is in sync with server
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [apiPath] });
      }, 500);
    },
  });
  
  // Handler for adding/editing items - supporting various ID types
  const handleSave = (formData: any) => {
    if (selectedItem) {
      let itemId: number | string | null = null;
      
      // Extract ID from the selected item, checking various formats
      if (typeof selectedItem === 'object' && selectedItem !== null) {
        if (selectedItem.id !== undefined && selectedItem.id !== null) {
          itemId = selectedItem.id;
        } else if (selectedItem.docId !== undefined && selectedItem.docId !== null) {
          itemId = selectedItem.docId;
        } else if (selectedItem.__id !== undefined && selectedItem.__id !== null) {
          itemId = selectedItem.__id;
        }
      }
      
      if (itemId === null) {
        console.error("Could not determine item ID for update:", selectedItem);
        toast({
          title: "Update failed",
          description: "Could not identify the item to update. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      console.log(`Updating ${title} with ID:`, itemId);
      updateMutation.mutate({ id: itemId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };
  
  // Enhanced handler for deleting items with guaranteed UI update
  const handleDelete = (item: any) => {
    if (confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) {
      console.log("Deleting item:", item);
      
      // Enhanced ID detection for Firebase/Firestore documents
      let itemId = null;
      
      if (item && typeof item === 'object') {
        // Detailed logging to debug ID issues
        console.log(`Item data for deletion:`, {
          id: item.id,
          idType: typeof item.id,
          docId: item.docId,
          firebaseId: item.firebaseId,
          __id: item.__id,
          endpoint
        });
        
        // Prioritize Firestore-specific IDs
        if (item.firebaseId !== undefined && item.firebaseId !== null) {
          console.log(`Using firebaseId for deletion: ${item.firebaseId}`);
          itemId = item.firebaseId;
        }
        // Then try docId which is also a Firestore ID
        else if (item.docId !== undefined && item.docId !== null) {
          console.log(`Using docId for deletion: ${item.docId}`);
          itemId = item.docId;
        }
        // Finally use regular id
        else if (item.id !== undefined && item.id !== null) {
          console.log(`Using id for deletion: ${item.id} (type: ${typeof item.id})`);
          itemId = item.id;
        }
        // Legacy ID format
        else if (item.__id !== undefined && item.__id !== null) {
          console.log(`Using __id for deletion: ${item.__id}`);
          itemId = item.__id;
        }
        // Special case for projects with Firebase document IDs
        else if (endpoint === '/projects' && item.createdAt && item.title) {
          console.error("Could not find ID for project. This should not happen with the updated data format.");
          toast({
            title: "Delete failed",
            description: "Could not identify the project ID. This is likely a data format issue. Please contact support.",
            variant: "destructive",
          });
          return;
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
      
      console.log(`Proceeding with deletion using ID: ${itemId} (type: ${typeof itemId})`);
      
      // STEP 1: Pre-deletion UI update - Immediately update the UI before server responds
      // Find the DOM element for this row and apply a fading out effect
      try {
        // Create a unique row identifier based on multiple possible ID properties
        const rowIdentifier = item.id || item.docId || item.firebaseId || item.__id;
        const rowElement = document.getElementById(`row-${rowIdentifier}`);
        
        if (rowElement) {
          console.log(`Found row element, applying visual feedback`);
          // Add a CSS class for visual feedback
          rowElement.classList.add('deleting-row');
          
          // Apply immediate visual feedback animation
          rowElement.style.transition = 'opacity 0.5s ease, height 0.5s ease, padding 0.5s ease';
          rowElement.style.opacity = '0.3';
          
          // Force immediate visual update without waiting for React
          setTimeout(() => {
            // Hard-force immediate UI update by hiding the row
            rowElement.style.height = '0';
            rowElement.style.overflow = 'hidden';
            rowElement.style.padding = '0';
            rowElement.style.border = 'none';
          }, 100);
        }
      } catch (uiError) {
        console.log('Could not apply direct DOM manipulation:', uiError);
      }
      
      // STEP 2: Apply optimistic update in React Query cache
      // We're already handling this in the mutation, but we'll force it here as well
      queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
        if (!Array.isArray(oldData)) return oldData;
        
        // Create a normalized version of our target ID for comparison
        const normalizedItemId = String(itemId);
        
        // Immediately filter out the deleted item from the cache
        return oldData.filter(item => {
          const itemIdentifiers = [
            String(item.id || ''),
            String(item.docId || ''),
            String(item.firebaseId || ''),
            String(item.__id || '')
          ];
          
          // If any of the item's identifiers match our target ID, filter it out
          return !itemIdentifiers.includes(normalizedItemId);
        });
      });
      
      // STEP 3: Trigger the actual server deletion
      console.log(`Initiating server deletion for ${title} with ID:`, itemId);
      
      // We wrap the deletion in a try-catch to handle any potential errors
      try {
        deleteMutation.mutate(itemId);
      } catch (error) {
        console.error(`Error triggering deletion mutation:`, error);
        
        // If the mutation fails, ensure we tell the user clearly
        toast({
          title: "Delete operation issue",
          description: `There was a problem with the deletion. Please refresh the page.`,
          variant: "destructive",
        });
        
        // Force a manual data refresh as a failsafe
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: [apiPath] });
          refetch();
        }, 500);
      }
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
              <>
                {filteredData.map((item: any) => {
                  // Generate a consistent row ID for direct DOM access during deletion
                  const rowIdentifier = item.id || item.docId || item.firebaseId || item.__id || `temp-${Math.random().toString(36).substr(2, 9)}`;
                  const rowClass = item.__optimistic ? 'optimistic-item' : item.__updating ? 'updating-item' : '';
                  
                  return (
                    <TableRow 
                      id={`row-${rowIdentifier}`} 
                      key={rowIdentifier} 
                      className={rowClass}
                    >
                      {columns.map((column) => (
                        <TableCell key={`${rowIdentifier}-${column.key}`}>
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
                  );
                })}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ContentDataTable;