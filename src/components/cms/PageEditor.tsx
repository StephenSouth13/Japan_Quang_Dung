import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Save, 
  Eye, 
  FileText, 
  Image as ImageIcon, 
  Settings, 
  Tag,
  Calendar,
  User,
  Globe,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import { useCMS, CMSPage } from '../../contexts/CMSContext';
import { useAuth } from '../../contexts/AuthContext';

interface PageEditorProps {
  pageId?: string;
  onSave?: (page: CMSPage) => void;
  onCancel?: () => void;
}

export function PageEditor({ pageId, onSave, onCancel }: PageEditorProps) {
  const { user } = useAuth();
  const { createPage, updatePage, getPage } = useCMS();
  
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<Partial<CMSPage>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft',
    pageType: 'page',
    seoTitle: '',
    seoDescription: '',
    featuredImage: '',
    categories: [],
    tags: [],
    author: user?.email || '',
  });

  const [activeTab, setActiveTab] = useState('content');

  // Load existing page
  useEffect(() => {
    if (pageId) {
      const existingPage = getPage(pageId);
      if (existingPage) {
        setPage(existingPage);
      }
    }
  }, [pageId, getPage]);

  // Auto-generate slug from title
  useEffect(() => {
    if (page.title && !pageId) {
      const slug = page.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setPage(prev => ({ ...prev, slug }));
    }
  }, [page.title, pageId]);

  const handleSave = async () => {
    if (!page.title || !page.content) {
      toast.error('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      if (pageId) {
        await updatePage(pageId, page);
      } else {
        const newPageId = await createPage(page as Omit<CMSPage, 'id' | 'createdAt' | 'updatedAt'>);
        const savedPage = getPage(newPageId);
        if (savedPage && onSave) {
          onSave(savedPage);
        }
      }
      toast.success(pageId ? 'Page updated successfully' : 'Page created successfully');
    } catch (error) {
      console.error('Save page error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !page.tags?.includes(tag)) {
      setPage(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
    }
  };

  const handleTagRemove = (tag: string) => {
    setPage(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const handleCategoryAdd = (category: string) => {
    if (category && !page.categories?.includes(category)) {
      setPage(prev => ({
        ...prev,
        categories: [...(prev.categories || []), category]
      }));
    }
  };

  const handleCategoryRemove = (category: string) => {
    setPage(prev => ({
      ...prev,
      categories: prev.categories?.filter(c => c !== category) || []
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {pageId ? 'Edit Page' : 'Create New Page'}
          </h1>
          <p className="text-muted-foreground">
            {pageId ? 'Edit your existing page content' : 'Create a new page for your website'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Page'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Media
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                SEO
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Page Content</CardTitle>
                  <CardDescription>
                    Create engaging content for your page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Page Title *</Label>
                    <Input
                      id="title"
                      value={page.title || ''}
                      onChange={(e) => setPage(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter page title"
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={page.slug || ''}
                      onChange={(e) => setPage(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="page-url-slug"
                    />
                    <p className="text-sm text-muted-foreground">
                      URL: /pages/{page.slug || 'page-url-slug'}
                    </p>
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={page.excerpt || ''}
                      onChange={(e) => setPage(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief description of the page content"
                      rows={3}
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={page.content || ''}
                      onChange={(e) => setPage(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your page content here..."
                      rows={15}
                      className="min-h-[400px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                  <CardDescription>
                    Set a featured image for this page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="featuredImage">Image URL</Label>
                    <Input
                      id="featuredImage"
                      value={page.featuredImage || ''}
                      onChange={(e) => setPage(prev => ({ ...prev, featuredImage: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {page.featuredImage && (
                    <div className="border rounded-lg p-4">
                      <img
                        src={page.featuredImage}
                        alt="Featured image preview"
                        className="max-w-full h-32 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>
                    Optimize your page for search engines
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* SEO Title */}
                  <div className="space-y-2">
                    <Label htmlFor="seoTitle">SEO Title</Label>
                    <Input
                      id="seoTitle"
                      value={page.seoTitle || ''}
                      onChange={(e) => setPage(prev => ({ ...prev, seoTitle: e.target.value }))}
                      placeholder={page.title || "Enter SEO title"}
                      maxLength={60}
                    />
                    <p className="text-sm text-muted-foreground">
                      {(page.seoTitle || '').length}/60 characters
                    </p>
                  </div>

                  {/* SEO Description */}
                  <div className="space-y-2">
                    <Label htmlFor="seoDescription">SEO Description</Label>
                    <Textarea
                      id="seoDescription"
                      value={page.seoDescription || ''}
                      onChange={(e) => setPage(prev => ({ ...prev, seoDescription: e.target.value }))}
                      placeholder={page.excerpt || "Enter SEO description"}
                      rows={3}
                      maxLength={160}
                    />
                    <p className="text-sm text-muted-foreground">
                      {(page.seoDescription || '').length}/160 characters
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Publish
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={page.status || 'draft'}
                  onValueChange={(value) => setPage(prev => ({ ...prev, status: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Page Type */}
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={page.pageType || 'page'}
                  onValueChange={(value) => setPage(prev => ({ ...prev, pageType: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="page">Page</SelectItem>
                    <SelectItem value="post">Post</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Author */}
              <div className="space-y-2">
                <Label>Author</Label>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user?.email || 'Unknown'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories & Tags */}
          {page.pageType === 'post' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Categories & Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Categories */}
                <div className="space-y-2">
                  <Label>Categories</Label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {page.categories?.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleCategoryRemove(category)}
                      >
                        {category} ×
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add category and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCategoryAdd(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {page.tags?.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => handleTagRemove(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add tag and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleTagAdd(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Page Info */}
          {pageId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Page Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(page.createdAt || '').toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{new Date(page.updatedAt || '').toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                    {page.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
