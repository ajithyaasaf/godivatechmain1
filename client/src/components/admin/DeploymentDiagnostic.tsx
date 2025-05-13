import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFirebaseAuth } from '@/hooks/use-firebase-auth';
import { getFirebaseConfigInfo } from '@/lib/firebase-env-test';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

export default function DeploymentDiagnostic() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [configInfo, setConfigInfo] = useState<any>(null);
  const { currentUser } = useFirebaseAuth();

  useEffect(() => {
    setConfigInfo(getFirebaseConfigInfo());
  }, []);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);
    
    // Environment check
    addResult({
      test: 'Environment Detection',
      status: 'success',
      message: `Running in ${import.meta.env.MODE} mode`,
      details: `Host: ${window.location.hostname}`
    });
    
    // Firebase project check
    addResult({
      test: 'Firebase Project',
      status: 'success',
      message: `Project ID: ${configInfo?.projectId || 'Unknown'}`,
      details: `Auth Domain: ${configInfo?.authDomain || 'Unknown'}`
    });
    
    // Authentication status check
    if (currentUser) {
      addResult({
        test: 'Authentication',
        status: 'success',
        message: `Authenticated as ${currentUser.email}`,
        details: `UID: ${currentUser.uid}`
      });
      
      // Token test
      try {
        const token = await currentUser.getIdToken();
        addResult({
          test: 'Auth Token',
          status: 'success',
          message: `Token retrieved successfully`,
          details: `Token length: ${token.length} characters`
        });
      } catch (error: any) {
        addResult({
          test: 'Auth Token',
          status: 'error',
          message: `Failed to retrieve token`,
          details: error.message
        });
      }
    } else {
      addResult({
        test: 'Authentication',
        status: 'warning',
        message: 'Not authenticated',
        details: 'User is not signed in'
      });
    }
    
    // API connection test
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        addResult({
          test: 'API Connection',
          status: 'success',
          message: `Successfully connected to API`,
          details: `Retrieved ${data.length} services`
        });
      } else {
        addResult({
          test: 'API Connection',
          status: 'error',
          message: `API returned status ${response.status}`,
          details: await response.text()
        });
      }
    } catch (error: any) {
      addResult({
        test: 'API Connection',
        status: 'error',
        message: 'Failed to connect to API',
        details: error.message
      });
    }
    
    // Environment variables check
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_APP_ID',
      'VITE_SERVER_URL'
    ];
    
    const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
    
    if (missingVars.length === 0) {
      addResult({
        test: 'Environment Variables',
        status: 'success',
        message: `All required environment variables are present`,
        details: requiredVars.join(', ')
      });
    } else {
      addResult({
        test: 'Environment Variables',
        status: 'warning',
        message: `Missing ${missingVars.length} environment variables`,
        details: `Missing: ${missingVars.join(', ')}`
      });
    }
    
    setIsRunning(false);
  };
  
  const addResult = (result: DiagnosticResult) => {
    setResults(prev => [...prev, result]);
  };
  
  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <Info className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };
  
  const getStatusBadge = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Success</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Warning</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Error</Badge>;
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Deployment Diagnostic Tool</span>
          <Badge variant="outline">{import.meta.env.MODE}</Badge>
        </CardTitle>
        <CardDescription>
          This tool helps diagnose issues with Firebase authentication and data fetching in different deployment environments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {configInfo && (
          <div className="mb-6 text-sm">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="font-semibold">Project ID:</div>
              <div>{configInfo.projectId || 'Unknown'}</div>
              
              <div className="font-semibold">Auth Domain:</div>
              <div>{configInfo.authDomain || 'Unknown'}</div>
              
              <div className="font-semibold">Environment:</div>
              <div>{configInfo.environment || 'Unknown'}</div>
              
              <div className="font-semibold">API Base URL:</div>
              <div>{configInfo.apiBaseUrl || 'Not configured'}</div>
              
              <div className="font-semibold">Hostname:</div>
              <div>{configInfo.hostname || 'Unknown'}</div>
            </div>
          </div>
        )}
        
        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.test}</span>
                  </div>
                  {getStatusBadge(result.status)}
                </div>
                <p className="text-sm mb-1">{result.message}</p>
                {result.details && (
                  <p className="text-xs text-gray-500">{result.details}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>No diagnostics run yet</AlertTitle>
            <AlertDescription>
              Click the button below to run diagnostics on your current deployment environment.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          {currentUser ? `Signed in as ${currentUser.email}` : 'Not signed in'}
        </div>
        <Button onClick={runDiagnostics} disabled={isRunning}>
          {isRunning ? 'Running Diagnostics...' : 'Run Diagnostics'}
        </Button>
      </CardFooter>
    </Card>
  );
}