/**
 * CORS Test Utility
 * 
 * This utility helps diagnose CORS issues with the backend API.
 * It makes test requests to verify if CORS is properly configured.
 */

/**
 * Test a specific API endpoint for CORS compatibility
 * @param endpoint The API endpoint to test (e.g., '/api/user')
 * @returns Promise with the test result object
 */
export async function testCorsForEndpoint(endpoint: string): Promise<{
  success: boolean;
  message: string;
  details?: any;
  headers?: Record<string, string>;
}> {
  const start = performance.now();
  const serverUrl = import.meta.env.VITE_SERVER_URL || '';

  const url = endpoint.startsWith('http') 
    ? endpoint 
    : (serverUrl + (endpoint.startsWith('/') ? endpoint : `/${endpoint}`));
  
  console.log(`Testing CORS for: ${url}`);

  try {
    // First make an OPTIONS request to test preflight
    const preflightResponse = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      },
      mode: 'cors'
    });
    
    const preflightHeaders: Record<string, string> = {};
    preflightResponse.headers.forEach((value, key) => {
      if (key.toLowerCase().startsWith('access-control')) {
        preflightHeaders[key] = value;
      }
    });
    
    // If preflight failed, return the error
    if (!preflightResponse.ok && preflightResponse.status !== 204) {
      return {
        success: false,
        message: `Preflight request failed with status: ${preflightResponse.status}`,
        headers: preflightHeaders
      };
    }
    
    // Now try the actual request
    const response = await fetch(url, { 
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      if (key.toLowerCase().startsWith('access-control')) {
        responseHeaders[key] = value;
      }
    });

    const duration = Math.round(performance.now() - start);
    
    // Even if we get a 401 or 404, that's fine for CORS testing
    // as long as we didn't get blocked by CORS
    if (response.status === 401 || response.status === 404) {
      return {
        success: true,
        message: `CORS is properly configured! (Got ${response.status} in ${duration}ms)`,
        details: {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          duration
        },
        headers: responseHeaders
      };
    }
    
    if (response.ok) {
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        responseData = 'Not JSON response';
      }
      
      return {
        success: true,
        message: `CORS is properly configured! API responded in ${duration}ms`,
        details: {
          status: response.status,
          data: responseData,
          duration
        },
        headers: responseHeaders
      };
    } else {
      return {
        success: false,
        message: `API request failed with status: ${response.status}`,
        details: {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        },
        headers: responseHeaders
      };
    }
  } catch (error) {
    // This is likely a CORS error
    return {
      success: false,
      message: `CORS error: ${error instanceof Error ? error.message : String(error)}`,
      details: {
        error: error instanceof Error ? { 
          name: error.name,
          message: error.message,
          stack: error.stack
        } : String(error)
      }
    };
  }
}

/**
 * Run a comprehensive CORS test for multiple endpoints
 * @returns Promise with the test results for all endpoints
 */
export async function runComprehensiveCorsTest() {
  const endpoints = [
    '/api/user',
    '/api/blog-posts',
    '/api/categories',
    '/api/services',
    '/api/projects'
  ];
  
  const results: Record<string, Awaited<ReturnType<typeof testCorsForEndpoint>>> = {};
  
  for (const endpoint of endpoints) {
    results[endpoint] = await testCorsForEndpoint(endpoint);
  }
  
  return {
    timestamp: new Date().toISOString(),
    origin: window.location.origin,
    serverUrl: import.meta.env.VITE_SERVER_URL || 'Not set',
    userAgent: navigator.userAgent,
    results
  };
}