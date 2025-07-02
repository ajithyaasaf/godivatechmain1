import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { API_CONFIG, ENV } from "@/config/environment";

// Use the centralized API configuration
const API_BASE_URL = API_CONFIG.BASE_URL;

console.log('API Configuration:', {
  BASE_URL: API_BASE_URL,
  ENV: ENV.mode,
  isProd: ENV.isProd,
  isDev: ENV.isDev,
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server'
});

// Function to construct full API URL with improved environment handling
function getFullApiUrl(urlPath: string): string {
  // If the URL already starts with http(s), it's a full URL
  if (urlPath.startsWith('http')) {
    return urlPath;
  }
  
  // For development in Replit, use relative URLs to avoid CORS issues
  if (ENV.isDev && ENV.isReplit) {
    return urlPath;
  }
  
  // For production deployments, always use the full backend URL
  // Never use relative URLs in production to avoid routing to wrong domains
  const isProdEnv = ENV.isProd || 
    (typeof window !== 'undefined' && (
      window.location.hostname.includes('godivatech.com') ||
      window.location.hostname === 'www.godivatech.com'
    ));
    
  if (isProdEnv) {
    // Use the configured base URL from environment
    const baseUrl = API_BASE_URL;
    
    // If no base URL is configured, use fallback
    if (!baseUrl) {
      console.error('No API base URL configured! Using fallback backend URL.');
      const fallbackUrl = 'https://godivatech-backend.onrender.com';
      const fullUrl = `${fallbackUrl}${urlPath.startsWith('/') ? urlPath : `/${urlPath}`}`;
      console.log(`Using fallback API URL: ${fullUrl}`);
      return fullUrl;
    }
    
    // Ensure proper URL construction
    const baseWithTrailingSlash = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const pathWithoutLeadingSlash = urlPath.startsWith('/') ? urlPath.substring(1) : urlPath;
    
    // Remove api/ prefix if it's already in the base URL to avoid duplicates
    let finalPath = pathWithoutLeadingSlash;
    if (baseUrl.includes('/api') && finalPath.startsWith('api/')) {
      finalPath = finalPath.substring(4);
    }
    
    const fullUrl = `${baseWithTrailingSlash}${finalPath}`;
    console.log(`Constructed API URL: ${fullUrl} from path: ${urlPath}`);
    
    return fullUrl;
  }
  
  // Fallback to relative URL for development
  return urlPath;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Get the full API URL
  const fullUrl = getFullApiUrl(url);
  
  console.log(`API Request: ${method} ${fullUrl}`, data ? { data } : '');
  
  try {
    // Determine if this is a production environment
    const isProdEnv = ENV.isProd || 
      (typeof window !== 'undefined' && (
        window.location.hostname.includes('godivatech.com')
      ));

    const res = await fetch(fullUrl, {
      method,
      headers: {
        "Accept": "application/json",
        ...(data ? { "Content-Type": "application/json" } : {}),
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: isProdEnv ? "omit" : "include",
    });
    
    console.log(`API Response: ${res.status} ${res.statusText} for ${method} ${fullUrl}`);
    
    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText} for ${method} ${fullUrl}`);
      let errorDetails = res.statusText;
      
      try {
        // Try to parse JSON error details
        const errorText = await res.text();
        if (errorText) {
          console.error(`Error response body: ${errorText}`);
          try {
            const errorJson = JSON.parse(errorText);
            errorDetails = errorJson.message || errorJson.error || errorText;
          } catch (e) {
            // Not JSON, use text as is
            errorDetails = errorText;
          }
        }
      } catch (e) {
        console.error('Could not read error details from response', e);
      }
      
      throw new Error(`${res.status}: ${errorDetails}`);
    }
    
    return res;
  } catch (error) {
    console.error(`API Request failed for ${method} ${fullUrl}:`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const urlPath = queryKey[0] as string;
    const fullUrl = getFullApiUrl(urlPath);
    
    console.log(`Query fetch: GET ${urlPath} (Full URL: ${fullUrl})`);
    
    try {
      // Determine if this is a production environment
      const isProdEnv = ENV.isProd || 
        (typeof window !== 'undefined' && (
          window.location.hostname.includes('godivatech.com')
        ));

      const res = await fetch(fullUrl, {
        credentials: isProdEnv ? "omit" : "include",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`Query response: ${res.status} ${res.statusText} for GET ${urlPath}`);
      
      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        console.log(`Returning null for 401 response on ${urlPath} (unauthorized behavior: returnNull)`);
        return null;
      }
      
      if (!res.ok) {
        console.error(`Query error: ${res.status} ${res.statusText} for GET ${urlPath}`);
        let errorDetails = res.statusText;
        
        try {
          // Try to parse JSON error details
          const errorText = await res.text();
          if (errorText) {
            console.error(`Error response body: ${errorText}`);
            try {
              const errorJson = JSON.parse(errorText);
              errorDetails = errorJson.message || errorJson.error || errorText;
            } catch (e) {
              // Not JSON, use text as is
              errorDetails = errorText;
            }
          }
        } catch (e) {
          console.error('Could not read error details from response', e);
        }
        
        throw new Error(`${res.status}: ${errorDetails}`);
      }
      
      const data = await res.json();
      console.log(`Query data received for ${urlPath}:`, typeof data === 'object' ? 'object' : data);
      return data;
    } catch (error) {
      console.error(`Query failed for GET ${urlPath} (${fullUrl}):`, error);
      throw error;
    }
  };

/**
 * Creates an optimized Query Client instance with improved caching settings
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      // Fine-tuned caching behavior
      staleTime: 1000 * 60 * 5, // 5 minutes before data is considered stale
      gcTime: 1000 * 60 * 30, // 30 minutes before unused data is garbage collected
      // Only refetch when window is focused if data is stale
      refetchOnWindowFocus: true,
      // Retry 3 times with exponential backoff if a query fails
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Reduce unnecessary refetches
      refetchInterval: false,
      // Add structured keys for better cache management
      structuralSharing: true,
      // Prevent refetch on component mount if data is fresh
      refetchOnMount: true,
    },
    mutations: {
      // Don't retry mutations to prevent duplicate writes
      retry: false,
      // Notify all related queries to refetch after mutation
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    },
  },
});
