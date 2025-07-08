import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { testCorsForEndpoint, runComprehensiveCorsTest } from '@/utils/cors-test';

export function CorsTestTool() {
  const [customEndpoint, setCustomEndpoint] = useState('/api/categories');
  const [loading, setLoading] = useState(false);
  const [comprehensive, setComprehensive] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSingleTest = async () => {
    setLoading(true);
    setComprehensive(false);
    try {
      const result = await testCorsForEndpoint(customEndpoint);
      setResults(result);
    } catch (error) {
      setResults({
        success: false,
        message: `Error running test: ${error instanceof Error ? error.message : String(error)}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleComprehensiveTest = async () => {
    setLoading(true);
    setComprehensive(true);
    try {
      const result = await runComprehensiveCorsTest();
      setResults(result);
    } catch (error) {
      setResults({
        success: false,
        message: `Error running comprehensive test: ${error instanceof Error ? error.message : String(error)}`
      });
    } finally {
      setLoading(false);
    }
  };

  const formatJsonOutput = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>CORS Testing Tool</CardTitle>
        <CardDescription>
          Test CORS configuration between your frontend and backend API
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="endpoint">API Endpoint</Label>
            <div className="flex space-x-2">
              <Input
                id="endpoint"
                placeholder="/api/endpoint"
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
              />
              <Button onClick={handleSingleTest} disabled={loading}>
                {loading && !comprehensive ? "Testing..." : "Test Endpoint"}
              </Button>
            </div>
          </div>

          <div className="text-center">
            <Button variant="outline" onClick={handleComprehensiveTest} disabled={loading}>
              {loading && comprehensive ? "Running..." : "Run Comprehensive Test"}
            </Button>
          </div>

          {results && (
            <>
              <Separator className="my-4" />
              <h3 className="text-lg font-medium mb-2">Test Results</h3>
              {comprehensive ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Timestamp:</strong> {results.timestamp}
                    </div>
                    <div>
                      <strong>Origin:</strong> {results.origin}
                    </div>
                    <div>
                      <strong>Server URL:</strong> {results.serverUrl}
                    </div>
                    <div>
                      <strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...
                    </div>
                  </div>
                  
                  <h4 className="font-medium mt-4">Endpoint Results:</h4>
                  {Object.entries(results.results).map(([endpoint, result]: [string, any]) => (
                    <div key={endpoint} className="border p-3 rounded-md mb-2">
                      <div className="flex justify-between items-start">
                        <strong>{endpoint}</strong>
                        <span className={`text-sm font-semibold px-2 py-1 rounded-full ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {result.success ? 'SUCCESS' : 'FAILED'}
                        </span>
                      </div>
                      <p className="text-sm my-1">{result.message}</p>
                      {result.headers && (
                        <div className="mt-2 text-xs">
                          <details>
                            <summary className="cursor-pointer">CORS Headers</summary>
                            <pre className="bg-slate-100 p-2 rounded mt-1 overflow-x-auto">
                              {formatJsonOutput(result.headers)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`border p-4 rounded-md ${results.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex justify-between items-start">
                    <strong>{customEndpoint}</strong>
                    <span className={`text-sm font-semibold px-2 py-1 rounded-full ${results.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {results.success ? 'SUCCESS' : 'FAILED'}
                    </span>
                  </div>
                  <p className="my-2">{results.message}</p>
                  
                  {results.headers && (
                    <div className="mt-2">
                      <details>
                        <summary className="cursor-pointer">CORS Headers</summary>
                        <pre className="bg-slate-100 p-2 rounded mt-1 text-xs overflow-x-auto">
                          {formatJsonOutput(results.headers)}
                        </pre>
                      </details>
                    </div>
                  )}
                  
                  {results.details && (
                    <div className="mt-2">
                      <details>
                        <summary className="cursor-pointer">Response Details</summary>
                        <pre className="bg-slate-100 p-2 rounded mt-1 text-xs overflow-x-auto">
                          {formatJsonOutput(results.details)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}