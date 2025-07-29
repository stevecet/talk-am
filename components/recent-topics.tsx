import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function RecentTopics() {
  const recentTopics = [
    {
      id: "1",
      title: "New community garden proposal for Oak Street Park",
      category: "Community Projects",
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SJ",
      },
      replies: 24,
      views: 156,
      lastActive: "5 minutes ago",
      isHot: true,
    },
    {
      id: "2",
      title: "Weekend farmers market is expanding with new vendors",
      category: "Local News & Events",
      author: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "MC",
      },
      replies: 18,
      views: 103,
      lastActive: "35 minutes ago",
      isHot: false,
    },
    {
      id: "3",
      title: "Recommendations for reliable local plumbers?",
      category: "Recommendations",
      author: {
        name: "Taylor Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "TW",
      },
      replies: 12,
      views: 87,
      lastActive: "2 hours ago",
      isHot: false,
    },
    {
      id: "4",
      title: "Selling gently used patio furniture - pickup only",
      category: "Buy, Sell & Trade",
      author: {
        name: "Jamie Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "JR",
      },
      replies: 7,
      views: 64,
      lastActive: "3 hours ago",
      isHot: false,
    },
    {
      id: "5",
      title: "City council meeting highlights - important zoning changes",
      category: "Local News & Events",
      author: {
        name: "Alex Thompson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AT",
      },
      replies: 31,
      views: 212,
      lastActive: "1 hour ago",
      isHot: true,
    },
  ]

  return (
    <div className="space-y-4">
      {recentTopics.map((topic) => (
        <div key={topic.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-1">
              <Link href={`/topic/${topic.id}`} className="font-medium hover:underline">
                {topic.title}
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link
                  href={`/category/${topic.category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="hover:underline"
                >
                  {topic.category}
                </Link>
                {topic.isHot && (
                  <Badge variant="destructive" className="text-xs py-0">
                    Hot
                  </Badge>
                )}
              </div>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src={topic.author.avatar || "/placeholder.svg"} alt={topic.author.name} />
              <AvatarFallback>{topic.author.initials}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="text-muted-foreground">
              By{" "}
              <Link
                href={`/profile/${topic.author.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="hover:underline"
              >
                {topic.author.name}
              </Link>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>{topic.replies} replies</span>
              <span>{topic.views} views</span>
              <span className="text-primary">{topic.lastActive}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
