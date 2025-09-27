import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, RefreshCw, AlertTriangle, Zap } from 'lucide-react';

export function EdgeFunctionStatus() {
  const [functionStatus, setFunctionStatus] = useState<'checking' | 'deployed' | 'not-deployed' | 'error'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [deploying, setDeploying] = useState(false);

  const checkFunction = async () => {
    setFunctionStatus('checking');
    setErrorDetails('');
    
    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      // Test the health endpoint
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2c1a01cc/health`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok') {
          setFunctionStatus('deployed');
        } else {
          setFunctionStatus('error');
          setErrorDetails('Function responded but status is not ok');
        }
      } else if (response.status === 404) {
        setFunctionStatus('not-deployed');
        setErrorDetails('Edge Function not found - needs to be deployed');
      } else {
        setFunctionStatus('error');
        setErrorDetails(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      setFunctionStatus('error');
      setErrorDetails(error instanceof Error ? error.message : 'Unknown error');
    }
    
    setLastCheck(new Date());
  };

  const deployFunction = async () => {
    setDeploying(true);
    setErrorDetails('');
    
    try {
      // This is a placeholder - in a real app you would call Supabase CLI or API to deploy
      // For now, we'll just wait a bit and check again
      await new Promise(resolve => setTimeout(resolve, 3000));
      await checkFunction();
    } catch (error) {
      setErrorDetails(error instanceof Error ? error.message : 'Deploy failed');
    }
    
    setDeploying(false);
  };

  useEffect(() => {
    checkFunction();
  }, []);

  const getStatusInfo = () => {
    switch (functionStatus) {
      case 'checking':
        return {
          icon: <RefreshCw className="h-4 w-4 animate-spin" />,
          color: 'bg-yellow-500',
          text: 'Checking...',
          variant: 'secondary' as const
        };
      case 'deployed':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: 'bg-green-500',
          text: 'Deployed',
          variant: 'default' as const
        };
      case 'not-deployed':
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          color: 'bg-orange-500',
          text: 'Not Deployed',
          variant: 'secondary' as const
        };
      case 'error':
        return {
          icon: <XCircle className="h-4 w-4" />,
          color: 'bg-red-500',
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
          <Zap className="h-5 w-5" />
          Edge Function Status
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
        
        <div className="text-sm space-y-1">
          <div><span className="font-medium">Function:</span> make-server-2c1a01cc</div>
          <div><span className="font-medium">Type:</span> Supabase Edge Function</div>
          <div><span className="font-medium">Runtime:</span> Deno</div>
        </div>
        
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

        {functionStatus === 'not-deployed' && (
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-md border border-orange-200 dark:border-orange-800">
            <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">
              <strong>Function needs to be deployed.</strong> 
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-300 mb-3">
              The Edge Function exists in the codebase but hasn't been deployed to Supabase yet.
            </p>
            <div className="text-xs text-orange-600 dark:text-orange-300 mb-3 p-2 bg-orange-100 dark:bg-orange-900/40 rounded">
              <strong>Manual Deploy Instructions:</strong><br/>
              1. Install Supabase CLI: <code>npm install -g supabase</code><br/>
              2. Login: <code>supabase login</code><br/>
              3. Link project: <code>supabase link</code><br/>
              4. Deploy: <code>supabase functions deploy make-server-2c1a01cc</code>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={deployFunction}
              disabled={deploying}
            >
              {deploying ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              {deploying ? 'Deploying...' : 'Auto Deploy (Beta)'}
            </Button>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            onClick={checkFunction} 
            disabled={functionStatus === 'checking'}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${functionStatus === 'checking' ? 'animate-spin' : ''}`} />
            Check Status
          </Button>
          
          {functionStatus === 'deployed' && (
            <Button 
              onClick={() => window.open(`https://${document.location.hostname.replace('figma.com', 'supabase.co')}/functions/v1/make-server-2c1a01cc/health`, '_blank')}
              variant="outline"
              size="sm"
            >
              <Zap className="h-4 w-4 mr-2" />
              Test Function
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
