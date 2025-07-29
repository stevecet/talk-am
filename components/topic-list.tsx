import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface TopicListProps {
  categoryId: string
  sort: "latest" | "popular" | "unanswered"
  page?: number
}

export function TopicList({ categoryId, sort, page = 1 }: TopicListProps) {
  // In a real app, you would fetch topics based on the category, sort, and page
  // This is mock data
  const allTopics = [
    {
      id: "1",
      title: "New community garden proposal for Oak Street Park",
      isPinned: true,
      isLocked: false,
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SJ",
      },
      replies: 24,
      views: 156,
      lastReply: {
        author: {
          name: "Michael Chen",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "MC",
        },
        timestamp: "5 minutes ago",
      },
      createdAt: "June 15, 2023",
    },
    {
      id: "2",
      title: "Weekend farmers market is expanding with new vendors",
      isPinned: false,
      isLocked: false,
      author: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "MC",
      },
      replies: 18,
      views: 103,
      lastReply: {
        author: {
          name: "Taylor Wilson",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "TW",
        },
        timestamp: "35 minutes ago",
      },
      createdAt: "June 18, 2023",
    },
    {
      id: "3",
      title: "Recommendations for reliable local plumbers?",
      isPinned: false,
      isLocked: false,
      author: {
        name: "Taylor Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "TW",
      },
      replies: 12,
      views: 87,
      lastReply: {
        author: {
          name: "Jamie Rodriguez",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "JR",
        },
        timestamp: "2 hours ago",
      },
      createdAt: "June 20, 2023",
    },
    {
      id: "4",
      title: "Selling gently used patio furniture - pickup only",
      isPinned: false,
      isLocked: false,
      author: {
        name: "Jamie Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "JR",
      },
      replies: 7,
      views: 64,
      lastReply: {
        author: {
          name: "Alex Thompson",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "AT",
        },
        timestamp: "3 hours ago",
      },
      createdAt: "June 22, 2023",
    },
    {
      id: "5",
      title: "City council meeting highlights - important zoning changes",
      isPinned: false,
      isLocked: true,
      author: {
        name: "Alex Thompson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AT",
      },
      replies: 31,
      views: 212,
      lastReply: {
        author: {
          name: "Sarah Johnson",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "SJ",
        },
        timestamp: "1 day ago",
      },
      createdAt: "June 25, 2023",
    },
    {
      id: "6",
      title: "New bike lanes proposed for Main Street - community feedback needed",
      isPinned: false,
      isLocked: false,
      author: {
        name: "Robin Lee",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "RL",
      },
      replies: 42,
      views: 278,
      lastReply: {
        author: {
          name: "Casey Morgan",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "CM",
        },
        timestamp: "4 hours ago",
      },
      createdAt: "June 27, 2023",
    },
    {
      id: "7",
      title: "Local school fundraiser - volunteers needed",
      isPinned: false,
      isLocked: false,
      author: {
        name: "Jordan Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "JS",
      },
      replies: 15,
      views: 124,
      lastReply: {
        author: {
          name: "Taylor Wilson",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "TW",
        },
        timestamp: "12 hours ago",
      },
      createdAt: "June 28, 2023",
    },
    {
      id: "8",
      title: "Best coffee shops for remote work?",
      isPinned: false,
      isLocked: false,
      author: {
        name: "Casey Morgan",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "CM",
      },
      replies: 23,
      views: 187,
      lastReply: {
        author: {
          name: "Robin Lee",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "RL",
        },
        timestamp: "6 hours ago",
      },
      createdAt: "June 30, 2023",
    },
    {
      id: "9",
      title: "Monthly neighborhood cleanup - July schedule",
      isPinned: false,
      isLocked: false,
      author: {
        name: "Alex Thompson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AT",
      },
      replies: 8,
      views: 76,
      lastReply: {
        author: {
          name: "Jordan Smith",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "JS",
        },
        timestamp: "1 day ago",
      },
      createdAt: "July 1, 2023",
    },
    {
      id: "10",
      title: "New restaurant opening downtown - anyone tried it yet?",
      isPinned: false,
      isLocked: false,
      author: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "MC",
      },
      replies: 19,
      views: 145,
      lastReply: {
        author: {
          name: "Sarah Johnson",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "SJ",
        },
        timestamp: "8 hours ago",
      },
      createdAt: "July 3, 2023",
    },
  ]

  // Sort topics based on the selected sort option
  let topics = [...allTopics]

  // Always show pinned topics first
  const pinnedTopics = topics.filter((topic) => topic.isPinned)
  const nonPinnedTopics = topics.filter((topic) => !topic.isPinned)

  // Sort non-pinned topics
  if (sort === "latest") {
    nonPinnedTopics.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else if (sort === "popular") {
    nonPinnedTopics.sort((a, b) => b.views - a.views)
  } else if (sort === "unanswered") {
    nonPinnedTopics.sort((a, b) => a.replies - b.replies)
  }

  // Combine pinned and non-pinned topics
  topics = [...pinnedTopics, ...nonPinnedTopics]

  // Paginate topics (10 per page)
  const startIndex = (page - 1) * 10
  const paginatedTopics = topics.slice(startIndex, startIndex + 10)

  if (paginatedTopics.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No topics found in this category.</div>
  }

  return (
    <div className="space-y-4">
      {paginatedTopics.map((topic) => (
        <div key={topic.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Link href={`/topic/${topic.id}`} className="font-medium hover:underline">
                  {topic.title}
                </Link>
                {topic.isPinned && <Badge variant="outline">Pinned</Badge>}
                {topic.isLocked && <Badge variant="outline">Locked</Badge>}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Started by</span>
                <Link
                  href={`/profile/${topic.author.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center gap-1 hover:underline"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={topic.author.avatar || "/placeholder.svg"} alt={topic.author.name} />
                    <AvatarFallback>{topic.author.initials}</AvatarFallback>
                  </Avatar>
                  <span>{topic.author.name}</span>
                </Link>
                <span>• {topic.createdAt}</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground text-right">
              <div>{topic.replies} replies</div>
              <div>{topic.views} views</div>
            </div>
          </div>
          <div className="flex justify-end items-center gap-2 mt-4 text-sm">
            <span className="text-muted-foreground">Last reply by</span>
            <Link
              href={`/profile/${topic.lastReply.author.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex items-center gap-1 hover:underline"
            >
              <Avatar className="h-5 w-5">
                <AvatarImage
                  src={topic.lastReply.author.avatar || "/placeholder.svg"}
                  alt={topic.lastReply.author.name}
                />
                <AvatarFallback>{topic.lastReply.author.initials}</AvatarFallback>
              </Avatar>
              <span>{topic.lastReply.author.name}</span>
            </Link>
            <span className="text-primary">{topic.lastReply.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
