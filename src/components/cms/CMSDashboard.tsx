import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  FileText, 
  Image as ImageIcon, 
  Settings, 
  BarChart3,
  Plus,
  Eye,
  Edit,
  Calendar,
  Users,
  TrendingUp,
  Activity,
  Server
} from 'lucide-react';
import { useCMS } from '../../contexts/CMSContext';
import { PagesList } from './PagesList';
import { PageEditor } from './PageEditor';
import { MediaLibrary } from './MediaLibrary';
import { SiteSettings } from './SiteSettings';
import { ServerStatus } from '../ServerStatus';
import { CMSEndpointTest } from '../CMSEndpointTest';
import { SupabaseConnectionTest } from '../SupabaseConnectionTest';
import { EdgeFunctionStatus } from '../EdgeFunctionStatus';
import { CMSModeIndicator } from '../CMSModeIndicator';

export function CMSDashboard() {
  const { pages, media, analytics, loading } = useCMS();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [creatingPage, setCreatingPage] = useState(false);

  const handleEditPage = (pageId: string) => {
    setEditingPageId(pageId);
    setActiveTab('pages');
  };

  const handleCreatePage = () => {
    setCreatingPage(true);
    setActiveTab('pages');
  };

  const handlePageSave = () => {
    setEditingPageId(null);
    setCreatingPage(false);
  };

  const handlePageCancel = () => {
    setEditingPageId(null);
    setCreatingPage(false);
  };

  // Calculate stats
  const totalPages = pages.filter(p => p.pageType === 'page').length;
  const totalPosts = pages.filter(p => p.pageType === 'post').length;
  const publishedContent = pages.filter(p => p.status === 'published').length;
  const draftContent = pages.filter(p => p.status === 'draft').length;
  const totalMedia = media.length;

  // Recent activity
  const recentPages = pages
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  if (editingPageId || creatingPage) {
    return (
      <PageEditor
        pageId={editingPageId || undefined}
        onSave={handlePageSave}
        onCancel={handlePageCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">
            Manage your website content, media, and settings
          </p>
        </div>
        <Button onClick={handleCreatePage} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Content
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Pages & Posts
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Media Library
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Site Settings
          </TabsTrigger>
          <TabsTrigger value="server" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Server Status
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* CMS Mode Alert */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-200">
                  CMS System Status
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  CMS is currently running in offline mode with local browser storage. All your content is saved locally and will persist between sessions.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
                <FileText className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPages}</div>
                <p className="text-xs text-muted-foreground">
                  Static content pages
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                <FileText className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPosts}</div>
                <p className="text-xs text-muted-foreground">
                  News and articles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <Eye className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{publishedContent}</div>
                <p className="text-xs text-muted-foreground">
                  Live content
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Media Files</CardTitle>
                <ImageIcon className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMedia}</div>
                <p className="text-xs text-muted-foreground">
                  Images and documents
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Status */}
            <Card>
              <CardHeader>
                <CardTitle>Content Status</CardTitle>
                <CardDescription>Overview of your content by status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Published</span>
                  </div>
                  <span className="font-medium">{publishedContent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Draft</span>
                  </div>
                  <span className="font-medium">{draftContent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span>Archived</span>
                  </div>
                  <span className="font-medium">
                    {pages.filter(p => p.status === 'archived').length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest content updates</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : recentPages.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentPages.map((page) => (
                      <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{page.title}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(page.updatedAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="capitalize">{page.status}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPage(page.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common content management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={handleCreatePage} className="flex items-center gap-2 h-16">
                  <Plus className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Create New Page</div>
                    <div className="text-sm text-muted-foreground">Add static content</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('media')}
                  className="flex items-center gap-2 h-16"
                >
                  <ImageIcon className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Upload Media</div>
                    <div className="text-sm text-muted-foreground">Add images & files</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('settings')}
                  className="flex items-center gap-2 h-16"
                >
                  <Settings className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Site Settings</div>
                    <div className="text-sm text-muted-foreground">Configure website</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          {analytics && (
            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
                <CardDescription>Top performing content</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.popularPages.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No analytics data available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analytics.popularPages.slice(0, 5).map((item, index) => (
                      <div key={item.pageId} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <span className="font-medium">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          <span>{item.views} views</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Pages & Posts Tab */}
        <TabsContent value="pages">
          <PagesList
            onEdit={handleEditPage}
            onCreate={handleCreatePage}
          />
        </TabsContent>

        {/* Media Library Tab */}
        <TabsContent value="media">
          <MediaLibrary />
        </TabsContent>

        {/* Site Settings Tab */}
        <TabsContent value="settings">
          <SiteSettings />
        </TabsContent>

        {/* Server Status Tab */}
        <TabsContent value="server">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Server Status</h2>
              <p className="text-muted-foreground">
                Check server connection and troubleshoot CMS API issues
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <ServerStatus />
                <SupabaseConnectionTest />
                <EdgeFunctionStatus />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CMSModeIndicator />
                <CMSEndpointTest />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
