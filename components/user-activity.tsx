import Link from "next/link"
import { MessageCircle } from "lucide-react"

interface UserActivityProps {
  username: string
}

export function UserActivity({ username }: UserActivityProps) {
  // In a real app, you would fetch recent activity for this user
  const activities = [
    {
      id: "1",
      type: "reply",
      content: "I think this is a great idea! I'd be happy to volunteer some time to help get this started.",
      topic: {
        id: "101",
        title: "New community garden proposal for Oak Street Park",
      },
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      type: "reply",
      content: "The farmers market has been such a great addition to our community. I'm excited to see it growing!",
      topic: {
        id: "102",
        title: "Weekend farmers market is expanding with new vendors",
      },
      timestamp: "1 day ago",
    },
    {
      id: "3",
      type: "reply",
      content:
        "I used Smith Plumbing last month for a bathroom renovation and they were excellent. On time, professional, and reasonably priced.",
      topic: {
        id: "103",
        title: "Recommendations for reliable local plumbers?",
      },
      timestamp: "3 days ago",
    },
  ]

  if (activities.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No recent activity.</div>
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-start gap-3">
            <MessageCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-2 flex-1">
              <div>
                <span className="text-muted-foreground">Replied to </span>
                <Link href={`/topic/${activity.topic.id}`} className="font-medium hover:underline">
                  {activity.topic.title}
                </Link>
              </div>
              <div className="text-sm bg-muted/50 p-3 rounded-lg">{activity.content}</div>
              <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
