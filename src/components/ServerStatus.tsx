import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, RefreshCw, AlertCircle } from 'lucide-react';

export function ServerStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline' | 'error'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [errorDetails, setErrorDetails] = useState<string>('');

  const checkServerStatus = async () => {
    setStatus('checking');
    setErrorDetails('');
    
    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      // Test health endpoint
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2c1a01cc/health`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok') {
          setStatus('online');
        } else {
          setStatus('error');
          setErrorDetails('Server responded but status is not ok');
        }
      } else {
        setStatus('offline');
        setErrorDetails(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      setStatus('error');
      setErrorDetails(error instanceof Error ? error.message : 'Unknown error');
    }
    
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkServerStatus();
  }, []);

  const getStatusInfo = () => {
    switch (status) {
      case 'checking':
        return {
          icon: <RefreshCw className="h-4 w-4 animate-spin" />,
          color: 'bg-yellow-500',
          text: 'Checking...',
          variant: 'secondary' as const
        };
      case 'online':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: 'bg-green-500',
          text: 'Online',
          variant: 'default' as const
        };
      case 'offline':
        return {
          icon: <XCircle className="h-4 w-4" />,
          color: 'bg-red-500',
          text: 'Offline',
          variant: 'destructive' as const
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          color: 'bg-orange-500',
          text: 'Error',
          variant: 'destructive' as const
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Server Status
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
        
        {lastCheck && (
          <p className="text-sm text-muted-foreground">
            Last checked: {lastCheck.toLocaleString()}
          </p>
        )}
        
        {errorDetails && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>Error details:</strong> {errorDetails}
            </p>
          </div>
        )}
        
        <Button 
          onClick={checkServerStatus} 
          disabled={status === 'checking'}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${status === 'checking' ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </CardContent>
    </Card>
  );
}
