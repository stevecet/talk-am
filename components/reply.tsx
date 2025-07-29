import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CalendarDays, Heart, Flag, ReplyIcon } from "lucide-react"

interface ReplyProps {
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
    likes: number
  }
}

export function Reply({ reply }: ReplyProps) {
  return (
    <Card id={`reply-${reply.id}`}>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
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
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: reply.content }} />
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-1">
            <Heart className="h-4 w-4" />
            <span>{reply.likes}</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <ReplyIcon className="h-4 w-4 mr-1" />
            <span>Quote</span>
          </Button>
          <Button variant="ghost" size="sm">
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
