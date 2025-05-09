import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Get the API base URL from environment or use the backend URL for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://godivatech-backend.onrender.com';

// Function to construct full API URL
function getFullApiUrl(urlPath: string): string {
  // If the URL already starts with http(s), it's a full URL
  if (urlPath.startsWith('http')) {
    return urlPath;
  }
  
  // If we're in development, use relative URLs
  if (import.meta.env.DEV) {
    return urlPath;
  }
  
  // In production, prefix with API base URL
  // Ensure there's only one / between base and path
  const baseWithTrailingSlash = API_BASE_URL.endsWith('/') 
    ? API_BASE_URL 
    : `${API_BASE_URL}/`;
  
  const pathWithoutLeadingSlash = urlPath.startsWith('/') 
    ? urlPath.substring(1) 
    : urlPath;
    
  return `${baseWithTrailingSlash}${pathWithoutLeadingSlash}`;
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
    const res = await fetch(fullUrl, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
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
      const res = await fetch(fullUrl, {
        credentials: "include",
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

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
