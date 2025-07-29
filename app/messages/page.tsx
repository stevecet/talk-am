"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Search, MessageSquare, Plus, Archive, Trash2 } from "lucide-react"

interface Conversation {
  id: string
  participant: {
    id: string
    name: string
    username: string
    avatar: string
    isOnline: boolean
  }
  lastMessage: {
    content: string
    timestamp: string
    isRead: boolean
    senderId: string
  }
  unreadCount: number
}

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedConversation, setSelectedConversation] = React.useState<string | null>(null)

  // Mock conversations data
  const conversations: Conversation[] = [
    {
      id: "1",
      participant: {
        id: "user-1",
        name: "Sarah Johnson",
        username: "sarah-johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        isOnline: true,
      },
      lastMessage: {
        content: "Thanks for the information about the community garden project!",
        timestamp: "2024-01-15T14:30:00Z",
        isRead: false,
        senderId: "user-1",
      },
      unreadCount: 2,
    },
    {
      id: "2",
      participant: {
        id: "user-2",
        name: "Michael Chen",
        username: "michael-chen",
        avatar: "/placeholder.svg?height=40&width=40",
        isOnline: false,
      },
      lastMessage: {
        content: "I'd be happy to help with the event planning. When should we meet?",
        timestamp: "2024-01-15T10:15:00Z",
        isRead: true,
        senderId: "current-user",
      },
      unreadCount: 0,
    },
    {
      id: "3",
      participant: {
        id: "user-3",
        name: "Taylor Wilson",
        username: "taylor-wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        isOnline: true,
      },
      lastMessage: {
        content: "The school fundraiser was a great success! Thank you for your help.",
        timestamp: "2024-01-14T16:45:00Z",
        isRead: true,
        senderId: "user-3",
      },
      unreadCount: 0,
    },
  ]

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.participant.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Private conversations with community members
            {totalUnread > 0 && (
              <Badge variant="destructive" className="ml-2">
                {totalUnread} unread
              </Badge>
            )}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No conversations found</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredConversations.map((conversation, index) => (
                      <div key={conversation.id}>
                        <div
                          className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                            selectedConversation === conversation.id ? "bg-muted" : ""
                          }`}
                          onClick={() => setSelectedConversation(conversation.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={conversation.participant.avatar || "/placeholder.svg"}
                                  alt={conversation.participant.name}
                                />
                                <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {conversation.participant.isOnline && (
                                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium truncate">{conversation.participant.name}</p>
                                <div className="flex items-center gap-1">
                                  {conversation.unreadCount > 0 && (
                                    <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs">
                                      {conversation.unreadCount}
                                    </Badge>
                                  )}
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(conversation.lastMessage.timestamp).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <p
                                className={`text-sm truncate mt-1 ${
                                  conversation.unreadCount > 0 ? "font-medium" : "text-muted-foreground"
                                }`}
                              >
                                {conversation.lastMessage.content}
                              </p>
                            </div>
                          </div>
                        </div>
                        {index < filteredConversations.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Message View */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <MessageView conversationId={selectedConversation} />
          ) : (
            <Card className="h-[600px]">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                  <p>Choose a conversation from the list to start messaging</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function MessageView({ conversationId }: { conversationId: string }) {
  const [newMessage, setNewMessage] = React.useState("")

  // Mock messages for the selected conversation
  const messages = [
    {
      id: "1",
      content: "Hi! I saw your post about the community garden. I'm really interested in helping out!",
      senderId: "user-1",
      timestamp: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      content:
        "That's wonderful! We're always looking for more volunteers. Are you interested in any particular aspect?",
      senderId: "current-user",
      timestamp: "2024-01-15T10:05:00Z",
    },
    {
      id: "3",
      content: "I have some experience with soil preparation and composting. I'd love to help with that!",
      senderId: "user-1",
      timestamp: "2024-01-15T10:10:00Z",
    },
    {
      id: "4",
      content: "Perfect! We're planning a soil preparation session this Saturday at 9 AM. Would you be available?",
      senderId: "current-user",
      timestamp: "2024-01-15T10:15:00Z",
    },
    {
      id: "5",
      content: "Thanks for the information about the community garden project!",
      senderId: "user-1",
      timestamp: "2024-01-15T14:30:00Z",
    },
  ]

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    // Here you would send the message to your backend
    console.log("Sending message:", newMessage)
    setNewMessage("")
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah Johnson" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">Sarah Johnson</CardTitle>
              <CardDescription>@sarah-johnson • Online</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === "current-user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-3 py-2 ${
                    message.senderId === "current-user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.senderId === "current-user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <div className="flex-shrink-0 border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            Send
          </Button>
        </form>
      </div>
    </Card>
  )
}
