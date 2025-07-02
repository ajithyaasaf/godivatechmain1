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
  const { data = [], isLoading, refetch, error } = useQuery<any[]>({
    queryKey: [apiPath],
    onSuccess: (data) => {
      console.log(`Data fetched for ${title}:`, data);
      if (Array.isArray(data)) {
        console.log(`Fetched ${data.length} ${title.toLowerCase()} items`);
      } else {
        console.error(`Expected array for ${title} but got:`, typeof data);
      }
    },
    onError: (err) => {
      console.error(`Error fetching ${title}:`, err);
    }
  });
  
  // Setup WebSocket for real-time updates
  useEffect(() => {
    console.log(`Setting up enhanced WebSocket for ${title} real-time updates`);
    
    // Create WebSocket connection - using absolute URL with current host
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    // Important: Include the /ws path in the URL
    const wsUrl = `${protocol}//${host}/ws`;
    
    console.log(`Attempting to connect to WebSocket at: ${wsUrl}`);
    
    let socket: WebSocket | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    let reconnectTimer: NodeJS.Timeout | null = null;
    
    // Function to create and connect the WebSocket
    const connectWebSocket = () => {
      try {
        // Close existing socket if it exists
        if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
          socket.close();
        }
      
        // Create a new socket
        socket = new WebSocket(wsUrl);
        
        // Connection opened
        socket.addEventListener('open', () => {
          console.log(`WebSocket connection established for ${title}`);
          reconnectAttempts = 0; // Reset reconnect attempts on successful connection
          
          // Send a ping to verify the connection
          try {
            socket.send(JSON.stringify({ 
              type: 'ping', 
              component: title,
              timestamp: new Date().toISOString() 
            }));
          } catch (pingError) {
            console.warn(`Failed to send initial ping: ${pingError}`);
          }
        });
        
        // Listen for messages with improved handling for all CRUD operations
        socket.addEventListener('message', (event) => {
          try {
            const message = JSON.parse(event.data);
            console.log(`WebSocket message received:`, message);
            
            // Generic message matcher for any content type
            const contentTypeMatch = message.type?.match(/^(\w+)_(deleted|created|updated)$/);
            
            if (contentTypeMatch) {
              const [_, contentType, action] = contentTypeMatch;
              
              // Match the contentType to the correct endpoint
              const matchingEndpoint = contentType === 'project' ? '/projects' : 
                                     contentType === 'service' ? '/services' : 
                                     contentType === 'team_member' ? '/team-members' : 
                                     contentType === 'testimonial' ? '/testimonials' : 
                                     contentType === 'blog_post' ? '/blog-posts' : 
                                     contentType === 'category' ? '/categories' : 
                                     contentType === 'subscriber' ? '/subscribers' : 
                                     contentType === 'contact_message' ? '/contact-messages' : null;
              
              // Check if this message is relevant to this component's endpoint
              if (matchingEndpoint === endpoint) {
                console.log(`${contentType} ${action}, updating UI IMMEDIATELY:`, message.data);
                
                // Handle deletion
                if (action === 'deleted') {
                  handleRealtimeDelete(message);
                }
                // Handle creation
                else if (action === 'created') {
                  handleRealtimeCreate(message);
                }
                // Handle updates
                else if (action === 'updated') {
                  handleRealtimeUpdate(message);
                }
              }
            }
          } catch (error) {
            console.error('Error handling WebSocket message:', error);
          }
        });
        
        // Handle errors
        socket.addEventListener('error', (error) => {
          console.error(`WebSocket error for ${title}:`, error);
        });
        
        // Handle socket closing with reconnect logic
        socket.addEventListener('close', (event) => {
          console.log(`WebSocket connection closed for ${title} with code ${event.code} - reason: ${event.reason || 'No reason provided'}`);
          
          // If not a normal closure and we haven't exceeded max reconnect attempts, try to reconnect
          if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            
            // Exponential backoff for reconnection attempts (1s, 2s, 4s, 8s, 16s)
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts - 1), 16000);
            
            console.log(`Will attempt to reconnect WebSocket (${reconnectAttempts}/${maxReconnectAttempts}) after ${delay}ms delay`);
            
            if (reconnectTimer) clearTimeout(reconnectTimer);
            reconnectTimer = setTimeout(connectWebSocket, delay);
          } else if (reconnectAttempts >= maxReconnectAttempts) {
            console.warn(`Giving up on WebSocket reconnection after ${reconnectAttempts} attempts`);
          }
        });
      } catch (error) {
        console.error(`Error setting up WebSocket for ${title}:`, error);
      }
    };
    
    // Handler functions for each type of real-time update
    const handleRealtimeDelete = (message: any) => {
      queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
        if (!oldData || !Array.isArray(oldData)) {
          console.warn('Invalid data in query cache, cannot update UI for deletion');
          return oldData;
        }
        
        // Handle all possible ID types (numeric, string, Firebase docId)
        const itemId = message.data.id;
        const docId = message.data.docId; // For Firebase document IDs
        
        // Log before count
        const beforeCount = oldData.length;
        
        // Filter out the deleted item using multiple ID matching approaches
        const newData = oldData.filter(item => {
          // Regular ID matching (handles both number and string IDs)
          const regularIdMatch = String(item.id) !== String(itemId);
          
          // Firebase document ID matching if available
          const docIdMatch = !docId || !item.docId || item.docId !== docId;
          
          // Keep the item only if both checks pass
          return regularIdMatch && docIdMatch;
        });
        
        // Log the result
        console.log(`WebSocket DELETE: Removed item from UI. Items before: ${beforeCount}, after: ${newData.length}`);
        
        return newData;
      });
      
      // Show a toast notification
      toast({
        title: `${title} deleted`,
        description: `A ${title.toLowerCase()} has been deleted in real-time`,
        variant: "default"
      });
      
      // Force a refetch to ensure consistency
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [apiPath] });
      }, 300);
    };
    
    const handleRealtimeCreate = (message: any) => {
      queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
        if (!oldData || !Array.isArray(oldData)) {
          console.warn('Invalid data in query cache, cannot update UI for creation');
          return [message.data]; // If no existing data, just use the new item
        }
        
        // Check if the item already exists to avoid duplicates
        const exists = oldData.some(item => {
          // Check standard ID match
          if (String(item.id) === String(message.data.id)) {
            return true;
          }
          
          // Check Firebase document ID match if available
          if (item.docId && message.data.docId && item.docId === message.data.docId) {
            return true;
          }
          
          // Check temporary ID from optimistic updates
          if (item.tempId && item.tempId === message.data.tempId) {
            return true;
          }
          
          return false;
        });
        
        if (exists) {
          console.log(`WebSocket CREATE: Item already exists in UI, not adding duplicate`);
          return oldData;
        }
        
        // Add the new item
        console.log(`WebSocket CREATE: Adding new item to UI. Items before: ${oldData.length}, after: ${oldData.length + 1}`);
        return [...oldData, message.data];
      });
      
      // Show a toast notification
      toast({
        title: `New ${title} added`,
        description: `A new ${title.toLowerCase()} has been added in real-time`,
        variant: "default"
      });
      
      // Force a refetch to ensure consistency
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [apiPath] });
      }, 300);
    };
    
    const handleRealtimeUpdate = (message: any) => {
      queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
        if (!oldData || !Array.isArray(oldData)) {
          console.warn('Invalid data in query cache, cannot update UI for update');
          return oldData;
        }
        
        let updated = false;
        
        // Update the matching item
        const newData = oldData.map(item => {
          // Check all possible ID matching approaches
          if (
            String(item.id) === String(message.data.id) || 
            (item.docId && message.data.docId && item.docId === message.data.docId)
          ) {
            updated = true;
            console.log(`WebSocket UPDATE: Updating item with ID ${item.id} in UI`);
            
            // Return merged item, preserving any fields from both objects
            return { 
              ...item,        // Keep original properties 
              ...message.data, // Apply new properties from update
              __optimistic: undefined // Clear optimistic flag if present
            };
          }
          return item;
        });
        
        if (!updated) {
          console.log(`WebSocket UPDATE: No matching item found to update`);
        }
        
        return newData;
      });
      
      // Show a toast notification
      toast({
        title: `${title} updated`,
        description: `A ${title.toLowerCase()} has been updated in real-time`,
        variant: "default"
      });
      
      // Force a refetch to ensure consistency
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [apiPath] });
      }, 300);
    };
    
    // Start the WebSocket connection
    connectWebSocket();
    
    // Cleanup the WebSocket when the component unmounts
    return () => {
      console.log(`Cleaning up WebSocket for ${title}`);
      
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      
      if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
        console.log(`Closing WebSocket connection for ${title}`);
        socket.close(1000, "Component unmounting"); // 1000 = normal closure
      }
    };
  }, [endpoint, apiPath, title, queryClient, toast]);
  
  // Create mutation with optimistic updates and duplicate prevention
  const createMutation = useMutation({
    mutationFn: async (newItem: any) => {
      console.log(`Creating new ${title} with data:`, newItem);
      
      // Handle pre-check for duplicates
      const existingData = queryClient.getQueryData<any[]>([apiPath]) || [];
      
      // Basic duplicate check based on title if it exists
      if (newItem.title && existingData.some(item => 
        item.title && item.title.toLowerCase() === newItem.title.toLowerCase())) {
        console.warn(`Potential duplicate item detected: ${newItem.title}`);
        // We'll still proceed but log a warning
      }
      
      const res = await apiRequest("POST", adminApiPath, newItem);
      const data = await res.json();
      console.log(`Server response for create:`, data);
      return data;
    },
    
    // Add optimistic update before server responds
    onMutate: async (newData) => {
      console.log(`Optimistically creating new ${title}`);
      
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: [apiPath] });
      
      // Snapshot the previous value for potential rollback
      const previousData = queryClient.getQueryData([apiPath]);
      
      // Create a temporary optimistic item with a unique tempId
      const optimisticId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const optimisticItem = {
        ...newData,
        id: optimisticId,
        tempId: optimisticId, // Additional identifier to help with removal
        __optimistic: true,
        __timestamp: Date.now()
      };
      
      // Update the React Query cache
      queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
        return [...(oldData || []), optimisticItem];
      });
      
      // Return context for potential rollback
      return { previousData, optimisticItem };
    },
    
    onSuccess: (newData, variables, context) => {
      console.log(`Successfully created new ${title}:`, newData);
      
      // Close the dialog and clear selection
      setIsDialogOpen(false);
      setSelectedItem(null);
      
      // Show success message
      toast({
        title: "Created successfully",
        description: `${title} has been created.`,
      });
      
      // IMPORTANT: Avoid duplicate handling by tracking what we've added
      const optimisticItemId = context?.optimisticItem?.tempId;
      
      // Update the React Query cache
      queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
        if (!Array.isArray(oldData)) return [newData];
        
        // Remove our optimistic item by its unique tempId and any other optimistic items
        const withoutOptimistic = oldData.filter(item => 
          item.tempId !== optimisticItemId && !item.__optimistic
        );
        
        return [...withoutOptimistic, newData];
      });
      
      // Refetch after a delay to ensure we have the latest data
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [apiPath] });
      }, 300);
    },
    
    onError: (error: Error, variables, context) => {
      console.error(`Error creating ${title}:`, error);
      
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
    
    // Always refetch once after mutation completes
    onSettled: () => {
      console.log('Create mutation settled, refreshing data');
      // Final cleanup, query again to ensure UI is in sync with server
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [apiPath] });
      }, 500);
    },
  });
  
  // Update mutation with optimistic updates and ID type flexibility
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number | string; data: any }) => {
      console.log(`Updating ${title} with ID ${id} and data:`, data);
      const res = await apiRequest("PUT", `${adminApiPath}/${id}`, data);
      const updatedData = await res.json();
      console.log(`Server response for update:`, updatedData);
      return { id, updatedData };
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
          // Use multiple methods to match IDs across different formats
          if (
            item.id === itemId || 
            String(item.id) === String(itemId) ||
            (item.docId && item.docId === id) ||
            (item.firebaseId && item.firebaseId === id)
          ) {
            console.log(`Found item to update optimistically:`, item);
            return { ...item, ...data, __optimistic: true };
          }
          return item;
        });
      });
      
      // Return context for rollback if needed
      return { previousData };
    },
    onSuccess: ({ id, updatedData }) => {
      console.log(`Update successful for ID ${id}:`, updatedData);
      
      toast({
        title: "Updated successfully",
        description: `${title} has been updated.`,
      });
      
      // Close dialog and update cache immediately
      setIsDialogOpen(false);
      setSelectedItem(null);
      
      // Update the cache with the actual server data
      queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
        if (!Array.isArray(oldData)) return oldData;
        
        // Remove any optimistic flag and update with actual data
        return oldData.map(item => {
          // Match using different ID methods
          const normalizedId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;
          const normalizedItemId = item.id || item.docId || item.firebaseId;
          
          if (
            normalizedItemId === normalizedId || 
            String(normalizedItemId) === String(normalizedId)
          ) {
            // Keep any properties from the original item that weren't included in the update
            return { 
              ...item, 
              ...updatedData,
              __optimistic: undefined // Remove flag
            };
          }
          
          return item;
        });
      });
      
      // Also invalidate the query to ensure data consistency
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [apiPath] });
      }, 300);
    },
    onError: (error: Error, variables, context) => {
      console.error(`Error updating ${title}:`, error);
      
      // Revert to the previous state if we have it
      if (context?.previousData) {
        console.log('Rolling back optimistic update due to error');
        queryClient.setQueryData([apiPath], context.previousData);
      }
      
      toast({
        title: "Failed to update",
        description: error.message,
        variant: "destructive",
      });
    },
    // Final cleanup regardless of outcome
    onSettled: () => {
      // Refetch after a delay to ensure we have the latest data
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [apiPath] });
      }, 500);
    },
  });
  
  // Delete mutation with enhanced error handling and retries
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
    console.log(`handleSave called with form data:`, formData);
    
    if (selectedItem) {
      // Update existing item
      console.log(`Updating existing item:`, selectedItem);
      
      // Enhanced ID detection for various backend systems
      let itemId = null;
      
      if (selectedItem && typeof selectedItem === 'object') {
        // Prioritize Firestore-specific IDs
        if (selectedItem.firebaseId !== undefined && selectedItem.firebaseId !== null) {
          console.log(`Using firebaseId for update: ${selectedItem.firebaseId}`);
          itemId = selectedItem.firebaseId;
        }
        // Then try docId which is also a Firestore ID
        else if (selectedItem.docId !== undefined && selectedItem.docId !== null) {
          console.log(`Using docId for update: ${selectedItem.docId}`);
          itemId = selectedItem.docId;
        }
        // Finally use regular id
        else if (selectedItem.id !== undefined && selectedItem.id !== null) {
          console.log(`Using id for update: ${selectedItem.id} (type: ${typeof selectedItem.id})`);
          itemId = selectedItem.id;
        }
        // Legacy ID format
        else if (selectedItem.__id !== undefined && selectedItem.__id !== null) {
          console.log(`Using __id for update: ${selectedItem.__id}`);
          itemId = selectedItem.__id;
        }
      }
      
      if (!itemId) {
        console.error("Could not find valid ID in selected item:", selectedItem);
        toast({
          title: "Update failed",
          description: "Could not identify the item ID for update",
          variant: "destructive",
        });
        return;
      }
      
      // Keep track of original item fields to avoid losing data
      // that wasn't included in the form (like special IDs, timestamps, etc.)
      updateMutation.mutate({ 
        id: itemId, 
        data: {
          ...formData,
          // Keep any special fields
          ...(selectedItem.firebaseId && { firebaseId: selectedItem.firebaseId }),
          ...(selectedItem.docId && { docId: selectedItem.docId }),
          ...(selectedItem.__id && { __id: selectedItem.__id }),
        } 
      });
    } else {
      // Create new item
      console.log(`Creating new item with data:`, formData);
      createMutation.mutate(formData);
    }
  };
  
  // Handler for deleting items with enhanced ID detection
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
      }
      
      if (!itemId) {
        console.error("Invalid item ID for deletion:", item);
        toast({
          title: "Delete failed",
          description: "Could not identify the item ID for deletion",
          variant: "destructive",
        });
        return;
      }
      
      console.log(`Deleting item with ID: ${itemId}`);
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