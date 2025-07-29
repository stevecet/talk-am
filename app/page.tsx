import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ForumCategory } from "@/components/forum-category"
import { RecentTopics } from "@/components/recent-topics"
import { UserStats } from "@/components/user-stats"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted rounded-lg px-4 md:px-8">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Welcome to LocalTalk</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Join our community-driven platform to discuss local topics and connect with neighbors.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/auth/register">
                  <Button size="lg">Join the Community</Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Forum Categories</CardTitle>
                <CardDescription>Browse discussions by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ForumCategory
                  id="local-news"
                  title="Local News & Events"
                  description="Discuss the latest happenings in our community"
                  topicCount={24}
                  postCount={186}
                  lastActive="2 minutes ago"
                />
                <ForumCategory
                  id="recommendations"
                  title="Recommendations"
                  description="Ask for and share local business recommendations"
                  topicCount={18}
                  postCount={143}
                  lastActive="35 minutes ago"
                />
                <ForumCategory
                  id="community-projects"
                  title="Community Projects"
                  description="Collaborate on initiatives to improve our neighborhood"
                  topicCount={12}
                  postCount={97}
                  lastActive="2 hours ago"
                />
                <ForumCategory
                  id="buy-sell-trade"
                  title="Buy, Sell & Trade"
                  description="Local marketplace for community members"
                  topicCount={31}
                  postCount={210}
                  lastActive="15 minutes ago"
                />
                <ForumCategory
                  id="general-discussion"
                  title="General Discussion"
                  description="Chat about anything else on your mind"
                  topicCount={42}
                  postCount={356}
                  lastActive="Just now"
                />
              </CardContent>
              <CardFooter>
                <Link href="/categories">
                  <Button variant="outline">View All Categories</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Discussions</CardTitle>
                <CardDescription>Join the conversation</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTopics />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Members:</span>
                  <span className="font-medium">1,245</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Topics:</span>
                  <span className="font-medium">3,872</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Posts:</span>
                  <span className="font-medium">27,634</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Online now:</span>
                  <span className="font-medium">42</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Members</CardTitle>
              </CardHeader>
              <CardContent>
                <UserStats />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
