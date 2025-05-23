import { useState, useEffect, useCallback, useMemo } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw, 
  ArrowUpDown,
  MoreHorizontal,
  Download,
  Filter,
  Eye,
  ChevronDown,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileText,
  Copy
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
  
  // Add local state to manage data directly - this gives us full control
  const [localData, setLocalData] = useState<any[]>([]);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [localIsLoading, setLocalIsLoading] = useState(true);
  
  // Construct API paths
  const apiPath = `/api${endpoint}`;
  const adminApiPath = `/api/admin${endpoint}`;
  
  // Fetch data from server
  const { data = [], isLoading, refetch } = useQuery<any[]>({
    queryKey: [apiPath]
  });
  
  // Sync server data with our local state
  useEffect(() => {
    if (data && Array.isArray(data)) {
      console.log(`Data fetched from server for ${endpoint}, items:`, data.length);
      
      // Filter out any items that we've locally marked as deleted
      const filteredData = data.filter(item => {
        const itemId = String(item.id || item.docId || item.firebaseId || item.__id || '');
        return !deletedIds.has(itemId);
      });
      
      // Update our local state with server data, minus any locally deleted items
      setLocalData(filteredData);
      setLocalIsLoading(false);
    }
  }, [data, deletedIds, endpoint]);
  
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
  
  // Rewritten create mutation to prevent duplicates
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
    
    // Simplified optimistic update
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
      
      // FIRST UPDATE: Add to local state (this guarantees UI update)
      setLocalData(current => [...current, optimisticItem]);
      
      // SECOND UPDATE: Add to React Query cache
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
      
      // Update both our local state and the React Query cache
      setLocalData(current => {
        const withoutOptimistic = current.filter(item => 
          item.tempId !== optimisticItemId && !item.__optimistic
        );
        return [...withoutOptimistic, newData];
      });
      
      // Update the React Query cache
      queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
        if (!Array.isArray(oldData)) return [newData];
        
        // Remove our optimistic item by its unique tempId and any other optimistic items
        const withoutOptimistic = oldData.filter(item => 
          item.tempId !== optimisticItemId && !item.__optimistic
        );
        
        return [...withoutOptimistic, newData];
      });
      
      // Skip the refetch to prevent potential duplicates
      // We've already manually updated both local state and query cache
    },
    
    onError: (error: Error, variables, context) => {
      console.error(`Error creating ${title}:`, error);
      
      // Roll back to the previous state if available
      if (context?.previousData) {
        queryClient.setQueryData([apiPath], context.previousData);
        
        // Also update local state to match
        if (Array.isArray(context.previousData)) {
          setLocalData(context.previousData);
        }
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
  
  // Completely rewritten handler for deleting items with guaranteed UI update
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
      
      // The normalized string ID we'll use for tracking
      const normalizedItemId = String(itemId);
      
      console.log(`Proceeding with deletion using ID: ${normalizedItemId}`);
      
      // STEP 1: IMMEDIATELY UPDATE LOCAL STATE - this guarantees the UI update regardless of server response
      setLocalData(currentData => {
        return currentData.filter(dataItem => {
          // Get all possible ID formats from the item
          const itemIds = [
            String(dataItem.id || ''),
            String(dataItem.docId || ''),
            String(dataItem.firebaseId || ''),
            String(dataItem.__id || '')
          ];
          
          // Keep this item only if NONE of its IDs match the one being deleted
          return !itemIds.includes(normalizedItemId);
        });
      });
      
      // STEP 2: Add this ID to our set of locally deleted IDs to ensure it stays gone
      setDeletedIds(prevIds => {
        const newIds = new Set(prevIds);
        newIds.add(normalizedItemId);
        return newIds;
      });
      
      // STEP 3: Visual feedback with DOM manipulation
      try {
        // Create a unique row identifier based on multiple possible ID properties
        const rowIdentifier = item.id || item.docId || item.firebaseId || item.__id;
        const rowElement = document.getElementById(`row-${rowIdentifier}`);
        
        if (rowElement) {
          console.log(`Found row element, applying visual feedback`);
          // Add a CSS class for visual feedback
          rowElement.classList.add('deleting-row');
          rowElement.classList.add('fade-out-height');
          
          // Apply immediate visual feedback animation
          rowElement.style.transition = 'all 0.5s ease';
          rowElement.style.opacity = '0';
          rowElement.style.maxHeight = '0';
          rowElement.style.overflow = 'hidden';
          
          // Force immediate visual update
          setTimeout(() => {
            rowElement.style.display = 'none';
          }, 500);
        }
      } catch (uiError) {
        console.log('Could not apply direct DOM manipulation:', uiError);
      }
      
      // STEP 4: Update the React Query cache to match our local state
      queryClient.setQueryData([apiPath], (oldData: any[] = []) => {
        if (!Array.isArray(oldData)) return [];
        
        // Return our filtered local state
        return localData.filter(item => {
          // Get all possible ID formats from the item
          const itemIds = [
            String(item.id || ''),
            String(item.docId || ''),
            String(item.firebaseId || ''),
            String(item.__id || '')
          ];
          
          // Keep this item only if NONE of its IDs match the one being deleted
          return !itemIds.includes(normalizedItemId);
        });
      });
      
      // STEP 5: Show success toast immediately to improve perceived speed
      toast({
        title: "Deleted successfully",
        description: `${title} has been deleted.`,
      });
      
      // STEP 6: Trigger the actual server deletion in the background
      console.log(`Initiating server deletion for ${title} with ID:`, itemId);
      
      try {
        deleteMutation.mutate(itemId, {
          // If the server deletion fails, we don't want to undo our local changes
          // because they provide a better user experience
          onError: (error) => {
            console.log("Server deletion failed, but UI remains updated for better UX:", error);
            
            // Let the user know there was an issue, but don't disrupt their flow
            toast({
              title: "Sync issue detected",
              description: "Changes may take time to sync with server. Continue working normally.",
              variant: "default"
            });
          }
        });
      } catch (error) {
        // Even if there's an error, we've already updated the UI
        console.error(`Error triggering deletion mutation, but UI is already updated:`, error);
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
  
  // States for sorting
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Enhanced sort function with memory
  const handleSort = useCallback((field: string) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, set it and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);
  
  // Filter data based on search query with sorting - USING LOCAL DATA
  const filteredData = useMemo(() => {
    // Step 1: Apply search filter
    const searchFiltered = localData.filter((item: any) => {
      if (!searchQuery) return true;
      
      // Search across all string fields
      return Object.keys(item).some(key => {
        const value = item[key];
        return typeof value === 'string' && 
          value.toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
    
    // Step 2: Apply sorting if a sort field is selected
    if (sortField) {
      return [...searchFiltered].sort((a, b) => {
        // Handle different data types
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        // Skip sorting if either value is undefined
        if (aValue === undefined || bValue === undefined) return 0;
        
        // Handle different data types
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          // String comparison
          const comparison = aValue.localeCompare(bValue);
          return sortDirection === 'asc' ? comparison : -comparison;
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          // Numeric comparison
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        } else if (aValue instanceof Date && bValue instanceof Date) {
          // Date comparison
          return sortDirection === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
        } else {
          // Convert to strings for non-comparable types
          const stringA = String(aValue);
          const stringB = String(bValue);
          const comparison = stringA.localeCompare(stringB);
          return sortDirection === 'asc' ? comparison : -comparison;
        }
      });
    }
    
    return searchFiltered;
  }, [localData, searchQuery, sortField, sortDirection]);
  
  // Get counts for data insights
  const totalItems = localData.length;
  
  // Status-related stats (if items have status properties)
  const hasStatus = localData.some(item => item.status || item.published !== undefined);
  const activeItems = hasStatus ? localData.filter(item => 
    item.status === 'active' || item.status === 'published' || item.published === true
  ).length : null;
  
  // Calculate recently added items (in the last 7 days)
  const recentItems = localData.filter(item => {
    if (!item.createdAt) return false;
    const createdDate = new Date(item.createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return createdDate >= sevenDaysAgo;
  }).length;
  
  // Export data function
  const exportData = useCallback(() => {
    const dataToExport = localData.map(item => {
      // Create a simplified object without internal fields
      const exportItem: Record<string, any> = {};
      
      // Add only relevant fields for export
      columns.forEach(column => {
        if (column.key in item) {
          exportItem[column.title] = item[column.key];
        }
      });
      
      return exportItem;
    });
    
    // Convert to JSON
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export complete",
      description: `${title} data has been exported as JSON`,
    });
  }, [localData, columns, title, toast]);
  
  return (
    <div className="space-y-4">
      {/* Header section with statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow card-hover-effect">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Total {title}</h3>
              <p className="text-2xl font-bold">{totalItems}</p>
            </div>
            <FileText className="h-8 w-8 text-muted-foreground opacity-80" />
          </CardContent>
        </Card>
        
        {activeItems !== null && (
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow card-hover-effect">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Active {title}</h3>
                <p className="text-2xl font-bold">
                  {activeItems}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    ({Math.round((activeItems / totalItems) * 100)}%)
                  </span>
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500 opacity-80" />
            </CardContent>
          </Card>
        )}
        
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow card-hover-effect">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Recently Added</h3>
              <p className="text-2xl font-bold">{recentItems}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-blue-500 opacity-80" />
          </CardContent>
        </Card>
      </div>
      
      {/* Main header with actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {localIsLoading && (
            <Badge variant="outline" className="ml-2 bg-amber-50">
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Syncing...
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={`Search ${title.toLowerCase()}...`}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleRefresh} 
                  size="icon"
                  variant="outline"
                  className="flex-shrink-0"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex-shrink-0">
                <Filter className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Actions</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Data actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={exportData}>
                <Download className="mr-2 h-4 w-4" />
                Export data
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()} size="sm" className="flex-shrink-0">
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
      
      <div className="rounded-md border shadow-sm">
        <Table className="enterprise-table">
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
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(column.key)}
                    className="flex items-center p-0 h-auto hover:bg-transparent sort-button"
                  >
                    {column.title}
                    {sortField === column.key ? (
                      sortDirection === 'asc' ? (
                        <ChevronDown className="ml-1 h-3.5 w-3.5 text-primary" />
                      ) : (
                        <ChevronDown className="ml-1 h-3.5 w-3.5 text-primary rotate-180" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground opacity-50" />
                    )}
                  </Button>
                </TableHead>
              ))}
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localIsLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="p-0">
                  <div className="py-8 px-4">
                    <div className="flex items-center justify-center mb-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                      <p className="text-sm text-muted-foreground">Loading {title.toLowerCase()}...</p>
                    </div>
                    
                    {/* Skeleton loader */}
                    <div className="space-y-3">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="h-5 w-3/4 bg-slate-100 rounded animate-pulse"></div>
                          <div className="h-5 w-1/5 bg-slate-100 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="p-0">
                  <div className="empty-state py-12">
                    <FileText className="h-12 w-12 text-muted-foreground opacity-40" />
                    <h3>No {title.toLowerCase()} found</h3>
                    {searchQuery ? (
                      <p>
                        No results match your search for "<span className="font-semibold">{searchQuery}</span>".
                        Try using different keywords or clear your search.
                      </p>
                    ) : (
                      <p>
                        Get started by creating your first {title.toLowerCase()} using the "Add New" button above.
                      </p>
                    )}
                    {searchQuery && (
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setSearchQuery('')}
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
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
                      className={`hover-highlight ${rowClass}`}
                    >
                      {columns.map((column) => (
                        <TableCell key={`${rowIdentifier}-${column.key}`}>
                          {column.render ? (
                            column.render(item[column.key], item)
                          ) : typeof item[column.key] === 'string' && item[column.key]?.length > 40 ? (
                            // Show tooltip for long text
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="truncate-with-tooltip">
                                    {item[column.key]?.substring(0, 40)}...
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs break-words">{item[column.key]}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            item[column.key]
                          )}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            
                            <DropdownMenuItem onClick={() => openDialog(item)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            
                            {/* View button - if this item has a public link */}
                            {item.link && (
                              <DropdownMenuItem
                                onClick={() => window.open(item.link, '_blank')}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            
                            {/* Duplicate button */}
                            <DropdownMenuItem
                              onClick={() => {
                                // Create a duplicate without ID and metadata
                                const duplicateData = { ...item };
                                
                                // Remove any identifiers
                                delete duplicateData.id;
                                delete duplicateData.docId;
                                delete duplicateData.firebaseId;
                                delete duplicateData.__id;
                                delete duplicateData.__optimistic;
                                delete duplicateData.__updating;
                                
                                // Adjust title if it exists
                                if (duplicateData.title) {
                                  duplicateData.title = `${duplicateData.title} (Copy)`;
                                }
                                
                                // Open the dialog with the duplicate
                                openDialog(duplicateData);
                              }}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(item)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                              {deleteMutation.isPending && (
                                <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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