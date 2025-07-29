import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserStats() {
  const activeUsers = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SJ",
      postCount: 156,
      joinDate: "Mar 2022",
    },
    {
      id: "2",
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MC",
      postCount: 89,
      joinDate: "Jan 2023",
    },
    {
      id: "3",
      name: "Taylor Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "TW",
      postCount: 124,
      joinDate: "Aug 2022",
    },
    {
      id: "4",
      name: "Jamie Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JR",
      postCount: 67,
      joinDate: "Nov 2023",
    },
    {
      id: "5",
      name: "Alex Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AT",
      postCount: 213,
      joinDate: "Feb 2022",
    },
  ]

  return (
    <div className="space-y-4">
      {activeUsers.map((user) => (
        <Link key={user.id} href={`/profile/${user.name.toLowerCase().replace(/\s+/g, "-")}`}>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">
                {user.postCount} posts • Joined {user.joinDate}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
