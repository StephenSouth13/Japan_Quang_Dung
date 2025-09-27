import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Save, 
  Settings, 
  Globe, 
  Search, 
  Mail,
  Palette,
  Shield,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';
import { useCMS, CMSSettings } from '../../contexts/CMSContext';

export function SiteSettings() {
  const { settings, updateSettings, loading } = useCMS();
  
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<CMSSettings>>({
    siteName: '',
    siteDescription: '',
    siteUrl: '',
    logo: '',
    favicon: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    socialLinks: {
      facebook: '',
      youtube: '',
      instagram: '',
      twitter: '',
    },
    seoSettings: {
      defaultTitle: '',
      defaultDescription: '',
      keywords: [],
      googleAnalytics: '',
      googleTagManager: '',
    },
    emailSettings: {
      fromName: '',
      fromEmail: '',
      replyTo: '',
    },
    themeSettings: {
      primaryColor: '#dc2626',
      secondaryColor: '#fef2f2',
      accentColor: '#fee2e2',
      fontFamily: 'Inter',
    },
  });

  // Load settings
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(formData);
    } catch (error) {
      console.error('Save settings error:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateFormData = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof CMSSettings],
        [field]: value
      }
    }));
  };

  const handleKeywordAdd = (keyword: string) => {
    if (keyword && !formData.seoSettings?.keywords?.includes(keyword)) {
      updateFormData('seoSettings', 'keywords', [
        ...(formData.seoSettings?.keywords || []),
        keyword
      ]);
    }
  };

  const handleKeywordRemove = (keyword: string) => {
    updateFormData('seoSettings', 'keywords',
      formData.seoSettings?.keywords?.filter(k => k !== keyword) || []
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Site Settings</h2>
          <p className="text-muted-foreground">
            Configure your website's global settings
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Theme
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Email
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>
                Basic information about your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name *</Label>
                  <Input
                    id="siteName"
                    value={formData.siteName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
                    placeholder="Quang Dũng Japanese Center"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    type="url"
                    value={formData.siteUrl || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, siteUrl: e.target.value }))}
                    placeholder="https://Quang Dũng-center.vn"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={formData.siteDescription || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, siteDescription: e.target.value }))}
                  placeholder="Brief description of your website"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    type="url"
                    value={formData.logo || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <Input
                    id="favicon"
                    type="url"
                    value={formData.favicon || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, favicon: e.target.value }))}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Connect your social media accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    type="url"
                    value={formData.socialLinks?.facebook || ''}
                    onChange={(e) => updateFormData('socialLinks', 'facebook', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    type="url"
                    value={formData.socialLinks?.youtube || ''}
                    onChange={(e) => updateFormData('socialLinks', 'youtube', e.target.value)}
                    placeholder="https://youtube.com/yourchannel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    type="url"
                    value={formData.socialLinks?.instagram || ''}
                    onChange={(e) => updateFormData('socialLinks', 'instagram', e.target.value)}
                    placeholder="https://instagram.com/youraccount"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    type="url"
                    value={formData.socialLinks?.twitter || ''}
                    onChange={(e) => updateFormData('socialLinks', 'twitter', e.target.value)}
                    placeholder="https://twitter.com/youraccount"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Default SEO Settings</CardTitle>
              <CardDescription>
                Set default SEO values for your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultTitle">Default Title</Label>
                <Input
                  id="defaultTitle"
                  value={formData.seoSettings?.defaultTitle || ''}
                  onChange={(e) => updateFormData('seoSettings', 'defaultTitle', e.target.value)}
                  placeholder="Quang Dũng Japanese Center - Learn Japanese Online"
                  maxLength={60}
                />
                <p className="text-sm text-muted-foreground">
                  {(formData.seoSettings?.defaultTitle || '').length}/60 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultDescription">Default Description</Label>
                <Textarea
                  id="defaultDescription"
                  value={formData.seoSettings?.defaultDescription || ''}
                  onChange={(e) => updateFormData('seoSettings', 'defaultDescription', e.target.value)}
                  placeholder="Learn Japanese with our expert teachers. Online courses, tests, and more."
                  rows={3}
                  maxLength={160}
                />
                <p className="text-sm text-muted-foreground">
                  {(formData.seoSettings?.defaultDescription || '').length}/160 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label>Keywords</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.seoSettings?.keywords?.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm cursor-pointer"
                      onClick={() => handleKeywordRemove(keyword)}
                    >
                      {keyword} ×
                    </span>
                  ))}
                </div>
                <Input
                  placeholder="Add keyword and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleKeywordAdd(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Connect your analytics services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                <Input
                  id="googleAnalytics"
                  value={formData.seoSettings?.googleAnalytics || ''}
                  onChange={(e) => updateFormData('seoSettings', 'googleAnalytics', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleTagManager">Google Tag Manager ID</Label>
                <Input
                  id="googleTagManager"
                  value={formData.seoSettings?.googleTagManager || ''}
                  onChange={(e) => updateFormData('seoSettings', 'googleTagManager', e.target.value)}
                  placeholder="GTM-XXXXXXX"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Set your business contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  placeholder="info@Quang Dũng-center.vn"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  placeholder="(028) 3825 1234"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactAddress">Address</Label>
                <Textarea
                  id="contactAddress"
                  value={formData.contactAddress || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactAddress: e.target.value }))}
                  placeholder="123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Settings */}
        <TabsContent value="theme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
              <CardDescription>
                Customize your website's appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={formData.themeSettings?.primaryColor || '#dc2626'}
                      onChange={(e) => updateFormData('themeSettings', 'primaryColor', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={formData.themeSettings?.primaryColor || '#dc2626'}
                      onChange={(e) => updateFormData('themeSettings', 'primaryColor', e.target.value)}
                      placeholder="#dc2626"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={formData.themeSettings?.secondaryColor || '#fef2f2'}
                      onChange={(e) => updateFormData('themeSettings', 'secondaryColor', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={formData.themeSettings?.secondaryColor || '#fef2f2'}
                      onChange={(e) => updateFormData('themeSettings', 'secondaryColor', e.target.value)}
                      placeholder="#fef2f2"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={formData.themeSettings?.accentColor || '#fee2e2'}
                      onChange={(e) => updateFormData('themeSettings', 'accentColor', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={formData.themeSettings?.accentColor || '#fee2e2'}
                      onChange={(e) => updateFormData('themeSettings', 'accentColor', e.target.value)}
                      placeholder="#fee2e2"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <Input
                  id="fontFamily"
                  value={formData.themeSettings?.fontFamily || 'Inter'}
                  onChange={(e) => updateFormData('themeSettings', 'fontFamily', e.target.value)}
                  placeholder="Inter, system-ui, sans-serif"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Configure email sending settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fromName">From Name</Label>
                <Input
                  id="fromName"
                  value={formData.emailSettings?.fromName || ''}
                  onChange={(e) => updateFormData('emailSettings', 'fromName', e.target.value)}
                  placeholder="Quang Dũng Japanese Center"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromEmail">From Email</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={formData.emailSettings?.fromEmail || ''}
                  onChange={(e) => updateFormData('emailSettings', 'fromEmail', e.target.value)}
                  placeholder="noreply@Quang Dũng-center.vn"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="replyTo">Reply-To Email</Label>
                <Input
                  id="replyTo"
                  type="email"
                  value={formData.emailSettings?.replyTo || ''}
                  onChange={(e) => updateFormData('emailSettings', 'replyTo', e.target.value)}
                  placeholder="support@Quang Dũng-center.vn"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
