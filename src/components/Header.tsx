"use client"

import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Menu, X, Settings, User, LogOut, BookOpen, Shield, Crown, GraduationCap, UserCheck } from "lucide-react"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { AuthModal } from "./AuthModal"
import { NotificationPanel } from "./NotificationPanel"
import { ThemeToggle } from "./ThemeToggle"
import { useAuth } from "../contexts/AuthContext"
import { ROLE_CONFIGS, PERMISSIONS } from "../types/roles"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback } from "./ui/avatar"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut, loading, userRole, hasPermission, canAccessDashboard } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const getUserDisplayName = () => {
    if (user?.user_metadata?.fullName) {
      return user.user_metadata.fullName
    }
    return user?.email?.split("@")[0] || "User"
  }

  const getUserInitials = () => {
    const name = getUserDisplayName()
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleIcon = () => {
    switch (userRole) {
      case "admin":
        return <Crown className="w-3 h-3" />
      case "teacher":
        return <GraduationCap className="w-3 h-3" />
      case "student":
        return <UserCheck className="w-3 h-3" />
      default:
        return <User className="w-3 h-3" />
    }
  }

  const getRoleBadgeVariant = () => {
    switch (userRole) {
      case "admin":
        return "destructive"
      case "teacher":
        return "default"
      case "student":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer group" onClick={() => navigate("/")}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-white font-bold text-lg transition-transform group-hover:scale-105">
                桜
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  日本語センター
                </h1>
                <span className="text-sm text-muted-foreground">Quang Dũng Academy</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            <button
              onClick={() => navigate("/")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === "/"
                  ? "text-primary bg-primary/10 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Trang chủ
            </button>
            <button
              onClick={() => navigate("/courses")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === "/courses"
                  ? "text-primary bg-primary/10 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Khóa học
            </button>
            <button
              onClick={() => navigate("/blog")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === "/blog"
                  ? "text-primary bg-primary/10 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Blog
            </button>
            <button
              onClick={() => navigate("/about")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === "/about"
                  ? "text-primary bg-primary/10 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Giới thiệu
            </button>
            <button
              onClick={() => navigate("/contact")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === "/contact"
                  ? "text-primary bg-primary/10 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Liên hệ
            </button>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {user && <NotificationPanel />}

            {/* Role-based navigation buttons */}
            {user && canAccessDashboard("admin") && (
              <Button variant="outline" onClick={() => navigate("/admin")}>
                <Shield className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
            )}

            {user && canAccessDashboard("student") && (
              <Button variant="outline" onClick={() => navigate("/student")}>
                <BookOpen className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            )}

            {loading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{getUserDisplayName()}</p>
                        <Badge variant={getRoleBadgeVariant()} className="text-xs">
                          {getRoleIcon()}
                          <span className="ml-1">{ROLE_CONFIGS[userRole].displayName}</span>
                        </Badge>
                      </div>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />

                  {/* Dashboard Access based on role */}
                  {canAccessDashboard("student") && (
                    <DropdownMenuItem onClick={() => navigate("/student")}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Dashboard {userRole === "student" ? "học viên" : ""}</span>
                    </DropdownMenuItem>
                  )}

                  {canAccessDashboard("admin") && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  {/* User Profile */}
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Thông tin cá nhân</span>
                  </DropdownMenuItem>

                  {hasPermission(PERMISSIONS.SETTINGS.VIEW) && (
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Cài đặt</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AuthModal>
                <Button>Đăng nhập</Button>
              </AuthModal>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-foreground hover:text-primary">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  navigate("/")
                  setIsMenuOpen(false)
                }}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Trang chủ
              </button>
              <button
                onClick={() => {
                  navigate("/courses")
                  setIsMenuOpen(false)
                }}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Khóa học
              </button>
              <button
                onClick={() => {
                  navigate("/blog")
                  setIsMenuOpen(false)
                }}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Blog
              </button>
              <button
                onClick={() => {
                  navigate("/about")
                  setIsMenuOpen(false)
                }}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Giới thiệu
              </button>
              <button
                onClick={() => {
                  navigate("/contact")
                  setIsMenuOpen(false)
                }}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Liên hệ
              </button>

              <div className="flex items-center gap-2 py-2">
                <span className="text-sm text-muted-foreground">Giao diện:</span>
                <ThemeToggle showTooltip={false} />
              </div>

              {loading ? (
                <div className="w-20 h-8 rounded bg-muted animate-pulse" />
              ) : user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Xin chào, {getUserDisplayName()}</span>
                    <Badge variant={getRoleBadgeVariant()} className="text-xs">
                      {getRoleIcon()}
                      <span className="ml-1">{ROLE_CONFIGS[userRole].displayName}</span>
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-2">
                    {canAccessDashboard("student") && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigate("/student")
                          setIsMenuOpen(false)
                        }}
                        size="sm"
                        className="w-fit"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    )}

                    {canAccessDashboard("admin") && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigate("/admin")
                          setIsMenuOpen(false)
                        }}
                        size="sm"
                        className="w-fit"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Button>
                    )}

                    <Button variant="outline" onClick={handleSignOut} size="sm" className="w-fit bg-transparent">
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </Button>
                  </div>
                </div>
              ) : (
                <AuthModal>
                  <Button className="w-fit">Đăng nhập</Button>
                </AuthModal>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
