import { useState } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFirebaseConfigInfo, testFirebaseConfig } from "@/lib/firebase-env-test";
import { AlertCircle, ArrowLeft, ExternalLink, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

// This is a standalone diagnostic page that doesn't require authentication
// Useful for verifying proper environment configuration on Vercel

interface DiagnosticResult {
  section: string;
  details: { label: string; value: string; isError?: boolean }[];
}

export default function DiagnosticsPage() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [configInfo, setConfigInfo] = useState(getFirebaseConfigInfo());
  
  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    // Environment Info
    addResult({
      section: "Environment",
      details: [
        { label: "Mode", value: import.meta.env.MODE },
        { label: "Host", value: window.location.hostname },
        { label: "Firebase Project", value: configInfo.projectId || "Unknown" },
        { label: "Auth Domain", value: configInfo.authDomain || "Unknown" },
        { label: "API Base URL", value: configInfo.apiBaseUrl || "Not configured" }
      ]
    });
    
    // Environment Variables
    const envVars = [
      "VITE_FIREBASE_API_KEY",
      "VITE_FIREBASE_AUTH_DOMAIN",
      "VITE_FIREBASE_PROJECT_ID",
      "VITE_FIREBASE_STORAGE_BUCKET",
      "VITE_FIREBASE_MESSAGING_SENDER_ID",
      "VITE_FIREBASE_APP_ID",
      "VITE_FIREBASE_MEASUREMENT_ID",
      "VITE_SERVER_URL"
    ];
    
    addResult({
      section: "Environment Variables",
      details: envVars.map(varName => ({
        label: varName,
        value: import.meta.env[varName] ? "✓ Set" : "✗ Missing",
        isError: !import.meta.env[varName]
      }))
    });
    
    // API Connections
    const endpoints = [
      "/api/services",
      "/api/blog-posts",
      "/api/projects",
      "/api/team-members",
      "/api/testimonials"
    ];
    
    const apiResults = [];
    
    for (const endpoint of endpoints) {
      try {
        const start = Date.now();
        const response = await fetch(endpoint);
        const elapsed = Date.now() - start;
        
        if (response.ok) {
          const data = await response.json();
          apiResults.push({
            label: endpoint,
            value: `✓ Status: ${response.status} (${elapsed}ms, ${Array.isArray(data) ? data.length : '1'} item(s))`
          });
        } else {
          apiResults.push({
            label: endpoint,
            value: `✗ Status: ${response.status} (${elapsed}ms)`,
            isError: true
          });
        }
      } catch (error: any) {
        apiResults.push({
          label: endpoint,
          value: `✗ Error: ${error.message}`,
          isError: true
        });
      }
    }
    
    addResult({
      section: "API Endpoints",
      details: apiResults
    });
    
    // Run Firebase Config Test
    try {
      const fbResult = await testFirebaseConfig();
      addResult({
        section: "Firebase Configuration",
        details: [
          { 
            label: "Test Result", 
            value: fbResult.success ? "✓ Passed" : "✗ Failed",
            isError: !fbResult.success
          },
          { 
            label: "Message", 
            value: fbResult.message || "No details available"
          }
        ]
      });
    } catch (error: any) {
      addResult({
        section: "Firebase Configuration",
        details: [
          { 
            label: "Test Result", 
            value: "✗ Error running test",
            isError: true
          },
          { 
            label: "Error", 
            value: error.message,
            isError: true
          }
        ]
      });
    }
    
    setIsRunning(false);
  };
  
  const addResult = (result: DiagnosticResult) => {
    setResults(prev => [...prev, result]);
  };
  
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Helmet>
          <title>System Diagnostics | GodivaTech</title>
        </Helmet>
        
        <div className="flex items-center mb-6">
          <Link href="/">
            <a className="flex items-center text-sm text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Homepage
            </a>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              {import.meta.env.MODE}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {window.location.hostname}
            </Badge>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold">GodivaTech System Diagnostics</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              This tool helps diagnose deployment issues between Replit and Vercel environments.
            </p>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertTitle>Environment Information</AlertTitle>
              <AlertDescription>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm">
                  <div className="font-medium">Mode:</div>
                  <div>{import.meta.env.MODE}</div>
                  
                  <div className="font-medium">Hostname:</div>
                  <div>{window.location.hostname}</div>
                  
                  <div className="font-medium">Firebase Project:</div>
                  <div>{configInfo.projectId || "Unknown"}</div>
                  
                  <div className="font-medium">API Base URL:</div>
                  <div>{configInfo.apiBaseUrl || "Not configured"}</div>
                </div>
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-center mb-6">
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                size="lg"
                className="w-full sm:w-auto"
              >
                {isRunning ? "Running Diagnostics..." : "Run Full Diagnostic Tests"}
              </Button>
            </div>
            
            {results.length > 0 ? (
              <div className="space-y-6">
                {results.map((result, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="bg-slate-100 px-4 py-3 font-medium">
                      {result.section}
                    </div>
                    <div className="p-4">
                      <dl className="grid gap-y-2">
                        {result.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="grid grid-cols-2 gap-4">
                            <dt className="text-sm font-medium text-gray-700">{detail.label}</dt>
                            <dd className={`text-sm ${detail.isError ? 'text-red-600' : 'text-gray-900'}`}>
                              {detail.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                No diagnostic results yet. Click the button above to run tests.
              </div>
            )}
            
            <Separator className="my-6" />
            
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Note:</strong> This diagnostic tool is designed to help troubleshoot deployment issues between Replit and Vercel environments.
              </p>
              <p>
                For more detailed information, please check the browser console logs after running tests.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center text-sm text-slate-500">
          <a 
            href="https://github.com/vercel/vercel/blob/main/TROUBLESHOOTING.md" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-slate-600 hover:text-slate-900"
          >
            Vercel Troubleshooting Guide
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}