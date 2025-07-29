import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserTopics } from "@/components/user-topics"
import { UserActivity } from "@/components/user-activity"
import { CalendarDays, MapPin, Mail, LinkIcon, Edit } from "lucide-react"

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  // In a real app, you would fetch user data based on the username
  const user = {
    id: "1",
    username: params.username,
    displayName: "Sarah Johnson",
    avatar: "/placeholder.svg?height=128&width=128",
    initials: "SJ",
    bio: "Community organizer and local business advocate. I love connecting neighbors and building a stronger community through meaningful discussions.",
    location: "Portland, OR",
    website: "sarahjohnson.com",
    email: "sarah@example.com",
    joinDate: "March 15, 2022",
    postCount: 156,
    topicCount: 24,
    isCurrentUser: false,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="relative pb-0">
          <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10 rounded-t-lg"></div>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12 md:-mt-16 px-4 md:px-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.displayName} />
              <AvatarFallback className="text-2xl">{user.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1 pb-4">
              <CardTitle className="text-2xl md:text-3xl">{user.displayName}</CardTitle>
              <CardDescription className="text-base">@{user.username}</CardDescription>
            </div>
            {user.isCurrentUser ? (
              <Button className="ml-auto" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <Button className="ml-auto" size="sm">
                Follow
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">About</h3>
                <p className="text-muted-foreground">{user.bio}</p>
                <div className="space-y-2">
                  {user.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <LinkIcon className="h-4 w-4" />
                      <a
                        href={`https://${user.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {user.website}
                      </a>
                    </div>
                  )}
                  {user.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${user.email}`} className="hover:underline">
                        {user.email}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>Joined {user.joinDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="bg-muted px-4 py-2 rounded-lg">
                  <div className="font-medium">{user.postCount}</div>
                  <div className="text-xs text-muted-foreground">Posts</div>
                </div>
                <div className="bg-muted px-4 py-2 rounded-lg">
                  <div className="font-medium">{user.topicCount}</div>
                  <div className="text-xs text-muted-foreground">Topics</div>
                </div>
                <div className="bg-muted px-4 py-2 rounded-lg">
                  <div className="font-medium">42</div>
                  <div className="text-xs text-muted-foreground">Following</div>
                </div>
                <div className="bg-muted px-4 py-2 rounded-lg">
                  <div className="font-medium">128</div>
                  <div className="text-xs text-muted-foreground">Followers</div>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <Tabs defaultValue="topics">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="topics">Topics</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="likes">Likes</TabsTrigger>
                </TabsList>
                <TabsContent value="topics" className="mt-4">
                  <UserTopics username={user.username} />
                </TabsContent>
                <TabsContent value="activity" className="mt-4">
                  <UserActivity username={user.username} />
                </TabsContent>
                <TabsContent value="likes" className="mt-4">
                  <div className="p-4 text-center text-muted-foreground">No liked posts yet.</div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
