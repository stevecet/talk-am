"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NestedReply } from "@/components/nested-reply"
import { RichTextEditorWithMentions } from "@/components/user-mention"
import { VotingSystem } from "@/components/voting-system"
import { FileUpload } from "@/components/file-upload"
import { ReadStatus, useReadStatus } from "@/components/read-status"
import { RateLimiter, useRateLimit } from "@/components/rate-limiter"
import { SEOMeta, parseSEOUrl } from "@/components/seo-meta"
import { Breadcrumb } from "@/components/breadcrumb"
import { ModerationActions } from "@/components/moderation-actions"
import {
  CalendarDays,
  MessageSquare,
  Flag,
  Share2,
  Bookmark,
  BookmarkCheck,
  Edit,
  Trash2,
  Lock,
  Pin,
  MoreHorizontal,
  Paperclip,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TopicPageProps {
  params: {
    slug: string
  }
  searchParams: {
    page?: string
  }
}

export default function TopicPage({ params, searchParams }: TopicPageProps) {
  const router = useRouter()
  const topicId = parseSEOUrl(params.slug)
  const currentPage = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const [replyContent, setReplyContent] = React.useState("")
  const [attachedFiles, setAttachedFiles] = React.useState<any[]>([])
  const [quotedReply, setQuotedReply] = React.useState<any>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showEditForm, setShowEditForm] = React.useState(false)
  const [editContent, setEditContent] = React.useState("")
  const [showFileUpload, setShowFileUpload] = React.useState(false)

  // Rate limiting for replies
  const replyRateLimit = useRateLimit("reply", 10, 60000) // 10 replies per minute

  // Read status management
  const { isTopicRead, toggleReadStatus } = useReadStatus()

  // Mock current user - in a real app, this would come from auth
  const currentUserId = "1"

  // Enhanced topic data with SEO and voting
  const [topic, setTopic] = React.useState({
    id: topicId,
    title: "New community garden proposal for Oak Street Park",
    slug: params.slug,
    category: {
      id: "community-projects",
      name: "Community Projects",
    },
    author: {
      id: "1",
      name: "Sarah Johnson",
      username: "sarah-johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SJ",
      joinDate: "March 2022",
      postCount: 156,
    },
    content: `Hello neighbors!

I'd like to propose a community garden project for the unused space in Oak Street Park. The area behind the playground has about 2,000 square feet that could be converted into garden plots for residents.

**Benefits would include:**
- Fresh produce for community members
- Educational opportunities for local schools
- Beautification of currently unused space
- Community building and social connections

I've already spoken with a few city council members who seem supportive, but we'd need community backing to move forward. I'm thinking we could have around 20 plots, a shared tool shed, and a small seating area.

What do you all think? Would anyone be interested in helping organize this or having a garden plot?`,
    createdAt: "2024-01-15T10:23:00Z",
    updatedAt: undefined as string | undefined,
    views: 156,
    score: 42,
    userVote: null as "up" | "down" | null,
    isPinned: false,
    isLocked: false,
    isBookmarked: false,
    tags: ["Community", "Gardening", "Parks", "Volunteering"],
    attachments: [],
  })

  const isTopicOwner = currentUserId === topic.author.id
  const topicReadStatus = isTopicRead(topic.id)

  // Mark topic as read when viewed
  React.useEffect(() => {
    if (!topicReadStatus) {
      setTimeout(() => {
        toggleReadStatus(topic.id, true)
      }, 2000) // Mark as read after 2 seconds
    }
  }, [topic.id, topicReadStatus, toggleReadStatus])

  // Enhanced replies with nested structure and voting
  const [replies, setReplies] = React.useState([
    {
      id: "1",
      author: {
        id: "2",
        name: "Michael Chen",
        username: "michael-chen",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "MC",
        joinDate: "January 2023",
        postCount: 89,
      },
      content: `This is a **fantastic idea**, Sarah! I live near Oak Street Park and have been thinking that space could be put to better use.

I'd definitely be interested in having a plot. I've done some community gardening before in my previous neighborhood and would be happy to help with the organization and planning.

Have you thought about water access? That's usually one of the bigger challenges for community gardens.`,
      createdAt: "June 15, 2023 at 11:45 AM",
      score: 18,
      userVote: null as "up" | "down" | null,
      parentId: undefined,
      attachments: [],
      children: [
        {
          id: "1-1",
          author: {
            id: "1",
            name: "Sarah Johnson",
            username: "sarah-johnson",
            avatar: "/placeholder.svg?height=40&width=40",
            initials: "SJ",
            joinDate: "March 2022",
            postCount: 156,
          },
          content: `Great point about water access, Michael! I've actually looked into this already. 

The park has a water spigot near the maintenance shed that we could potentially tap into. I spoke with the parks department and they said it would be feasible to run a line to the garden area.`,
          createdAt: "June 15, 2023 at 12:30 PM",
          score: 12,
          userVote: null as "up" | "down" | null,
          parentId: "1",
          attachments: [],
          quotedReply: {
            id: "1",
            author: "Michael Chen",
            content:
              "Have you thought about water access? That's usually one of the bigger challenges for community gardens.",
          },
          children: [],
        },
      ],
    },
  ])

  const handleVote = async (contentId: string, voteType: "up" | "down" | null) => {
    // Update topic vote
    if (contentId === topic.id) {
      setTopic((prev) => ({
        ...prev,
        userVote: voteType,
        score: prev.score + (voteType === "up" ? 1 : voteType === "down" ? -1 : 0),
      }))
    } else {
      // Update reply vote (recursive function would be needed for nested replies)
      // This is a simplified version
      console.log("Voting on reply:", contentId, voteType)
    }
  }

  const handleReply = async (parentId: string | undefined, content: string) => {
    if (!content.trim()) return

    // Check rate limit
    if (!replyRateLimit.attemptAction()) {
      return
    }

    const newReply = {
      id: Date.now().toString(),
      author: {
        id: currentUserId,
        name: "Current User",
        username: "current-user",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "CU",
        joinDate: "January 2024",
        postCount: 5,
      },
      content,
      createdAt: new Date().toLocaleString(),
      score: 0,
      userVote: null as "up" | "down" | null,
      parentId,
      attachments: attachedFiles,
      quotedReply: quotedReply,
      children: [],
    }

    if (parentId) {
      // Add as nested reply
      const addNestedReply = (replies: any[]): any[] => {
        return replies.map((reply) => {
          if (reply.id === parentId) {
            return {
              ...reply,
              children: [...reply.children, newReply],
            }
          } else if (reply.children.length > 0) {
            return {
              ...reply,
              children: addNestedReply(reply.children),
            }
          }
          return reply
        })
      }
      setReplies(addNestedReply(replies))
    } else {
      // Add as top-level reply
      setReplies([...replies, newReply])
    }

    setQuotedReply(null)
    setAttachedFiles([])
  }

  const handleTopicReply = async () => {
    if (!replyContent.trim()) return

    setIsSubmitting(true)
    try {
      await handleReply(undefined, replyContent)
      setReplyContent("")
      setShowFileUpload(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderContent = (content: string) => {
    const html = content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-3 rounded-md overflow-x-auto"><code>$1</code></pre>')
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-muted pl-4 italic">$1</blockquote>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-3 mb-2">$2</h2>')
      .replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/@(\w+)/g, '<span class="bg-primary/10 text-primary px-1 py-0.5 rounded">@$1</span>')
      .replace(/\n/g, "<br>")

    return html
  }

  return (
    <>
      <SEOMeta
        title={topic.title}
        description={topic.content.substring(0, 160) + "..."}
        url={`https://localtalk.com/topic/${params.slug}`}
        type="article"
        author={topic.author.name}
        publishedTime={topic.createdAt}
        modifiedTime={topic.updatedAt}
        tags={topic.tags}
      />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Categories", href: "/categories" },
            { label: topic.category.name, href: `/category/${topic.category.id}` },
            { label: topic.title },
          ]}
        />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold">{topic.title}</h1>
              <ReadStatus topicId={topic.id} isRead={topicReadStatus} onToggleRead={toggleReadStatus} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {topic.isPinned && (
                <Badge variant="outline">
                  <Pin className="h-3 w-3 mr-1" />
                  Pinned
                </Badge>
              )}
              {topic.isLocked && (
                <Badge variant="outline">
                  <Lock className="h-3 w-3 mr-1" />
                  Locked
                </Badge>
              )}
              {topic.tags &&
                topic.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-primary/10">
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>

          <div className="flex gap-4">
            <VotingSystem
              contentId={topic.id}
              contentType="topic"
              initialScore={topic.score}
              initialUserVote={topic.userVote}
              onVote={handleVote}
            />

            <Card className="flex-1">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <Link href={`/profile/${topic.author.username}`}>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={topic.author.avatar || "/placeholder.svg"} alt={topic.author.name} />
                    <AvatarFallback>{topic.author.initials}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Link href={`/profile/${topic.author.username}`} className="font-semibold hover:underline">
                      {topic.author.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">{topic.author.postCount} posts</span>
                    <span className="text-xs text-muted-foreground">Joined {topic.author.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    <span>{new Date(topic.createdAt).toLocaleString()}</span>
                    {topic.updatedAt && (
                      <>
                        <span>•</span>
                        <span>Edited {new Date(topic.updatedAt).toLocaleString()}</span>
                      </>
                    )}
                  </div>
                </div>
                {isTopicOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setShowEditForm(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Topic
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Topic
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <ModerationActions
                  contentType="topic"
                  contentId={topic.id}
                  isLocked={topic.isLocked}
                  isPinned={topic.isPinned}
                  currentCategory={topic.category.name}
                  onAction={(action, data) => {
                    console.log(`Moderation action: ${action}`, data)
                    // Handle moderation actions like lock, pin, move, etc.
                    if (action === "lock") {
                      setTopic((prev) => ({ ...prev, isLocked: !prev.isLocked }))
                    } else if (action === "pin") {
                      setTopic((prev) => ({ ...prev, isPinned: !prev.isPinned }))
                    }
                    // Add other action handlers as needed
                  }}
                />
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: renderContent(topic.content) }} />

                {topic.attachments && topic.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium">Attachments</h4>
                    {/* Render attachments here */}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{replies.length}</span>
                  </Button>
                  <span className="text-sm text-muted-foreground">{topic.views} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    {topic.isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Replies ({replies.length})</h2>
            </div>

            {replies.map((reply) => (
              <div key={reply.id} className="flex gap-4">
                <VotingSystem
                  contentId={reply.id}
                  contentType="reply"
                  initialScore={reply.score}
                  initialUserVote={reply.userVote}
                  onVote={handleVote}
                />
                <div className="flex-1">
                  <NestedReply
                    reply={reply}
                    onReply={handleReply}
                    onQuote={(reply) => setQuotedReply(reply)}
                    currentUserId={currentUserId}
                  />
                </div>
              </div>
            ))}

            {!topic.isLocked && (
              <RateLimiter action="reply" limit={10} windowMs={60000}>
                {(canReply, timeUntilReset) => (
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Leave a Reply</h3>
                        <Button variant="ghost" size="sm" onClick={() => setShowFileUpload(!showFileUpload)}>
                          <Paperclip className="h-4 w-4 mr-2" />
                          Attach Files
                        </Button>
                      </div>
                      {quotedReply && (
                        <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                          <div className="text-sm font-medium mb-1">{quotedReply.author} wrote:</div>
                          <div className="text-sm text-muted-foreground">{quotedReply.content}</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setQuotedReply(null)}
                            className="mt-2 h-6 px-2 text-xs"
                          >
                            Remove Quote
                          </Button>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <RichTextEditorWithMentions
                        value={replyContent}
                        onChange={setReplyContent}
                        placeholder="Write your reply here..."
                        minHeight="150px"
                      />

                      {showFileUpload && (
                        <div className="mt-4">
                          <FileUpload onFilesChange={setAttachedFiles} maxFiles={3} maxFileSize={5} />
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end border-t pt-4">
                      <Button onClick={handleTopicReply} disabled={isSubmitting || !replyContent.trim() || !canReply}>
                        {isSubmitting ? "Posting..." : "Post Reply"}
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </RateLimiter>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
