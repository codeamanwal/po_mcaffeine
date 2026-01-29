"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Search, UserPlus, Shield, Warehouse, Truck, AlertCircle, Trash2, Edit } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import NavigationHeader from "@/components/header"
import api from "@/hooks/axios"
import { format } from "date-fns"
import { useUserStore } from "@/store/user-store"
import { deleteUser, getAllUsers, updateUser } from "@/lib/user"
import { getMasterFacilityOptions } from "@/master-sheets/fetch-master-sheet-data"


export default function UserManagementPage({
  onNavigate,
  isDarkMode,
  onToggleTheme,
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editRole, setEditRole] = useState("")
  const [editFacilities, setEditFacilities] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [editError, setEditError] = useState("")
  const [editSuccess, setEditSuccess] = useState("")

  const { user: currentUser } = useUserStore()

  const getUsers = async () => {
    try {
      setIsLoading(true)
      
      const res = await getAllUsers()

      if (res.status === 200) {
        setUsers(res.data.users)
      } else {
        setError("Failed to fetch users")
      }
    } catch (err) {
      setError("Failed to fetch users from server")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [users, searchTerm],
  )

  const getUsersByRole = (role) => filteredUsers.filter((u) => u.role === role)

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

  const canCurrentUserEdit = (target) => {
    const currentRole = (currentUser?.role || "") 
    // Only admins/superadmins can edit
    if (!(currentRole === "admin" || currentRole === "superadmin")) return false
    // They can edit for warehouse and logistics users
    if (!target?.role) return false
    if(currentRole === "superadmin"){
      return true
    }
    else if(currentRole === "admin"){
      if(target.role === "warehouse" || target.role === "logistics") return true;
      return false;
    }
    return false
  }

  //  ["warehouse", "logistics", "admin", "superadmin"]
  const roleEditableOptions = () => {
      const currentRole = (currentUser?.role || "") 
      if(currentRole === "superadmin"){
        return  ["warehouse", "logistics", "admin", "superadmin"]
      }
      else if(currentRole === "admin"){
        return  ["warehouse", "logistics",]
      }
      else return [];
  }

  // const facilityOptions = Array.isArray(master_facility_option) ? master_facility_option : []
  const [facilityOptions, setFacilityOptions]  = useState([]);
  useEffect(() => {
    async function fetchFacilityOptions() {
     const res = await getMasterFacilityOptions();
     console.log(res) 
     setFacilityOptions(res)
    }
    fetchFacilityOptions()
  }, [])

  // Edit dialog handlers
  const openEditDialog = (u) => {
    if (!canCurrentUserEdit(u)) {
      setError("Only admins can edit Warehouse or Logistics users")
      setTimeout(() => setError(""), 2500)
      return
    }
    setSelectedUser(u)
    setEditRole(roleEditableOptions().includes(u.role) ? u.role : "warehouse")
    setEditFacilities(Array.isArray(u.allotedFacilities) ? u.allotedFacilities : [])
    setEditError("")
    setEditSuccess("")
    setEditDialogOpen(true)
  }

  const closeEditDialog = () => {
    setEditDialogOpen(false)
    setSelectedUser(null)
    setIsSaving(false)
    setEditError("")
    setEditSuccess("")
  }

  const toggleFacility = (facility) => {
    setEditFacilities((prev) => (prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]))
  }

  const handleSaveUser = async () => {
    if (!selectedUser) return
    if (!canCurrentUserEdit(selectedUser)) {
      setEditError("You do not have permission to edit this user")
      return
    }
    if (!editRole || !roleEditableOptions().includes(editRole)) {
      setEditError("Please select a valid role")
      return
    }

    setIsSaving(true)
    setEditError("")
    setEditSuccess("")

    try {
      const payload = {
        id: selectedUser.id,
        role: editRole,
        allotedFacilities: editFacilities,
      }

      const res = await updateUser(payload)
      console.log(res.data)
      setEditSuccess(res.data.msg)
    } catch (err) {
      setEditError(err?.response?.data?.msg || err?.message || "Failed to update user")
    } finally {
      setIsSaving(false)
    }
  }

  // Delete
  const openDeleteDialog = (u) => {
    setSelectedUser(u)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return
    try {
      const res = await deleteUser(selectedUser.id)
      
      if (res.status === 200) {
        setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id))
      } else {
        setError(res?.data?.msg || "Failed to delete user")
      }
    } catch (err) {
      setError(err?.response?.data?.msg || "Failed to delete user")
    } finally {
      setDeleteDialogOpen(false)
      setSelectedUser(null)
      setTimeout(() => setError(""), 2500)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setSelectedUser(null)
  }

  // Table component
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
                <TableHead className="font-semibold">Alloted Facilities</TableHead>
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
                  <TableCell className="max-w-[280px]">
                    <div className="flex flex-wrap gap-1">
                      {(user.allotedFacilities || []).length === 0 ? (
                        <span className="text-sm text-gray-500">—</span>
                      ) : (
                        (user.allotedFacilities || []).map((f) => (
                          <Badge key={f} variant="secondary" className="text-xs">
                            {f}
                          </Badge>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{user?.createdAt ? format(new Date(user.createdAt), "dd MMM yyyy") : "—"}</TableCell>
                  <TableCell>{user?.lastLogin ? format(new Date(user.lastLogin), "dd MMM yyyy") : "Never"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      {user.status === "inactive" ? "Inactive" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-3">
                      <button
                        aria-label="Edit user"
                        className="p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        onClick={() => openEditDialog(user)}
                        title="Edit user"
                      >
                        <Edit className="h-5 w-5 text-blue-600" />
                      </button>
                      <button
                        aria-label="Delete user"
                        className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30"
                        onClick={() => openDeleteDialog(user)}
                        title="Delete user"
                      >
                        <Trash2 className="h-5 w-5 text-red-600" />
                      </button>
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

  return (
    <div className={`min-h-screen `}>
      <NavigationHeader currentPage="user-management" onNavigate={onNavigate} />

      <main className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          {error && (
            <Alert variant="destructive" className="mb-6 w-full mr-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!isLoading && !error && (
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
          )}
        </div>

        {!isLoading && !error && (
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
        )}
      </main>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => (open ? setEditDialogOpen(true) : closeEditDialog())}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit User
            </DialogTitle>
            <DialogDescription>View user details and update role or allotted facilities.</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* User info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">User Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Name</div>
                    <div className="font-medium">{selectedUser.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="font-medium">{selectedUser.email}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Current Role</div>
                    <div>
                      <Badge className={getRoleBadgeColor(selectedUser.role)}>
                        {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Created</div>
                    <div className="font-medium">
                      {selectedUser?.createdAt ? format(new Date(selectedUser.createdAt), "dd MMM yyyy") : "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Last Login</div>
                    <div className="font-medium">
                      {selectedUser?.lastLogin ? format(new Date(selectedUser.lastLogin), "dd MMM yyyy") : "Never"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Edit fields */}
              {
                currentUser.id === selectedUser.id ? (<></>) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Editable Fields</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 overflow-y-scroll">
                      {/* Role */}
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                          value={editRole}
                          onValueChange={(val) => setEditRole(val)}
                          disabled={!canCurrentUserEdit(selectedUser)}
                        >
                          <SelectTrigger id="role" className="w-full">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roleEditableOptions().map((r) => (
                              <SelectItem key={r} value={r}>
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">Admins can set role to Warehouse or Logistics.</p>
                      </div>

                      {/* Alloted Facilities */}
                      {
                        editRole === "admin" || editRole === "superadmin" ? (<></>) : (
                          <>
                          <div className="space-y-2">
                              <Label>Alloted Facilities</Label>
                              <div className="rounded border p-3">
                                <ScrollArea className="h-48 pr-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {facilityOptions.length === 0 ? (
                                      <div className="text-sm text-gray-500">No facility options available</div>
                                    ) : (
                                      facilityOptions.map((fac) => (
                                        <div key={fac} className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`fac-${fac}`}
                                            checked={editFacilities.includes(fac)}
                                            onCheckedChange={() => toggleFacility(fac)}
                                            disabled={!canCurrentUserEdit(selectedUser)}
                                          />
                                          <Label htmlFor={`fac-${fac}`} className="cursor-pointer">
                                            {fac}
                                          </Label>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </ScrollArea>
                              </div>
                              <p className="text-xs text-gray-500">Select one or more facilities allotted to the user.</p>
                              {editFacilities.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {editFacilities.map((f) => (
                                    <Badge key={f} variant="secondary" className="text-xs">
                                      {f}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                          </div>

                          {editError && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{editError}</AlertDescription>
                            </Alert>
                          )}
                          {editSuccess && (
                            <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{editSuccess}</AlertDescription>
                            </Alert>
                          )}
                          </>
                        )
                      }
                      
                    </CardContent>
                  </Card>
                )
              }
              
            </div>
          )}

          <DialogFooter className={`mt-2 ${currentUser?.id === selectedUser?.id ? "hidden" : ""}`}>
            <Button variant="outline" onClick={closeEditDialog} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveUser}
              disabled={!selectedUser || !canCurrentUserEdit(selectedUser) || isSaving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user "{selectedUser?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
