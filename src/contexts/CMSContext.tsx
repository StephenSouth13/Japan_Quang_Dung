"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { showSuccess, showError, showInfo } from '../utils/toastHelper';

// Types
export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'published' | 'draft' | 'archived';
  seoTitle?: string;
  seoDescription?: string;
  featuredImage?: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  pageType: 'page' | 'post';
  categories?: string[];
  tags?: string[];
}

export interface CMSMedia {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  type: 'image' | 'document' | 'video' | 'audio';
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  alt?: string;
  caption?: string;
}

export interface CMSMenu {
  id: string;
  name: string;
  location: 'header' | 'footer' | 'sidebar';
  items: CMSMenuItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CMSMenuItem {
  id: string;
  label: string;
  url: string;
  type: 'page' | 'post' | 'external' | 'custom';
  target?: '_blank' | '_self';
  parent?: string;
  order: number;
  icon?: string;
}

export interface CMSSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logo?: string;
  favicon?: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
    twitter?: string;
  };
  seoSettings: {
    defaultTitle: string;
    defaultDescription: string;
    keywords: string[];
    googleAnalytics?: string;
    googleTagManager?: string;
  };
  emailSettings: {
    fromName: string;
    fromEmail: string;
    replyTo: string;
  };
  themeSettings: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
  };
}

export interface CMSAnalytics {
  pageViews: { [pageId: string]: number };
  popularPages: Array<{ pageId: string; title: string; views: number }>;
  recentActivity: Array<{
    id: string;
    action: string;
    target: string;
    user: string;
    timestamp: string;
  }>;
  totalPages: number;
  totalPosts: number;
  totalMedia: number;
}

