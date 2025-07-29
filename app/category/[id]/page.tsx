import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TopicList } from "@/components/topic-list"
import { Breadcrumb } from "@/components/breadcrumb"
import { Pagination } from "@/components/pagination"
import { PlusCircle } from "lucide-react"

interface CategoryPageProps {
  params: {
    id: string
  }
  searchParams: {
    page?: string
    sort?: string
  }
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const currentPage = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const sort = searchParams.sort || "latest"

  // In a real app, you would fetch category data based on the ID
  const categories = {
    "local-news": {
      id: "local-news",
      title: "Local News & Events",
      description: "Discuss the latest happenings in our community",
      topicCount: 24,
      postCount: 186,
      subcategories: [
        { name: "Announcements", slug: "announcements", topicCount: 8, postCount: 42 },
        { name: "Upcoming Events", slug: "upcoming-events", topicCount: 12, postCount: 87 },
        { name: "Local Politics", slug: "local-politics", topicCount: 15, postCount: 124 },
        { name: "School News", slug: "school-news", topicCount: 9, postCount: 53 },
      ],
    },
    recommendations: {
      id: "recommendations",
      title: "Recommendations",
      description: "Ask for and share local business recommendations",
      topicCount: 18,
      postCount: 143,
      subcategories: [
        { name: "Restaurants", slug: "restaurants", topicCount: 14, postCount: 98 },
        { name: "Contractors", slug: "contractors", topicCount: 7, postCount: 42 },
        { name: "Healthcare", slug: "healthcare", topicCount: 5, postCount: 31 },
        { name: "Entertainment", slug: "entertainment", topicCount: 8, postCount: 47 },
      ],
    },
    "community-projects": {
      id: "community-projects",
      title: "Community Projects",
      description: "Collaborate on initiatives to improve our neighborhood",
      topicCount: 12,
      postCount: 97,
      subcategories: [
        { name: "Volunteering", slug: "volunteering", topicCount: 5, postCount: 28 },
        { name: "Fundraisers", slug: "fundraisers", topicCount: 4, postCount: 19 },
        { name: "Neighborhood Improvement", slug: "neighborhood-improvement", topicCount: 8, postCount: 53 },
        { name: "Education", slug: "education", topicCount: 3, postCount: 17 },
      ],
    },
    "buy-sell-trade": {
      id: "buy-sell-trade",
      title: "Buy, Sell & Trade",
      description: "Local marketplace for community members",
      topicCount: 31,
      postCount: 210,
      subcategories: [
        { name: "For Sale", slug: "for-sale", topicCount: 18, postCount: 124 },
        { name: "Wanted", slug: "wanted", topicCount: 7, postCount: 35 },
        { name: "Free Items", slug: "free-items", topicCount: 12, postCount: 67 },
        { name: "Services Offered", slug: "services-offered", topicCount: 8, postCount: 43 },
      ],
    },
    "general-discussion": {
      id: "general-discussion",
      title: "General Discussion",
      description: "Chat about anything else on your mind",
      topicCount: 42,
      postCount: 356,
      subcategories: [
        { name: "Introductions", slug: "introductions", topicCount: 15, postCount: 87 },
        { name: "Off-Topic", slug: "off-topic", topicCount: 23, postCount: 156 },
        { name: "Hobbies", slug: "hobbies", topicCount: 18, postCount: 124 },
        { name: "Tech Talk", slug: "tech-talk", topicCount: 12, postCount: 89 },
      ],
    },
  }

  const category = categories[params.id as keyof typeof categories] || {
    id: params.id,
    title: "Category Not Found",
    description: "This category does not exist",
    topicCount: 0,
    postCount: 0,
    subcategories: [],
  }

  // Calculate total pages based on topic count (10 topics per page)
  const totalPages = Math.ceil(category.topicCount / 10)

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Categories", href: "/categories" }, { label: category.title }]} />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{category.title}</h1>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
          <Link href={`/category/${params.id}/new-topic`}>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Topic
            </Button>
          </Link>
        </div>

        {category.subcategories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Subcategories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.slug}
                    href={`/category/${params.id}/${subcategory.slug}`}
                    className="p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="font-medium">{subcategory.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {subcategory.topicCount} topics • {subcategory.postCount} posts
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Topics</CardTitle>
                <CardDescription>
                  {category.topicCount} topics, {category.postCount} posts
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={sort} className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="latest" asChild>
                    <Link href={`/category/${params.id}?sort=latest`}>Latest</Link>
                  </TabsTrigger>
                  <TabsTrigger value="popular" asChild>
                    <Link href={`/category/${params.id}?sort=popular`}>Popular</Link>
                  </TabsTrigger>
                  <TabsTrigger value="unanswered" asChild>
                    <Link href={`/category/${params.id}?sort=unanswered`}>Unanswered</Link>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={sort} className="mt-0">
                <TopicList
                  categoryId={params.id}
                  sort={sort as "latest" | "popular" | "unanswered"}
                  page={currentPage}
                />
              </TabsContent>
            </Tabs>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl={`/category/${params.id}?sort=${sort}`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
