import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb } from "@/components/breadcrumb"
import { LayoutGrid, Users, Calendar, ShoppingBag, HelpCircle } from "lucide-react"

export default function CategoriesPage() {
  const categories = [
    {
      id: "local-news",
      title: "Local News & Events",
      description: "Discuss the latest happenings in our community",
      icon: <Calendar className="h-6 w-6" />,
      topicCount: 24,
      postCount: 186,
      subcategories: [
        { name: "Announcements", topicCount: 8, postCount: 42 },
        { name: "Upcoming Events", topicCount: 12, postCount: 87 },
        { name: "Local Politics", topicCount: 15, postCount: 124 },
        { name: "School News", topicCount: 9, postCount: 53 },
      ],
    },
    {
      id: "recommendations",
      title: "Recommendations",
      description: "Ask for and share local business recommendations",
      icon: <HelpCircle className="h-6 w-6" />,
      topicCount: 18,
      postCount: 143,
      subcategories: [
        { name: "Restaurants", topicCount: 14, postCount: 98 },
        { name: "Contractors", topicCount: 7, postCount: 42 },
        { name: "Healthcare", topicCount: 5, postCount: 31 },
        { name: "Entertainment", topicCount: 8, postCount: 47 },
      ],
    },
    {
      id: "community-projects",
      title: "Community Projects",
      description: "Collaborate on initiatives to improve our neighborhood",
      icon: <Users className="h-6 w-6" />,
      topicCount: 12,
      postCount: 97,
      subcategories: [
        { name: "Volunteering", topicCount: 5, postCount: 28 },
        { name: "Fundraisers", topicCount: 4, postCount: 19 },
        { name: "Neighborhood Improvement", topicCount: 8, postCount: 53 },
        { name: "Education", topicCount: 3, postCount: 17 },
      ],
    },
    {
      id: "buy-sell-trade",
      title: "Buy, Sell & Trade",
      description: "Local marketplace for community members",
      icon: <ShoppingBag className="h-6 w-6" />,
      topicCount: 31,
      postCount: 210,
      subcategories: [
        { name: "For Sale", topicCount: 18, postCount: 124 },
        { name: "Wanted", topicCount: 7, postCount: 35 },
        { name: "Free Items", topicCount: 12, postCount: 67 },
        { name: "Services Offered", topicCount: 8, postCount: 43 },
      ],
    },
    {
      id: "general-discussion",
      title: "General Discussion",
      description: "Chat about anything else on your mind",
      icon: <LayoutGrid className="h-6 w-6" />,
      topicCount: 42,
      postCount: 356,
      subcategories: [
        { name: "Introductions", topicCount: 15, postCount: 87 },
        { name: "Off-Topic", topicCount: 23, postCount: 156 },
        { name: "Hobbies", topicCount: 18, postCount: 124 },
        { name: "Tech Talk", topicCount: 12, postCount: 89 },
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Categories" }]} />

      <h1 className="text-3xl font-bold mb-6">Forum Categories</h1>

      <div className="space-y-8">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-primary/10">{category.icon}</div>
                <div>
                  <CardTitle>
                    <Link href={`/category/${category.id}`} className="hover:underline">
                      {category.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.name}
                    href={`/category/${category.id}/${subcategory.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="font-medium">{subcategory.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {subcategory.topicCount} topics • {subcategory.postCount} posts
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <Link href={`/category/${category.id}`} className="hover:underline">
                  View all {category.topicCount} topics with {category.postCount} posts
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
