"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, LogOut, Database, Lock, UserPlus, Users, User, Home, Settings } from "lucide-react"
import { useUserStore } from "@/store/user-store"
import { useThemeStore } from "@/store/theme-store"
import { ThemeToggle } from "@/provider/toggle-theme"


export default function NavigationHeader({
  currentPage,
  onNavigate,
}) {

  const {isDarkMode, setIsDarkMode} = useThemeStore()

  const { user, logout } = useUserStore()

  const handleLogout = () => {
    // localStorage.clearItem("mcaffeine_user")
    // localStorage.setItem("page", "login")
    logout()
    onNavigate("login")
  }

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    ...(user?.role === "superadmin" || user?.role === "admin"
      ? [
          { id: "user-management", label: "User Management", icon: Users },
          { id: "create-user", label: "Create User", icon: UserPlus },
          { id: "create-order", label: "Create Order", icon: Database },
        ]
      : []),
    { id: "user-settings", label: "Settings", icon: Settings },
  ]

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "superadmin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "warehouse":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "logistics":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  if (!user) return null

  return (
    <header className={`border-b bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50`}>
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <Database className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">MCaffeine CMS</h1>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onNavigate(item.id)}
                  className={
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  }
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {/* User Role Badge */}
          {user.role && (
            <Badge className={getRoleBadgeColor(user.role)}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          )}

          {/* Theme Toggle */}
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => {isDarkMode === "dark" ? setIsDarkMode("light") : setIsDarkMode("dark")}}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button> */}

          <ThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                 <AvatarImage><User className="h-4 w-4" /></AvatarImage>
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Mobile Navigation Items */}
              <div className="md:hidden">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <DropdownMenuItem key={item.id} onClick={() => onNavigate(item.id)}>
                      <Icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                  )
                })}
                <DropdownMenuSeparator />
              </div>

              <DropdownMenuItem onClick={() => onNavigate("user-settings")}>
                <Lock className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