interface CMSContextType {
  // Pages
  pages: CMSPage[];
  loadPages: () => Promise<void>;
  createPage: (page: Omit<CMSPage, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updatePage: (id: string, updates: Partial<CMSPage>) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  getPage: (id: string) => CMSPage | undefined;
  getPageBySlug: (slug: string) => CMSPage | undefined;

  // Media
  media: CMSMedia[];
  loadMedia: () => Promise<void>;
  uploadMedia: (file: File) => Promise<CMSMedia>;
  deleteMedia: (id: string) => Promise<void>;

  // Menus
  menus: CMSMenu[];
  loadMenus: () => Promise<void>;
  createMenu: (menu: Omit<CMSMenu, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateMenu: (id: string, updates: Partial<CMSMenu>) => Promise<void>;
  deleteMenu: (id: string) => Promise<void>;

  // Settings
  settings: CMSSettings | null;
  loadSettings: () => Promise<void>;
  updateSettings: (updates: Partial<CMSSettings>) => Promise<void>;

  // Analytics
  analytics: CMSAnalytics | null;
  loadAnalytics: () => Promise<void>;

  // State
  loading: boolean;
  error: string | null;
  useMockService: boolean;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

// Lazy load mock service only when needed
const getMockService = async () => {
  const { mockCMSService } = await import('../utils/mockCMSService');
  return mockCMSService;
};

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [media, setMedia] = useState<CMSMedia[]>([]);
  const [menus, setMenus] = useState<CMSMenu[]>([]);
  const [settings, setSettings] = useState<CMSSettings | null>(null);
  const [analytics, setAnalytics] = useState<CMSAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useMockService, setUseMockService] = useState(true); // Start with mock service

  // Pages management
  const loadPages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/cms/pages');
      const result = await response.json();
      setPages(result.data || []);
    } catch (error) {
      setError('Failed to load pages');
      console.error('Load pages error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPage = async (page: Omit<CMSPage, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const response = await fetch('/api/cms/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page)
      });
      const result = await response.json();
      
      await loadPages(); // Refresh list
      await showSuccess('Page created successfully');
      return result.data.id;
    } catch (error) {
      await showError('Failed to create page');
      throw error;
    }
  };

  const updatePage = async (id: string, updates: Partial<CMSPage>) => {
    try {
      await fetch(`/api/cms/pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      await loadPages(); // Refresh list
      await showSuccess('Page updated successfully');
    } catch (error) {
      await showError('Failed to update page');
      throw error;
    }
  };

  const deletePage = async (id: string) => {
    try {
      await fetch(`/api/cms/pages/${id}`, {
        method: 'DELETE'
      });
      
      await loadPages(); // Refresh list
      await showSuccess('Page deleted successfully');
    } catch (error) {
      await showError('Failed to delete page');
      throw error;
    }
  };

  const getPage = (id: string) => pages.find(page => page.id === id);
  const getPageBySlug = (slug: string) => pages.find(page => page.slug === slug);

  // Media management
  const loadMedia = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const mockService = await getMockService();
      const result = await mockService.getMedia();
      setMedia(result.data || []);
    } catch (error) {
      setError('Failed to load media');
      console.error('Load media error:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadMedia = async (file: File): Promise<CMSMedia> => {
    try {
      const mockService = await getMockService();
      const result = await mockService.uploadMedia(file);

      await loadMedia(); // Refresh list
      await showSuccess('File uploaded successfully');
      return result.data;
    } catch (error) {
      await showError('Failed to upload file');
      throw error;
    }
  };

  const deleteMedia = async (id: string) => {
    try {
      const mockService = await getMockService();
      await mockService.deleteMedia(id);
      
      await loadMedia(); // Refresh list
      await showSuccess('Media deleted successfully');
    } catch (error) {
      await showError('Failed to delete media');
      throw error;
    }
  };

  // Menu management
  const loadMenus = async () => {
    try {
      const mockService = await getMockService();
      const result = await mockService.getMenus();
      setMenus(result.data || []);
    } catch (error) {
      console.error('Load menus error:', error);
    }
  };

  const createMenu = async (menu: Omit<CMSMenu, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const mockService = await getMockService();
      await mockService.createMenu(menu);
      
      await loadMenus();
      await showSuccess('Menu created successfully');
    } catch (error) {
      await showError('Failed to create menu');
      throw error;
    }
  };

  const updateMenu = async (id: string, updates: Partial<CMSMenu>) => {
    try {
      const mockService = await getMockService();
      await mockService.updateMenu(id, updates);
      
      await loadMenus();
      await showSuccess('Menu updated successfully');
    } catch (error) {
      await showError('Failed to update menu');
      throw error;
    }
  };

  const deleteMenu = async (id: string) => {
    try {
      const mockService = await getMockService();
      await mockService.deleteMenu(id);
      
      await loadMenus();
      await showSuccess('Menu deleted successfully');
    } catch (error) {
      await showError('Failed to delete menu');
      throw error;
    }
  };

  // Settings management
  const loadSettings = async () => {
    try {
      const mockService = await getMockService();
      const result = await mockService.getSettings();
      setSettings(result.data || null);
    } catch (error) {
      console.error('Load settings error:', error);
    }
  };

  const updateSettings = async (updates: Partial<CMSSettings>) => {
    try {
      const mockService = await getMockService();
      await mockService.updateSettings(updates);
      
      await loadSettings();
      await showSuccess('Settings updated successfully');
    } catch (error) {
      await showError('Failed to update settings');
      throw error;
    }
  };

  // Analytics
  const loadAnalytics = async () => {
    try {
      const mockService = await getMockService();
      const result = await mockService.getAnalytics();
      setAnalytics(result.data || null);
    } catch (error) {
      console.error('Load analytics error:', error);
    }
  };

  // Load initial data
  useEffect(() => {
    loadPages();
    loadMedia();
    loadMenus();
    loadSettings();
    loadAnalytics();
  }, []);

  const value: CMSContextType = {
    // Pages
    pages,
    loadPages,
    createPage,
    updatePage,
    deletePage,
    getPage,
    getPageBySlug,

    // Media
    media,
    loadMedia,
    uploadMedia,
    deleteMedia,

    // Menus
    menus,
    loadMenus,
    createMenu,
    updateMenu,
    deleteMenu,

    // Settings
    settings,
    loadSettings,
    updateSettings,

    // Analytics
    analytics,
    loadAnalytics,

    // State
    loading,
    error,
    useMockService,
  };

  return (
    <CMSContext.Provider value={value}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}
