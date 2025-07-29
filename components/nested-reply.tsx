"use client"

import * as React from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { RichTextEditor } from "@/components/rich-text-editor"
import { CalendarDays, Heart, Flag, ReplyIcon, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ReportDialog } from "@/components/report-dialog"
import { ModerationActions } from "@/components/moderation-actions"

interface NestedReplyProps {
  reply: {
    id: string
    author: {
      id: string
      name: string
      username: string
      avatar: string
      initials: string
      joinDate: string
      postCount: number
    }
    content: string
    createdAt: string
    updatedAt?: string
    likes: number
    parentId?: string
    quotedReply?: {
      id: string
      author: string
      content: string
    }
    children?: any[]
  }
  depth?: number
  onReply?: (parentId: string, content: string) => void
  onQuote?: (reply: any) => void
  onEdit?: (replyId: string, content: string) => void
  onDelete?: (replyId: string) => void
  currentUserId?: string
}

export function NestedReply({ reply, depth = 0, onReply, onQuote, onEdit, onDelete, currentUserId }: NestedReplyProps) {
  const [showReplyForm, setShowReplyForm] = React.useState(false)
  const [showEditForm, setShowEditForm] = React.useState(false)
  const [replyContent, setReplyContent] = React.useState("")
  const [editContent, setEditContent] = React.useState(reply.content)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const isOwner = currentUserId === reply.author.id
  const maxDepth = 5 // Maximum nesting depth

  const handleReply = async () => {
    if (!replyContent.trim() || !onReply) return

    setIsSubmitting(true)
    try {
      await onReply(reply.id, replyContent)
      setReplyContent("")
      setShowReplyForm(false)
    } catch (error) {
      console.error("Failed to post reply:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async () => {
    if (!editContent.trim() || !onEdit) return

    setIsSubmitting(true)
    try {
      await onEdit(reply.id, editContent)
      setShowEditForm(false)
    } catch (error) {
      console.error("Failed to edit reply:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuote = () => {
    if (onQuote) {
      onQuote(reply)
    }
  }

  const handleDelete = () => {
    if (onDelete && window.confirm("Are you sure you want to delete this reply?")) {
      onDelete(reply.id)
    }
  }

  const renderContent = (content: string) => {
    // Simple markdown-like rendering
    const html = content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-3 rounded-md overflow-x-auto"><code>$1</code></pre>')
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-muted pl-4 italic">$1</blockquote>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-3 mb-2">$1</h2>')
      .replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/\n/g, "<br>")

    return html
  }

  return (
    <div className={`${depth > 0 ? "ml-8 border-l-2 border-muted pl-4" : ""}`}>
      <Card id={`reply-${reply.id}`} className="mb-4">
        <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
          <Link href={`/profile/${reply.author.username}`}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={reply.author.avatar || "/placeholder.svg"} alt={reply.author.name} />
              <AvatarFallback>{reply.author.initials}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <Link href={`/profile/${reply.author.username}`} className="font-semibold hover:underline">
                {reply.author.name}
              </Link>
              <span className="text-xs text-muted-foreground">{reply.author.postCount} posts</span>
              <span className="text-xs text-muted-foreground">Joined {reply.author.joinDate}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              <span>{reply.createdAt}</span>
              {reply.updatedAt && (
                <>
                  <span>•</span>
                  <span>Edited {reply.updatedAt}</span>
                </>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleQuote}>
                <ReplyIcon className="h-4 w-4 mr-2" />
                Quote
              </DropdownMenuItem>
              {isOwner && (
                <>
                  <DropdownMenuItem onClick={() => setShowEditForm(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
              <ReportDialog
                contentType="reply"
                contentId={reply.id}
                contentTitle={reply.content.substring(0, 50) + "..."}
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </ReportDialog>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModerationActions
            contentType="reply"
            contentId={reply.id}
            onAction={(action, data) => {
              console.log(`Moderation action: ${action}`, data)
              // Handle moderation actions here
            }}
          />
        </CardHeader>
        <CardContent className="pt-0">
          {reply.quotedReply && (
            <div className="mb-4 p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
              <div className="text-sm font-medium mb-1">{reply.quotedReply.author} wrote:</div>
              <div
                className="text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: renderContent(reply.quotedReply.content) }}
              />
            </div>
          )}

          {showEditForm ? (
            <div className="space-y-4">
              <RichTextEditor
                value={editContent}
                onChange={setEditContent}
                placeholder="Edit your reply..."
                minHeight="150px"
              />
              <div className="flex gap-2">
                <Button onClick={handleEdit} disabled={isSubmitting} size="sm">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditForm(false)
                    setEditContent(reply.content)
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: renderContent(reply.content) }} />
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-1">
              <Heart className="h-4 w-4" />
              <span>{reply.likes}</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {depth < maxDepth && (
              <Button variant="ghost" size="sm" onClick={() => setShowReplyForm(!showReplyForm)}>
                <ReplyIcon className="h-4 w-4 mr-1" />
                Reply
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {showReplyForm && (
        <Card className="mb-4 ml-8">
          <CardHeader className="pb-2">
            <h4 className="font-semibold text-sm">Reply to {reply.author.name}</h4>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              value={replyContent}
              onChange={setReplyContent}
              placeholder="Write your reply..."
              minHeight="150px"
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowReplyForm(false)
                setReplyContent("")
              }}
              size="sm"
            >
              Cancel
            </Button>
            <Button onClick={handleReply} disabled={isSubmitting || !replyContent.trim()} size="sm">
              {isSubmitting ? "Posting..." : "Post Reply"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {reply.children && reply.children.length > 0 && (
        <div className="space-y-4">
          {reply.children.map((childReply) => (
            <NestedReply
              key={childReply.id}
              reply={childReply}
              depth={depth + 1}
              onReply={onReply}
              onQuote={onQuote}
              onEdit={onEdit}
              onDelete={onDelete}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
