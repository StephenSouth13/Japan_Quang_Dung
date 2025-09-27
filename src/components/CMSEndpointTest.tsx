import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';

interface EndpointTest {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
  responseTime?: number;
}

export function CMSEndpointTest() {
  const [tests, setTests] = useState<EndpointTest[]>([
    { name: 'CMS Settings', method: 'GET', endpoint: '/cms/settings', status: 'pending' },
    { name: 'CMS Media', method: 'GET', endpoint: '/cms/media', status: 'pending' },
    { name: 'CMS Menus', method: 'GET', endpoint: '/cms/menus', status: 'pending' },
    { name: 'CMS Pages', method: 'GET', endpoint: '/cms/pages', status: 'pending' },
    { name: 'CMS Analytics', method: 'GET', endpoint: '/cms/analytics', status: 'pending' },
  ]);
  
  const [testing, setTesting] = useState(false);

  const testEndpoint = async (test: EndpointTest): Promise<EndpointTest> => {
    const startTime = Date.now();
    
    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2c1a01cc${test.endpoint}`, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const responseTime = Date.now() - startTime;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        if (response.ok && data.success) {
          return {
            ...test,
            status: 'success',
            message: `OK (${data.data?.length || 0} items)`,
            responseTime
          };
        } else {
          return {
            ...test,
            status: 'error',
            message: data.error || `HTTP ${response.status}`,
            responseTime
          };
        }
      } else {
        const text = await response.text();
        return {
          ...test,
          status: 'error',
          message: `Non-JSON response: ${text.substring(0, 100)}...`,
          responseTime
        };
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        ...test,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        responseTime
      };
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    
    // Reset all tests to pending
    setTests(prev => prev.map(test => ({ ...test, status: 'pending' as const })));
    
    // Run tests one by one
    for (let i = 0; i < tests.length; i++) {
      const result = await testEndpoint(tests[i]);
      
      setTests(prev => prev.map((test, index) => 
        index === i ? result : test
      ));
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setTesting(false);
  };

  const getStatusIcon = (status: EndpointTest['status']) => {
    switch (status) {
      case 'pending':
        return <RefreshCw className="h-4 w-4 animate-spin text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: EndpointTest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Testing...</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>CMS Endpoints Test</span>
          <Button 
            onClick={runAllTests} 
            disabled={testing}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${testing ? 'animate-spin' : ''}`} />
            {testing ? 'Testing...' : 'Run Tests'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Success: {successCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm">Errors: {errorCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">Total: {tests.length}</span>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-2">
          {tests.map((test, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <div className="font-medium">{test.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {test.method} {test.endpoint}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {test.responseTime && (
                  <span className="text-xs text-muted-foreground">
                    {test.responseTime}ms
                  </span>
                )}
                {getStatusBadge(test.status)}
              </div>
            </div>
          ))}
        </div>

        {/* Error Details */}
        {tests.some(t => t.status === 'error' && t.message) && (
          <div className="space-y-2">
            <h4 className="font-medium">Error Details:</h4>
            {tests
              .filter(t => t.status === 'error' && t.message)
              .map((test, index) => (
                <div 
                  key={index}
                  className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800"
                >
                  <div className="font-medium text-red-800 dark:text-red-200">
                    {test.name}
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-300">
                    {test.message}
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
