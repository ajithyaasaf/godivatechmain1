import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getNetworkStatus, NetworkStatus } from "../hooks/use-network-status";

// Constants for retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 10000; // 10 seconds
const REQUEST_TIMEOUT = 15000; // 15 seconds

// Get the API base URL from environment or use the backend URL for production
const API_BASE_URL = import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_API_URL || window.location.origin;
console.log('Enhanced API Base URL:', API_BASE_URL);

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

/**
 * Error types for more specific API error handling
 */
export enum ApiErrorType {
  NETWORK = "network",
  UNAUTHORIZED = "unauthorized",
  FORBIDDEN = "forbidden",
  NOT_FOUND = "not_found",
  SERVER = "server",
  TIMEOUT = "timeout",
  VALIDATION = "validation",
  UNKNOWN = "unknown"
}

/**
 * Custom error class for API operations
 */
export class ApiError extends Error {
  type: ApiErrorType;
  statusCode?: number;
  originalError?: Error;
  retryable: boolean;
  
  constructor(
    message: string, 
    type: ApiErrorType = ApiErrorType.UNKNOWN,
    statusCode?: number,
    originalError?: Error,
    retryable = true
  ) {
    super(message);
    this.name = "ApiError";
    this.type = type;
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.retryable = retryable;
  }
}

/**
 * Determine if an error is retryable
 */
function isRetryableError(error: any): boolean {
  // ApiError with retryable flag
  if (error instanceof ApiError) {
    return error.retryable;
  }
  
  // Network errors are generally retryable
  if (error?.message?.includes('network') || 
      error?.message?.includes('timeout') ||
      error?.message?.includes('abort')) {
    return true;
  }
  
  // Server errors (5xx) are retryable
  if (error?.statusCode && error.statusCode >= 500 && error.statusCode < 600) {
    return true;
  }
  
  // Client errors (4xx) are generally not retryable (except specific ones)
  if (error?.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
    // 408 (Request Timeout) and 429 (Too Many Requests) are retryable
    return error.statusCode === 408 || error.statusCode === 429;
  }
  
  // Default to retryable for unknown errors
  return true;
}

/**
 * Calculate exponential backoff duration with jitter
 */
function calculateBackoff(attempt: number, baseDelay = INITIAL_RETRY_DELAY): number {
  // Exponential backoff: 2^attempt * baseDelay
  const exponentialDelay = Math.min(
    MAX_RETRY_DELAY,
    baseDelay * Math.pow(2, attempt)
  );
  
  // Add jitter (±30% randomization) to prevent thundering herd
  const jitter = (Math.random() * 0.6 - 0.3); // -30% to +30%
  const delay = exponentialDelay * (1 + jitter);
  
  return Math.min(MAX_RETRY_DELAY, Math.max(baseDelay, delay));
}

/**
 * Wait for the specified milliseconds
 */
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Add timeout to a fetch request
 */
