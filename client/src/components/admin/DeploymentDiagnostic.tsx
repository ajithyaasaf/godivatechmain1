import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { firebaseConfig } from '@/lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { apiRequest } from '@/lib/queryClient';

interface DiagnosticItemProps {
  title: string;
  status: 'success' | 'error' | 'warning' | 'loading';
  details: string;
  value?: string;
}

const DiagnosticItem = ({ title, status, details, value }: DiagnosticItemProps) => {
  const statusColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    loading: 'bg-blue-500 animate-pulse',
  };
  
  return (
    <div className="border p-4 rounded-md mb-2">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">{title}</h3>
        <Badge className={statusColors[status]}>
          {status === 'loading' ? 'Checking...' : status.toUpperCase()}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mt-2">{details}</p>
      {value && (
        <pre className="bg-muted p-2 rounded text-xs mt-2 overflow-x-auto">
          {value}
        </pre>
      )}
    </div>
  );
};

export function DeploymentDiagnostic() {
  const [environment, setEnvironment] = useState<'development' | 'production' | 'unknown'>('unknown');
  const [diagnostics, setDiagnostics] = useState<DiagnosticItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<'authenticated' | 'unauthenticated' | 'loading'>('loading');
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'loading'>('loading');
  
  // Check environment 
  useEffect(() => {
    const isDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname.includes('replit');
    setEnvironment(isDevelopment ? 'development' : 'production');
  }, []);
  
  // Check Firebase configuration
  useEffect(() => {
    const firebaseDiagnostic: DiagnosticItemProps = {
      title: 'Firebase Configuration',
      status: 'loading',
      details: 'Checking Firebase configuration...'
    };

    try {
      // Check if firebase config has all required fields
      const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
      const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
      
      if (missingFields.length > 0) {
        firebaseDiagnostic.status = 'error';
        firebaseDiagnostic.details = `Missing Firebase configuration fields: ${missingFields.join(', ')}`;
      } else {
        firebaseDiagnostic.status = 'success';
        firebaseDiagnostic.details = 'Firebase configuration is valid';
        
        // Show only partial API key for security
        const maskedConfig = {...firebaseConfig};
        if (maskedConfig.apiKey) {
          maskedConfig.apiKey = maskedConfig.apiKey.substring(0, 5) + '...' + 
                             maskedConfig.apiKey.substring(maskedConfig.apiKey.length - 5);
        }
        
        firebaseDiagnostic.value = JSON.stringify(maskedConfig, null, 2);
      }
    } catch (error) {
      firebaseDiagnostic.status = 'error';
      firebaseDiagnostic.details = `Error checking Firebase configuration: ${error instanceof Error ? error.message : String(error)}`;
    }
    
    setDiagnostics(prev => {
      const newDiagnostics = [...prev];
      const index = newDiagnostics.findIndex(d => d.title === firebaseDiagnostic.title);
      if (index >= 0) {
        newDiagnostics[index] = firebaseDiagnostic;
      } else {
        newDiagnostics.push(firebaseDiagnostic);
      }
      return newDiagnostics;
    });
  }, []);
  
  // Check Auth state
  useEffect(() => {
    const auth = getAuth();
    const authDiagnostic: DiagnosticItemProps = {
      title: 'Authentication Status',
      status: 'loading',
      details: 'Checking authentication status...'
    };
    
    setDiagnostics(prev => [...prev, authDiagnostic]);
    
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        if (user) {
          setAuthStatus('authenticated');
          authDiagnostic.status = 'success';
          authDiagnostic.details = `Authenticated as ${user.email || user.uid}`;
        } else {
          setAuthStatus('unauthenticated');
          authDiagnostic.status = 'warning';
          authDiagnostic.details = 'Not authenticated';
        }
        
        setDiagnostics(prev => {
          const newDiagnostics = [...prev];
          const index = newDiagnostics.findIndex(d => d.title === authDiagnostic.title);
          if (index >= 0) {
            newDiagnostics[index] = authDiagnostic;
          }
          return newDiagnostics;
        });
      },
      (error) => {
        setAuthStatus('unauthenticated');
        authDiagnostic.status = 'error';
        authDiagnostic.details = `Authentication error: ${error.message}`;
        
        setDiagnostics(prev => {
          const newDiagnostics = [...prev];
          const index = newDiagnostics.findIndex(d => d.title === authDiagnostic.title);
          if (index >= 0) {
            newDiagnostics[index] = authDiagnostic;
          }
          return newDiagnostics;
        });
      }
    );
    
    return () => unsubscribe();
  }, []);
  
  // Check API connectivity
  useEffect(() => {
    const apiDiagnostic: DiagnosticItemProps = {
      title: 'API Connectivity',
      status: 'loading',
      details: 'Checking API connection...'
    };
    
    setDiagnostics(prev => [...prev, apiDiagnostic]);
    
    const checkApi = async () => {
      try {
        const startTime = performance.now();
        const response = await apiRequest('GET', '/api/categories');
        const endTime = performance.now();
        const latency = Math.round(endTime - startTime);
        
        if (response.ok) {
          setApiStatus('connected');
          apiDiagnostic.status = 'success';
          apiDiagnostic.details = `API is accessible (${latency}ms latency)`;
          
          // Get response data for debugging
          const data = await response.json();
          apiDiagnostic.value = `Received ${data.length} categories:\n${JSON.stringify(data.slice(0, 2), null, 2)}${data.length > 2 ? '\n...' : ''}`;
        } else {
          setApiStatus('disconnected');
          apiDiagnostic.status = 'error';
          apiDiagnostic.details = `API returned status ${response.status} (${response.statusText})`;
        }
      } catch (error) {
        setApiStatus('disconnected');
        apiDiagnostic.status = 'error';
        apiDiagnostic.details = `API connection error: ${error instanceof Error ? error.message : String(error)}`;
      }
      
      setDiagnostics(prev => {
        const newDiagnostics = [...prev];
        const index = newDiagnostics.findIndex(d => d.title === apiDiagnostic.title);
        if (index >= 0) {
          newDiagnostics[index] = apiDiagnostic;
        }
        return newDiagnostics;
      });
      
      setLoading(false);
    };
    
    checkApi();
  }, []);
  
  // Environment information
  useEffect(() => {
    const envDiagnostic: DiagnosticItemProps = {
      title: 'Environment Information',
      status: 'success',
      details: `Running in ${environment} mode`,
      value: `
BASE_URL: ${import.meta.env.BASE_URL || 'Not set'}
SERVER_URL: ${import.meta.env.VITE_SERVER_URL || 'Not set'}
FIREBASE_API_KEY: ${import.meta.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Not set'}
FIREBASE_AUTH_DOMAIN: ${import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Not set'}
FIREBASE_PROJECT_ID: ${import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'Set' : 'Not set'}
HOSTNAME: ${window.location.hostname}
PATHNAME: ${window.location.pathname}
USER_AGENT: ${navigator.userAgent}
      `.trim()
    };
    
    setDiagnostics(prev => [...prev, envDiagnostic]);
  }, [environment]);
  
  // Run diagnostics again
  const runDiagnostics = () => {
    setLoading(true);
    setDiagnostics([]);
    
    // The useEffects will re-run the diagnostics
    setAuthStatus('loading');
    setApiStatus('loading');
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Deployment Diagnostics
          <Badge className={environment === 'development' ? 'bg-blue-500' : 'bg-green-500'}>
            {environment.toUpperCase()}
          </Badge>
        </CardTitle>
        <CardDescription>
          Troubleshooting tool to diagnose production deployment issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              <span className="ml-3">Running diagnostics...</span>
            </div>
          ) : (
            <>
              {diagnostics.map((diagnostic, index) => (
                <DiagnosticItem key={index} {...diagnostic} />
              ))}
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Deployment Checklist</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Ensure Firebase configuration is set in production environment variables</li>
                      <li>Check CORS settings in backend server to allow production domains</li>
                      <li>Verify API endpoints are accessible from production deployment</li>
                      <li>Ensure backend is deployed and running (e.g., on Render.com)</li>
                      <li>Set VITE_SERVER_URL environment variable to point to backend URL</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Common Issues</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Authentication fails:</strong> Verify Firebase project settings allow your domain</li>
                      <li><strong>API requests fail:</strong> Check CORS settings and ensure backend URL is correct</li>
                      <li><strong>Styles missing:</strong> The Tailwind configuration might be different between development and production</li>
                      <li><strong>Asset loading fails:</strong> Ensure paths are correct for the production environment</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="flex justify-end mt-4">
                <Button onClick={runDiagnostics}>
                  Run Diagnostics Again
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}