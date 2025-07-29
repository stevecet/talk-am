"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, MessageSquare, AtSign, Heart, User, Mail, Check, X } from "lucide-react"
import Link from "next/link"

interface Notification {
  id: string
  type: "reply" | "mention" | "like" | "follow" | "message"
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
  actor?: {
    name: string
    username: string
    avatar: string
  }
}

export function NotificationSystem() {
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: "1",
      type: "reply",
      title: "New reply to your topic",
      message: "Michael Chen replied to 'Community garden proposal'",
      read: false,
      createdAt: "2024-01-15T10:30:00Z",
      actionUrl: "/topic/123#reply-456",
      actor: {
        name: "Michael Chen",
        username: "michael-chen",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
    {
      id: "2",
      type: "mention",
      title: "You were mentioned",
      message: "Sarah Johnson mentioned you in 'Local restaurant recommendations'",
      read: false,
      createdAt: "2024-01-15T09:15:00Z",
      actionUrl: "/topic/456#reply-789",
      actor: {
        name: "Sarah Johnson",
        username: "sarah-johnson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
    {
      id: "3",
      type: "like",
      title: "Your post was liked",
      message: "Taylor Wilson liked your reply in 'Community events'",
      read: true,
      createdAt: "2024-01-14T16:45:00Z",
      actionUrl: "/topic/789#reply-123",
      actor: {
        name: "Taylor Wilson",
        username: "taylor-wilson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
    {
      id: "4",
      type: "message",
      title: "New private message",
      message: "Jamie Rodriguez sent you a private message",
      read: false,
      createdAt: "2024-01-14T14:20:00Z",
      actionUrl: "/messages/jamie-rodriguez",
      actor: {
        name: "Jamie Rodriguez",
        username: "jamie-rodriguez",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
    {
      id: "5",
      type: "follow",
      title: "New follower",
      message: "Alex Thompson started following you",
      read: true,
      createdAt: "2024-01-13T11:30:00Z",
      actionUrl: "/profile/alex-thompson",
      actor: {
        name: "Alex Thompson",
        username: "alex-thompson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reply":
        return <MessageSquare className="h-4 w-4" />
      case "mention":
        return <AtSign className="h-4 w-4" />
      case "like":
        return <Heart className="h-4 w-4" />
      case "follow":
        return <User className="h-4 w-4" />
      case "message":
        return <Mail className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "reply":
        return "text-blue-600"
      case "mention":
        return "text-green-600"
      case "like":
        return "text-red-600"
      case "follow":
        return "text-purple-600"
      case "message":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-6 px-2 text-xs">
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 hover:bg-muted/50 transition-colors ${
                    !notification.read ? "bg-primary/5 border-l-2 border-l-primary" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1 rounded-full ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        {notification.actor && (
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={notification.actor.avatar || "/placeholder.svg"}
                              alt={notification.actor.name}
                            />
                            <AvatarFallback className="text-xs">{notification.actor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {notification.actionUrl && (
                          <Link href={notification.actionUrl}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => markAsRead(notification.id)}
                            >
                              View
                            </Button>
                          </Link>
                        )}
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-destructive"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/notifications" className="w-full">
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
