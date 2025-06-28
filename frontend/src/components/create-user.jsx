"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle, CheckCircle, UserPlus, ArrowLeft } from "lucide-react"
import { useUserStore } from "@/store/user-store"
import NavigationHeader from "@/components/header"
import api from "@/hooks/axios"
import { createUserUrl } from "@/constants/urls"

export default function CreateUserPage({ onNavigate, isDarkMode, onToggleTheme }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { user } = useUserStore() 

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      setIsLoading(true)
      setError("")
      setSuccess("")
  
      if (!formData.name || !formData.email || !formData.password || !formData.role) {
        setError("All fields are required")
        setIsLoading(false)
        return
      }
  
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long")
        setIsLoading(false)
        return
      }
  
      const res = await api.post(createUserUrl, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })

      if(res.status === 201) {
        setSuccess("User created successfully!")
        setFormData({ name: "", email: "", password: "", role: "" })
        setTimeout(() => {
          onNavigate("user-management")
        }, 2000)
      }else {
        setError("Failed to create user")
      }

    } catch (error) {
      console.log(error)
      setError( error?.response?.data?.msg ||"Failed to create user")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Determine available roles based on current user's role
  const getAvailableRoles = () => {
    if (user?.role === "superadmin") {
      return [
        { value: "admin", label: "Admin" },
        { value: "warehouse", label: "Warehouse" },
        { value: "logistics", label: "Logistics" },
      ]
    } else if (user?.role === "admin") {
      return [
        { value: "warehouse", label: "Warehouse" },
        { value: "logistics", label: "Logistics" },
      ]
    }
    return []
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <NavigationHeader
        currentPage="create-user"
        onNavigate={onNavigate}
      />

      <main className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("user-management")}
                className="p-2 h-auto hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create New User</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                  Add a new user to the MCaffeine CMS system
                </p>
              </div>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">User Information</CardTitle>
                  <CardDescription>Enter the details for the new user account</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                        className="h-11 pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">
                      Role
                    </Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableRoles().map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Role Permissions:</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="font-medium min-w-[80px]">Admin:</span>
                      <span>Can manage users, view all data, and perform administrative tasks</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-medium min-w-[80px]">Warehouse:</span>
                      <span>Can manage warehouse operations and inventory</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-medium min-w-[80px]">Logistics:</span>
                      <span>Can manage shipping and logistics operations</span>
                    </li>
                  </ul>
                </div>

                <div className="flex space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onNavigate("user-management")}
                    className="flex-1 h-11"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating User..." : "Create User"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
