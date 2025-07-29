"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PermissionGuard } from "@/components/permission-guard"
import { RoleBadge } from "@/components/role-badge"
import { type UserRole, ROLES, type User } from "@/types/user-roles"
import { Search, UserPlus, Edit, Ban, Shield, MoreHorizontal, Mail, Calendar, Activity } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function UsersManagementPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [showRoleDialog, setShowRoleDialog] = React.useState(false)
  const [showBanDialog, setShowBanDialog] = React.useState(false)
  const [newRole, setNewRole] = React.useState<UserRole>("user")
  const [banReason, setBanReason] = React.useState("")
  const [banDuration, setBanDuration] = React.useState("7")

  // Mock users data
  const [users, setUsers] = React.useState<User[]>([
    {
      id: "1",
      username: "sarah-johnson",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "administrator",
      joinDate: "2022-03-15",
      lastActive: "2024-01-15T14:30:00Z",
      isActive: true,
      isBanned: false,
    },
    {
      id: "2",
      username: "michael-chen",
      name: "Michael Chen",
      email: "michael@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "moderator",
      joinDate: "2023-01-20",
      lastActive: "2024-01-15T12:15:00Z",
      isActive: true,
      isBanned: false,
    },
    {
      id: "3",
      username: "taylor-wilson",
      name: "Taylor Wilson",
      email: "taylor@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "user",
      joinDate: "2023-08-10",
      lastActive: "2024-01-14T18:45:00Z",
      isActive: true,
      isBanned: false,
    },
    {
      id: "4",
      username: "spam-user",
      name: "Spam User",
      email: "spam@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "user",
      joinDate: "2024-01-10",
      lastActive: "2024-01-12T09:30:00Z",
      isActive: false,
      isBanned: true,
      banReason: "Repeated spam posting",
      banExpiry: "2024-02-15T00:00:00Z",
    },
  ])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive && !user.isBanned) ||
      (statusFilter === "banned" && user.isBanned) ||
      (statusFilter === "inactive" && !user.isActive && !user.isBanned)

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleRoleChange = () => {
    if (!selectedUser) return

    setUsers((prev) => prev.map((user) => (user.id === selectedUser.id ? { ...user, role: newRole } : user)))

    setShowRoleDialog(false)
    setSelectedUser(null)
    setNewRole("user")
  }

  const handleBanUser = () => {
    if (!selectedUser) return

    const expiry = new Date()
    expiry.setDate(expiry.getDate() + Number.parseInt(banDuration))

    setUsers((prev) =>
      prev.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              isBanned: true,
              isActive: false,
              banReason,
              banExpiry: expiry.toISOString(),
            }
          : user,
      ),
    )

    setShowBanDialog(false)
    setSelectedUser(null)
    setBanReason("")
    setBanDuration("7")
  }

  const handleUnbanUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              isBanned: false,
              isActive: true,
              banReason: undefined,
              banExpiry: undefined,
            }
          : user,
      ),
    )
  }

  const getStatusBadge = (user: User) => {
    if (user.isBanned) {
      return <Badge variant="destructive">Banned</Badge>
    }
    if (!user.isActive) {
      return <Badge variant="secondary">Inactive</Badge>
    }
    return (
      <Badge variant="outline" className="text-green-600 border-green-600">
        Active
      </Badge>
    )
  }

  return (
    <PermissionGuard permission="manage_users">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
          </div>
          <PermissionGuard permission="manage_users">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </PermissionGuard>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>View and manage all forum users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="moderator">Moderators</SelectItem>
                  <SelectItem value="administrator">Administrators</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">@{user.username}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RoleBadge role={user.role} />
                      </TableCell>
                      <TableCell>{getStatusBadge(user)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(user.joinDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Activity className="h-4 w-4" />
                          {new Date(user.lastActive).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <PermissionGuard permission="manage_roles">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user)
                                  setNewRole(user.role)
                                  setShowRoleDialog(true)
                                }}
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Change Role
                              </DropdownMenuItem>
                            </PermissionGuard>
                            <PermissionGuard permission="moderate_users">
                              {user.isBanned ? (
                                <DropdownMenuItem onClick={() => handleUnbanUser(user.id)}>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Unban User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setShowBanDialog(true)
                                  }}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  Ban User
                                </DropdownMenuItem>
                              )}
                            </PermissionGuard>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Role Change Dialog */}
        <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change User Role</DialogTitle>
              <DialogDescription>
                Change the role for {selectedUser?.name}. This will affect their permissions on the forum.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Current Role</Label>
                <div className="mt-1">{selectedUser && <RoleBadge role={selectedUser.role} />}</div>
              </div>
              <div>
                <Label>New Role</Label>
                <Select value={newRole} onValueChange={(value: UserRole) => setNewRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ROLES).map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex items-center gap-2">
                          <RoleBadge role={role.id} showIcon={false} variant="outline" />
                          <div>
                            <div className="font-medium">{role.name}</div>
                            <div className="text-sm text-muted-foreground">{role.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleRoleChange}>Change Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Ban User Dialog */}
        <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ban User</DialogTitle>
              <DialogDescription>
                Ban {selectedUser?.name} from the forum. They will not be able to access the platform during the ban
                period.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Ban Duration</Label>
                <Select value={banDuration} onValueChange={setBanDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="9999">Permanent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Reason for Ban</Label>
                <Textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Explain why this user is being banned..."
                  rows={3}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBanDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleBanUser} disabled={!banReason.trim()}>
                Ban User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  )
}
