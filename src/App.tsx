import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { QuizProvider } from './contexts/QuizContext';
import { CMSProvider } from './contexts/CMSContext';
import { Router } from './components/Router';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="Quang Dũng-ui-theme">
      <AuthProvider>
        <NotificationProvider>
          <QuizProvider>
            <CMSProvider>
              <Router />
              <Toaster />
            </CMSProvider>
          </QuizProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
