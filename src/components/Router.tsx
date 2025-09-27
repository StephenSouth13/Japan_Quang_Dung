"use client"

import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { Header } from "./Header"
import { Footer } from "./Footer"
import { BackToTop } from "./BackToTop"
import { HomePage } from "../pages/HomePage"
import { AdminPage } from "../pages/AdminPage"
import { StudentPage } from "../pages/StudentPage"
import { CoursesPage } from "../pages/CoursesPage"
import { BlogPage } from "../pages/BlogPage"
import { AboutPage } from "../pages/AboutPage"
import { ContactPage } from "../pages/ContactPage"
import { DebugPage } from "../pages/DebugPage"
import { ProtectedRoute } from "./ProtectedRoute"
import { ResetPasswordPage } from "./ResetPasswordPage"
import { useAuth } from "../contexts/AuthContext"

function AppContent() {
  const { loading } = useAuth()
  const location = useLocation()

  // Don't show footer on dashboard pages and reset password page
  const isDashboardPage = ["/admin", "/student"].includes(location.pathname)
  const isResetPasswordPage = location.pathname === "/reset-password"

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/debug" element={<DebugPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isDashboardPage && !isResetPasswordPage && <Footer />}
      <BackToTop />
    </div>
  )
}

export function Router() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
