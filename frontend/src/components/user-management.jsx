"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Search, UserPlus, Shield, Warehouse, Truck, AlertCircle, Trash2, Edit } from "lucide-react"
import { Alert, AlertDescription, Aler } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog"

import NavigationHeader from "@/components/header"
import api from "@/hooks/axios"
import { deleteUserUrl, getAllUsersUrl } from "@/constants/urls"
import { formatDate } from "date-fns"


export default function UserManagementPage({ onNavigate, isDarkMode, onToggleTheme }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [dialogType, setDialogType] = useState(null); // "edit" or "delete"
  const [selectedUser, setSelectedUser] = useState(null);

  const getAllUsers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(getAllUsersUrl)
      console.log(res.data)
      if(res.status === 200) {
        setUsers(res.data.users)
      }else{
        setError("Failed to fetch users")
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch usersfrom server")
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllUsers();
  },[])

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
                <TableHead className="font-semibold">Action</TableHead> 
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
                  <TableCell>{formatDate(user?.createdAt, "dd MMM/yyyy")}</TableCell>
                  <TableCell>{user.lastLogin || "Never"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {/* <Edit className="my-auto h-6 w-6 text-blue-500"
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditUser(user)}
                      /> */}
                      <Trash2 className="my-auto h-6 w-6 text-red-500" 
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(user)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )

  const ConfirmDialog = ({ open, type, user, onConfirm, onCancel }) => (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "edit" ? "Edit User" : "Delete User"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {type === "edit"
            ? `Are you sure you want to edit user "${user?.name}"?`
            : `Are you sure you want to delete user "${user?.name}"? This action cannot be undone.`}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            variant={type === "delete" ? "destructive" : "default"}
            onClick={onConfirm}
          >
            {type === "edit" ? "Edit" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setDialogType("edit");
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDialogType("delete");
  };

  const handleDialogConfirm = async () => {
    if (dialogType === "edit") {
      // Implement edit logic here (e.g., navigate to edit page or open edit form)
      // alert(`Edit user: ${selectedUser.name}`);
      console.log(selectedUser)
    } else if (dialogType === "delete") {
      // Implement delete logic here (e.g., API call)
      // alert(`Delete user: ${selectedUser.name}`);
      // Optionally remove user from state after successful delete
      console.log(selectedUser)
      try {
        const res = await api.post(deleteUserUrl, { id: selectedUser.id })
        if(res.status === 200) {
          alert("User deleted successfully!")
          setUsers(users.filter((user) => user.id !== selectedUser.id))
        }else {
          setError( error?.response?.data?.msg ||"Failed to delete user")
        }
      }catch(error){
        console.log(error)
        setError( error?.response?.data?.msg ||"Failed to delete user")
      }finally {
        setTimeout(() => {setError("")}, 2000)
        setDialogType(null);
        setSelectedUser(null);
      }
    }
    
  };

  const handleDialogCancel = () => {
    setDialogType(null);
    setSelectedUser(null);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <NavigationHeader
        currentPage="user-management"
        onNavigate={onNavigate}
      />

      <main className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
          )}
          {
            isLoading && (
              <div className="mb-6">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4 animate-spin" />
                  <AlertDescription>Loading...</AlertDescription>
                </Alert>
              </div>
            )
          }
          {
            !isLoading && !error && (
              <>
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
              </>
            ) 
          }
          
        </div>
          {
            !isLoading && !error && (
              <>
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
              </>
            )
          }
          <ConfirmDialog
            open={!!dialogType}
            type={dialogType}
            user={selectedUser}
            onConfirm={handleDialogConfirm}
            onCancel={handleDialogCancel}
          />
      </main>
    </div>
  )
}
