import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Cloud, HardDrive, RefreshCw, AlertCircle } from 'lucide-react';
import { useCMS } from '../contexts/CMSContext';

interface CMSModeIndicatorProps {
  useMockService?: boolean;
  onToggleMode?: () => void;
}

export function CMSModeIndicator({ onToggleMode }: CMSModeIndicatorProps) {
  const { loadPages, loadMedia, loadMenus, loadSettings, loadAnalytics, useMockService } = useCMS();

  const refreshAllData = async () => {
    try {
      await Promise.all([
        loadPages(),
        loadMedia(),
        loadMenus(),
        loadSettings(),
        loadAnalytics()
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {useMockService ? (
            <HardDrive className="h-5 w-5 text-orange-500" />
          ) : (
            <Cloud className="h-5 w-5 text-blue-500" />
          )}
          CMS Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {useMockService ? (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200">
              <HardDrive className="h-3 w-3 mr-1" />
              Offline Mode
            </Badge>
          ) : (
            <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
              <Cloud className="h-3 w-3 mr-1" />
              Online Mode
            </Badge>
          )}
        </div>

        <div className="text-sm space-y-2">
          {useMockService ? (
            <>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-md border border-orange-200 dark:border-orange-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-orange-800 dark:text-orange-200">Offline Mode Active</p>
                    <p className="text-orange-600 dark:text-orange-300 text-xs mt-1">
                      CMS data is stored locally. Changes won't sync to server until online mode is restored.
                    </p>
                  </div>
                </div>
              </div>
              <ul className="text-muted-foreground space-y-1">
                <li>• Data stored in browser's localStorage</li>
                <li>• Changes persist across sessions</li>
                <li>• No server dependency</li>
                <li>• Ideal for development/testing</li>
              </ul>
            </>
          ) : (
            <>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <Cloud className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200">Online Mode Active</p>
                    <p className="text-blue-600 dark:text-blue-300 text-xs mt-1">
                      CMS data is synced with Supabase Edge Functions.
                    </p>
                  </div>
                </div>
              </div>
              <ul className="text-muted-foreground space-y-1">
                <li>• Data stored on Supabase servers</li>
                <li>• Real-time synchronization</li>
                <li>• Multi-user support</li>
                <li>• Production ready</li>
              </ul>
            </>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={refreshAllData}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          
          {onToggleMode && (
            <Button 
              onClick={onToggleMode}
              variant="outline"
              size="sm"
            >
              {useMockService ? (
                <>
                  <Cloud className="h-4 w-4 mr-2" />
                  Try Online
                </>
              ) : (
                <>
                  <HardDrive className="h-4 w-4 mr-2" />
                  Use Offline
                </>
              )}
            </Button>
          )}
        </div>

        {useMockService && (
          <div className="text-xs text-muted-foreground">
            <strong>Note:</strong> To enable online mode, ensure the Supabase Edge Function is deployed and accessible.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
