import Link from "next/link"
import { MessageSquare, Eye } from "lucide-react"

interface UserTopicsProps {
  username: string
}

export function UserTopics({ username }: UserTopicsProps) {
  // In a real app, you would fetch topics created by this user
  const topics = [
    {
      id: "1",
      title: "New community garden proposal for Oak Street Park",
      category: "Community Projects",
      replies: 24,
      views: 156,
      lastActive: "5 minutes ago",
    },
    {
      id: "2",
      title: "Weekend farmers market is expanding with new vendors",
      category: "Local News & Events",
      replies: 18,
      views: 103,
      lastActive: "35 minutes ago",
    },
    {
      id: "3",
      title: "Recommendations for reliable local plumbers?",
      category: "Recommendations",
      replies: 12,
      views: 87,
      lastActive: "2 hours ago",
    },
  ]

  if (topics.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No topics created yet.</div>
  }

  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <div key={topic.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
          <div className="space-y-2">
            <Link href={`/topic/${topic.id}`} className="font-medium hover:underline">
              {topic.title}
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href={`/category/${topic.category.toLowerCase().replace(/\s+/g, "-")}`} className="hover:underline">
                {topic.category}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{topic.replies}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{topic.views}</span>
            </div>
            <div className="text-primary">{topic.lastActive}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