async function fetchWithTimeout(
  url: string, 
  options: RequestInit = {}, 
  timeout = REQUEST_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const { signal } = controller;
  
  // Create a timeout that will abort the request
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);
  
  try {
    // Add the abort signal to the fetch options
    const response = await fetch(url, { ...options, signal });
    return response;
  } catch (error) {
    const err = error as Error;
    if (err.name === 'AbortError') {
      throw new ApiError(
        `Request timed out after ${timeout}ms: ${url}`,
        ApiErrorType.TIMEOUT,
        408,
        err,
        true
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Categorize HTTP status code to API error type
 */
function categorizeHttpStatus(status: number): ApiErrorType {
  if (status >= 200 && status < 300) return ApiErrorType.UNKNOWN; // Success
  
  if (status === 401) return ApiErrorType.UNAUTHORIZED;
  if (status === 403) return ApiErrorType.FORBIDDEN;
  if (status === 404) return ApiErrorType.NOT_FOUND;
  if (status === 408) return ApiErrorType.TIMEOUT;
  if (status === 422) return ApiErrorType.VALIDATION;
  
  if (status >= 400 && status < 500) return ApiErrorType.VALIDATION;
  if (status >= 500 && status < 600) return ApiErrorType.SERVER;
  
  return ApiErrorType.UNKNOWN;
}

/**
 * Retry operation with exponential backoff
 */
async function retryOperation<T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  let lastError: any;
  
  // Check network status before attempting operation
  const networkStatus = getNetworkStatus();
  if (networkStatus === NetworkStatus.OFFLINE) {
    console.error(`Cannot perform operation ${operationName}: Network is offline`);
    throw new ApiError(
      `Cannot perform operation: Network is offline`,
      ApiErrorType.NETWORK,
      undefined,
      undefined,
      false
    );
  }
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation();
      return result;
    } catch (error: any) {
      lastError = error;
      console.warn(`Attempt ${attempt + 1}/${maxRetries + 1} failed for ${operationName}:`, error);
      
      // Determine if we should retry
      const retryable = isRetryableError(error);
      
      // If network is offline after this attempt, stop retrying
      if (getNetworkStatus() === NetworkStatus.OFFLINE) {
        console.error(`Cannot retry operation ${operationName}: Network is now offline`);
        throw new ApiError(
          `Cannot retry operation: Network is offline`,
          ApiErrorType.NETWORK,
          undefined,
          error,
          false
        );
      }
      
      // If not retryable or last attempt, throw
      if (!retryable || attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying with exponential backoff
      const backoffTime = calculateBackoff(attempt);
      console.log(`Retrying ${operationName} in ${Math.round(backoffTime)}ms...`);
      await wait(backoffTime);
    }
  }
  
  // This shouldn't happen but TypeScript needs it
  throw lastError;
}

/**
 * Enhanced API request with retry, timeout, and error handling
 */
export async function enhancedApiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  options: RequestInit = {}
): Promise<Response> {
  // Get the full API URL
  const fullUrl = getFullApiUrl(url);
  const operationName = `${method} ${url}`;
  
  console.log(`Enhanced API Request: ${operationName}`, data ? { data } : '');
  
  // Apply default options
  const requestOptions: RequestInit = {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    ...options
  };
  
  return retryOperation(async () => {
    try {
      // Use fetch with timeout
      const response = await fetchWithTimeout(fullUrl, requestOptions);
      
      console.log(`API Response: ${response.status} ${response.statusText} for ${method} ${url}`);
      
      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText} for ${method} ${url}`);
        let errorDetails = response.statusText;
        let errorData: any = {};
        
        try {
          // Try to parse error details from response
          const errorText = await response.text();
          if (errorText) {
            console.error(`Error response body: ${errorText}`);
            try {
              errorData = JSON.parse(errorText);
              errorDetails = errorData.message || errorData.error || errorText;
            } catch (e) {
              // Not JSON, use text as is
              errorDetails = errorText;
            }
          }
        } catch (e) {
          console.error('Could not read error details from response', e);
        }
        
        // Create appropriate ApiError
        const errorType = categorizeHttpStatus(response.status);
        const apiError = new ApiError(
          errorDetails,
          errorType,
          response.status,
          undefined,
          isRetryableError({ statusCode: response.status })
        );
        
        throw apiError;
      }
      
      return response;
    } catch (error) {
      const err = error as Error;
      // Handle network errors specifically
      if (err.name === 'TypeError' && err.message.includes('network')) {
        throw new ApiError(
          `Network error: Could not connect to ${fullUrl}`,
          ApiErrorType.NETWORK,
          undefined,
          err,
          true
        );
      }
      
      // If already an ApiError, just rethrow
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Otherwise, wrap in ApiError
      console.error(`API Request failed for ${method} ${url}:`, error);
      throw new ApiError(
        err.message || 'Unknown API error',
        ApiErrorType.UNKNOWN,
        undefined,
        err,
        true
      );
    }
  }, operationName);
}

/**
 * Enhanced query function for TanStack Query with improved error handling
 */
type UnauthorizedBehavior = "returnNull" | "throw";
export const getEnhancedQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const urlPath = queryKey[0] as string;
    const fullUrl = getFullApiUrl(urlPath);
    const operationName = `GET ${urlPath}`;
    
    console.log(`Enhanced Query fetch: ${operationName} (Full URL: ${fullUrl})`);
    
    return retryOperation(async () => {
      try {
        const response = await fetchWithTimeout(fullUrl, {
          credentials: "include"
        });
        
        console.log(`Query response: ${response.status} ${response.statusText} for GET ${urlPath}`);
        
        if (unauthorizedBehavior === "returnNull" && response.status === 401) {
          console.log(`Returning null for 401 response on ${urlPath} (unauthorized behavior: returnNull)`);
          return null;
        }
        
        if (!response.ok) {
          console.error(`Query error: ${response.status} ${response.statusText} for GET ${urlPath}`);
          let errorDetails = response.statusText;
          
          try {
            // Try to parse JSON error details
            const errorText = await response.text();
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
          
          // Create appropriate ApiError
          const errorType = categorizeHttpStatus(response.status);
          throw new ApiError(
            errorDetails,
            errorType,
            response.status,
            undefined,
            isRetryableError({ statusCode: response.status })
          );
        }
        
        const data = await response.json();
        console.log(`Query data received for ${urlPath}:`, typeof data === 'object' ? 'object' : data);
        return data;
      } catch (error) {
        const err = error as Error;
        // Handle network errors specifically
        if (err.name === 'TypeError' && err.message.includes('network')) {
          throw new ApiError(
            `Network error: Could not connect to ${fullUrl}`,
            ApiErrorType.NETWORK,
            undefined,
            err,
            true
          );
        }
        
        // If already an ApiError, just rethrow
        if (error instanceof ApiError) {
          throw error;
        }
        
        console.error(`Query failed for GET ${urlPath}:`, error);
        throw new ApiError(
          err.message || 'Unknown API error',
          ApiErrorType.UNKNOWN,
          undefined,
          err,
          true
        );
      }
    }, operationName);
  };

/**
 * Create an enhanced query client with improved error handling and retry logic
 */
export function createEnhancedQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: getEnhancedQueryFn({ on401: "throw" }),
        refetchInterval: false,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 3,
        retryDelay: attemptIndex => calculateBackoff(attemptIndex),
      },
      mutations: {
        retry: 2,
        retryDelay: attemptIndex => calculateBackoff(attemptIndex),
      },
    },
  });
}

// Create the enhanced query client
export const enhancedQueryClient = createEnhancedQueryClient();