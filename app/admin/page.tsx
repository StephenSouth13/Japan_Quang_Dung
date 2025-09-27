"use client"

import React from 'react';
import { AdminDashboard } from "../../src/components/AdminDashboard";
import { AuthProvider } from '../../src/contexts/AuthContext';
import { ThemeProvider } from '../../src/contexts/ThemeContext';
import { NotificationProvider } from '../../src/contexts/NotificationContext';
import { QuizProvider } from '../../src/contexts/QuizContext';
import { CMSProvider } from '../../src/contexts/CMSContext';
import { Toaster } from '../../src/components/ui/sonner';

export default function AdminPage() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="Quang Dũng-ui-theme">
      <AuthProvider>
        <NotificationProvider>
          <QuizProvider>
            <CMSProvider>
              <div className="min-h-screen bg-background">
                <AdminDashboard />
                <Toaster />
              </div>
            </CMSProvider>
          </QuizProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}