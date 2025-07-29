"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Eye,
  EyeOff,
  Ban,
  MessageSquare,
  Flag,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ModerationPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [typeFilter, setTypeFilter] = React.useState("all")

  // Mock data for reported content
  const [reports, setReports] = React.useState([
    {
      id: "1",
      type: "topic",
      contentId: "topic-123",
      title: "Inappropriate language in community discussion",
      content: "This topic contains offensive language and personal attacks...",
      author: {
        id: "user-456",
        name: "John Doe",
        username: "johndoe",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "JD",
      },
      reporter: {
        id: "user-789",
        name: "Jane Smith",
        username: "janesmith",
      },
      reason: "harassment",
      details: "User is making personal attacks against other community members",
      status: "pending",
      createdAt: "2024-01-15T10:30:00Z",
      category: "General Discussion",
    },
    {
      id: "2",
      type: "reply",
      contentId: "reply-456",
      title: "Spam link in reply",
      content: "Check out this amazing deal at [suspicious-link.com]...",
      author: {
        id: "user-321",
        name: "Spam User",
        username: "spamuser",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SU",
      },
      reporter: {
        id: "user-654",
        name: "Alert User",
        username: "alertuser",
      },
      reason: "spam",
      details: "This reply contains promotional links and appears to be spam",
      status: "pending",
      createdAt: "2024-01-15T09:15:00Z",
      category: "Recommendations",
    },
    {
      id: "3",
      type: "topic",
      contentId: "topic-789",
      title: "Misinformation about local policies",
      content: "The city council is secretly planning to...",
      author: {
        id: "user-987",
        name: "Conspiracy User",
        username: "conspiracy",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "CU",
      },
      reporter: {
        id: "user-111",
        name: "Concerned Citizen",
        username: "concerned",
      },
      reason: "misinformation",
      details: "This post contains false information about city policies",
      status: "resolved",
      action: "hidden",
      createdAt: "2024-01-14T16:45:00Z",
      category: "Local News",
    },
  ])

  const [users, setUsers] = React.useState([
    {
      id: "user-456",
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JD",
      joinDate: "2023-06-15",
      postCount: 45,
      status: "active",
      warnings: 1,
      lastActive: "2024-01-15T12:00:00Z",
    },
    {
      id: "user-321",
      name: "Spam User",
      username: "spamuser",
      email: "spam@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SU",
      joinDate: "2024-01-10",
      postCount: 12,
      status: "warned",
      warnings: 2,
      lastActive: "2024-01-15T09:30:00Z",
    },
    {
      id: "user-987",
      name: "Conspiracy User",
      username: "conspiracy",
      email: "conspiracy@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "CU",
      joinDate: "2023-12-01",
      postCount: 23,
      status: "banned",
      warnings: 3,
      banReason: "Repeated misinformation",
      banExpiry: "2024-02-15T00:00:00Z",
      lastActive: "2024-01-14T18:00:00Z",
    },
  ])

  const handleReportAction = (reportId: string, action: "approve" | "dismiss" | "hide" | "ban") => {
    setReports(
      reports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: "resolved",
              action,
              resolvedAt: new Date().toISOString(),
            }
          : report,
      ),
    )
  }

  const handleUserAction = (userId: string, action: "warn" | "ban" | "unban", details?: any) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          switch (action) {
            case "warn":
              return {
                ...user,
                warnings: user.warnings + 1,
                status: user.warnings >= 2 ? "warned" : user.status,
              }
            case "ban":
              return {
                ...user,
                status: "banned",
                banReason: details.reason,
                banExpiry: details.expiry,
              }
            case "unban":
              return {
                ...user,
                status: "active",
                banReason: undefined,
                banExpiry: undefined,
              }
            default:
              return user
          }
        }
        return user
      }),
    )
  }

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.author.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    const matchesType = typeFilter === "all" || report.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string, action?: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "resolved":
        if (action === "dismiss") {
          return (
            <Badge variant="outline" className="text-green-600 border-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Dismissed
            </Badge>
          )
        }
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Resolved
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getUserStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Active
          </Badge>
        )
      case "warned":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Warned
          </Badge>
        )
      case "banned":
        return <Badge variant="destructive">Banned</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Moderation Dashboard</h1>
          <p className="text-muted-foreground">Manage reported content and user moderation</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-red-600 border-red-600">
            {reports.filter((r) => r.status === "pending").length} Pending Reports
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reports">
            <Flag className="h-4 w-4 mr-2" />
            Reports ({reports.filter((r) => r.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="users">
            <Ban className="h-4 w-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="content">
            <MessageSquare className="h-4 w-4 mr-2" />
            Content Review
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Reports</CardTitle>
              <CardDescription>Review and moderate reported content from community members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reports..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="topic">Topics</SelectItem>
                    <SelectItem value="reply">Replies</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <Card key={report.id} className="border-l-4 border-l-red-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{report.type}</Badge>
                            <Badge variant="secondary">{report.category}</Badge>
                            {getStatusBadge(report.status, report.action)}
                          </div>
                          <h3 className="font-semibold">{report.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Reported by {report.reporter.name} • {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/${report.type}/${report.contentId}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Content
                              </Link>
                            </DropdownMenuItem>
                            {report.status === "pending" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleReportAction(report.id, "approve")}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve Report
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleReportAction(report.id, "hide")}>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Hide Content
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleReportAction(report.id, "dismiss")}>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Dismiss Report
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Reported Content</h4>
                          <div className="p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={report.author.avatar || "/placeholder.svg"}
                                  alt={report.author.name}
                                />
                                <AvatarFallback className="text-xs">{report.author.initials}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{report.author.name}</span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3">{report.content}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Report Details</h4>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium">Reason: </span>
                              <Badge variant="outline">{report.reason}</Badge>
                            </div>
                            {report.details && (
                              <div>
                                <span className="text-sm font-medium">Details: </span>
                                <p className="text-sm text-muted-foreground">{report.details}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts, warnings, and bans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <Card key={user.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>{user.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {getUserStatusBadge(user.status)}
                              {user.warnings > 0 && (
                                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                  {user.warnings} Warning{user.warnings > 1 ? "s" : ""}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {user.postCount} posts • Joined {user.joinDate}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Last active: {new Date(user.lastActive).toLocaleDateString()}
                          </p>
                          {user.status === "banned" && user.banExpiry && (
                            <p className="text-sm text-red-600">
                              Ban expires: {new Date(user.banExpiry).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <UserActionDialog user={user} onAction={handleUserAction} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Review</CardTitle>
              <CardDescription>Review recent posts and topics for policy violations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Content review queue is empty</p>
                <p className="text-sm">Recent posts will appear here for review</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function UserActionDialog({
  user,
  onAction,
}: { user: any; onAction: (userId: string, action: string, details?: any) => void }) {
  const [open, setOpen] = React.useState(false)
  const [action, setAction] = React.useState("")
  const [reason, setReason] = React.useState("")
  const [duration, setDuration] = React.useState("7")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (action === "ban") {
      const expiry = new Date()
      expiry.setDate(expiry.getDate() + Number.parseInt(duration))
      onAction(user.id, action, { reason, expiry: expiry.toISOString() })
    } else {
      onAction(user.id, action, { reason })
    }

    setOpen(false)
    setAction("")
    setReason("")
    setDuration("7")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Actions - {user.name}</DialogTitle>
          <DialogDescription>Take moderation action against this user account</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label>Action</Label>
              <Select value={action} onValueChange={setAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an action" />
                </SelectTrigger>
                <SelectContent>
                  {user.status !== "banned" && (
                    <>
                      <SelectItem value="warn">Issue Warning</SelectItem>
                      <SelectItem value="ban">Ban User</SelectItem>
                    </>
                  )}
                  {user.status === "banned" && <SelectItem value="unban">Unban User</SelectItem>}
                </SelectContent>
              </Select>
            </div>

            {action === "ban" && (
              <div>
                <Label>Ban Duration (days)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="9999">Permanent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Reason</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain the reason for this action..."
                required
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!action || !reason}>
              Apply Action
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
