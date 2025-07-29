"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReadStatusProps {
  topicId: string
  isRead: boolean
  onToggleRead: (topicId: string, isRead: boolean) => void
  className?: string
}

export function ReadStatus({ topicId, isRead, onToggleRead, className }: ReadStatusProps) {
  const [currentReadStatus, setCurrentReadStatus] = React.useState(isRead)

  const handleToggle = () => {
    const newStatus = !currentReadStatus
    setCurrentReadStatus(newStatus)
    onToggleRead(topicId, newStatus)
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {!currentReadStatus && (
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          New
        </Badge>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className="h-6 px-2 text-xs"
        title={currentReadStatus ? "Mark as unread" : "Mark as read"}
      >
        {currentReadStatus ? (
          <>
            <EyeOff className="h-3 w-3 mr-1" />
            Mark Unread
          </>
        ) : (
          <>
            <Eye className="h-3 w-3 mr-1" />
            Mark Read
          </>
        )}
      </Button>
    </div>
  )
}

// Hook for managing read status across the application
export function useReadStatus() {
  const [readTopics, setReadTopics] = React.useState<Set<string>>(new Set())

  // Load read status from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem("forum-read-topics")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setReadTopics(new Set(parsed))
      } catch (error) {
        console.error("Failed to parse read topics:", error)
      }
    }
  }, [])

  // Save to localStorage whenever readTopics changes
  React.useEffect(() => {
    localStorage.setItem("forum-read-topics", JSON.stringify(Array.from(readTopics)))
  }, [readTopics])

  const markAsRead = (topicId: string) => {
    setReadTopics((prev) => new Set([...prev, topicId]))
  }

  const markAsUnread = (topicId: string) => {
    setReadTopics((prev) => {
      const newSet = new Set(prev)
      newSet.delete(topicId)
      return newSet
    })
  }

  const toggleReadStatus = (topicId: string, isRead: boolean) => {
    if (isRead) {
      markAsRead(topicId)
    } else {
      markAsUnread(topicId)
    }
  }

  const isTopicRead = (topicId: string) => readTopics.has(topicId)

  return {
    isTopicRead,
    markAsRead,
    markAsUnread,
    toggleReadStatus,
  }
}
