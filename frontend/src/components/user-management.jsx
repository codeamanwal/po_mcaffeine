"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Search, UserPlus, Shield, Warehouse, Truck } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import NavigationHeader from "@/components/header"


export default function UserManagementPage({ onNavigate, isDarkMode, onToggleTheme }) {
  const [searchTerm, setSearchTerm] = useState("")
  const { getAllUsers } = useAuth()
  const users = getAllUsers()

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getUsersByRole = (role) => {
    return filteredUsers.filter((user) => user.role === role)
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "superadmin":
      case "admin":
        return <Shield className="h-4 w-4" />
      case "warehouse":
        return <Warehouse className="h-4 w-4" />
      case "logistics":
        return <Truck className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

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

  const UserTable = ({ users, title }) => (
    <Card className="shadow-lg">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center justify-between text-xl">
          <div className="flex items-center space-x-3">
            {getRoleIcon(users[0]?.role || "")}
            <span>{title}</span>
          </div>
          <Badge
            variant="secondary"
            className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 text-sm px-3 py-1"
          >
            {users.length} Users
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No users found in this category</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Role</TableHead>
                <TableHead className="font-semibold">Created</TableHead>
                <TableHead className="font-semibold">Last Login</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>{user.lastLogin || "Never"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      Active
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <NavigationHeader
        currentPage="user-management"
        onNavigate={onNavigate}
      />

      <main className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">User Management</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Manage system users and their roles</p>
          </div>
          <Button
            onClick={() => onNavigate("create-user")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-11 px-6"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Create User
          </Button>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 h-12">
            <TabsTrigger value="all" className="text-base">
              All Users ({filteredUsers.length})
            </TabsTrigger>
            <TabsTrigger value="admins" className="text-base">
              Admins ({getUsersByRole("admin").length + getUsersByRole("superadmin").length})
            </TabsTrigger>
            <TabsTrigger value="warehouse" className="text-base">
              Warehouse ({getUsersByRole("warehouse").length})
            </TabsTrigger>
            <TabsTrigger value="logistics" className="text-base">
              Logistics ({getUsersByRole("logistics").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <UserTable users={filteredUsers} title="All Users" />
          </TabsContent>

          <TabsContent value="admins" className="mt-6 space-y-8">
            <UserTable users={getUsersByRole("superadmin")} title="Super Admins" />
            <UserTable users={getUsersByRole("admin")} title="Admins" />
          </TabsContent>

          <TabsContent value="warehouse" className="mt-6">
            <UserTable users={getUsersByRole("warehouse")} title="Warehouse Users" />
          </TabsContent>

          <TabsContent value="logistics" className="mt-6">
            <UserTable users={getUsersByRole("logistics")} title="Logistics Users" />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
