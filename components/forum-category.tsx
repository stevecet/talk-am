import Link from "next/link"
import { MessageSquare, Users } from "lucide-react"

interface ForumCategoryProps {
  id: string
  title: string
  description: string
  topicCount: number
  postCount: number
  lastActive: string
}

export function ForumCategory({ id, title, description, topicCount, postCount, lastActive }: ForumCategoryProps) {
  return (
    <Link href={`/category/${id}`}>
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        <div className="flex flex-row md:flex-col gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{topicCount} topics</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{postCount} posts</span>
          </div>
          <div className="text-sm">
            <span className="text-primary">Active: {lastActive}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
