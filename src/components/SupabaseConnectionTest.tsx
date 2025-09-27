import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, RefreshCw, Database, AlertCircle } from 'lucide-react';


export function SupabaseConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected' | 'error'>('checking');
  const [projectInfo, setProjectInfo] = useState<any>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [errorDetails, setErrorDetails] = useState<string>('');

  const checkConnection = async () => {
    setConnectionStatus('checking');
    setErrorDetails('');
    
    try {
      // Import Supabase info
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      // Check if we have basic connection info
      if (!projectId || !publicAnonKey) {
        setConnectionStatus('disconnected');
        setErrorDetails('Missing Supabase project configuration');
        setLastCheck(new Date());
        return;
      }

      // Try to get project info
      const response = await fetch(`https://${projectId}.supabase.co/rest/v1/`, {
        headers: {
          'apikey': publicAnonKey,
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        setConnectionStatus('connected');
        setProjectInfo({
          projectId,
          url: `https://${projectId}.supabase.co`,
          hasAuth: true,
          hasStorage: true,
          hasRealtime: true
        });
      } else {
        setConnectionStatus('error');
        setErrorDetails(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      setConnectionStatus('error');
      setErrorDetails(error instanceof Error ? error.message : 'Unknown error');
    }
    
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusInfo = () => {
    switch (connectionStatus) {
      case 'checking':
        return {
          icon: <RefreshCw className="h-4 w-4 animate-spin" />,
          color: 'bg-yellow-500',
          text: 'Checking...',
          variant: 'secondary' as const
        };
      case 'connected':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: 'bg-green-500',
          text: 'Connected',
          variant: 'default' as const
        };
      case 'disconnected':
        return {
          icon: <XCircle className="h-4 w-4" />,
          color: 'bg-gray-500',
          text: 'Not Configured',
          variant: 'secondary' as const
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          color: 'bg-red-500',
          text: 'Connection Error',
          variant: 'destructive' as const
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Supabase Connection
          <div className={`w-2 h-2 rounded-full ${statusInfo.color}`} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {statusInfo.icon}
          <Badge variant={statusInfo.variant}>
            {statusInfo.text}
          </Badge>
        </div>
        
        {projectInfo && (
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Project ID:</span> {projectInfo.projectId}
            </div>
            <div className="text-sm">
              <span className="font-medium">URL:</span> {projectInfo.url}
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">Auth</Badge>
              <Badge variant="outline" className="text-xs">Database</Badge>
              <Badge variant="outline" className="text-xs">Storage</Badge>
              <Badge variant="outline" className="text-xs">Edge Functions</Badge>
            </div>
          </div>
        )}
        
        {lastCheck && (
          <p className="text-sm text-muted-foreground">
            Last checked: {lastCheck.toLocaleString()}
          </p>
        )}
        
        {errorDetails && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>Error:</strong> {errorDetails}
            </p>
          </div>
        )}

        {connectionStatus === 'disconnected' && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              <strong>Need to connect Supabase?</strong>
            </p>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                // This would trigger the Supabase connect modal
                console.log('Connect Supabase clicked');
              }}
            >
              Connect Supabase Project
            </Button>
          </div>
        )}
        
        <Button 
          onClick={checkConnection} 
          disabled={connectionStatus === 'checking'}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${connectionStatus === 'checking' ? 'animate-spin' : ''}`} />
          Refresh Connection
        </Button>
      </CardContent>
    </Card>
  );
}
