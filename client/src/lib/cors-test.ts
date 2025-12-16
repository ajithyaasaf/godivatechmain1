/**
 * CORS Testing Utilities
 * Functions to test CORS configuration between frontend and backend
 */

interface CorsTestResult {
    success: boolean;
    message: string;
    headers?: Record<string, string>;
    details?: any;
}

interface ComprehensiveTestResult {
    timestamp: string;
    origin: string;
    serverUrl: string;
    results: Record<string, CorsTestResult>;
}

/**
 * Test CORS configuration for a specific endpoint
 */
export async function testCorsForEndpoint(endpoint: string): Promise<CorsTestResult> {
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Extract CORS headers
        const corsHeaders: Record<string, string> = {};
        const headerKeys = [
            'access-control-allow-origin',
            'access-control-allow-methods',
            'access-control-allow-headers',
            'access-control-allow-credentials',
        ];

        headerKeys.forEach(key => {
            const value = response.headers.get(key);
            if (value) {
                corsHeaders[key] = value;
            }
        });

        const success = response.ok;
        const data = response.ok ? await response.json().catch(() => null) : null;

        return {
            success,
            message: success
                ? `✓ CORS test passed for ${endpoint}`
                : `✗ CORS test failed for ${endpoint} (Status: ${response.status})`,
            headers: corsHeaders,
            details: data,
        };
    } catch (error) {
        return {
            success: false,
            message: `✗ Network error testing ${endpoint}: ${error instanceof Error ? error.message : String(error)}`,
        };
    }
}

/**
 * Run comprehensive CORS tests across multiple common endpoints
 */
export async function runComprehensiveCorsTest(): Promise<ComprehensiveTestResult> {
    const endpoints = [
        '/api/categories',
        '/api/blog-posts',
        '/api/projects',
        '/api/services',
        '/api/testimonials',
        '/api/team-members',
    ];

    const results: Record<string, CorsTestResult> = {};

    // Test each endpoint
    for (const endpoint of endpoints) {
        results[endpoint] = await testCorsForEndpoint(endpoint);
    }

    return {
        timestamp: new Date().toISOString(),
        origin: window.location.origin,
        serverUrl: window.location.origin,
        results,
    };
}
