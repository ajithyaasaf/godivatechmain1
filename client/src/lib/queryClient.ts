import { QueryClient, QueryFunction } from "@tanstack/react-query";

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
  console.log(`API Request: ${method} ${url}`, data ? { data } : '');
  
  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });
    
    console.log(`API Response: ${res.status} ${res.statusText} for ${method} ${url}`);
    
    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText} for ${method} ${url}`);
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
    console.error(`API Request failed for ${method} ${url}:`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    console.log(`Query fetch: GET ${url}`);
    
    try {
      const res = await fetch(url, {
        credentials: "include",
      });
      
      console.log(`Query response: ${res.status} ${res.statusText} for GET ${url}`);
      
      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        console.log(`Returning null for 401 response on ${url} (unauthorized behavior: returnNull)`);
        return null;
      }
      
      if (!res.ok) {
        console.error(`Query error: ${res.status} ${res.statusText} for GET ${url}`);
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
      console.log(`Query data received for ${url}:`, typeof data === 'object' ? 'object' : data);
      return data;
    } catch (error) {
      console.error(`Query failed for GET ${url}:`, error);
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
