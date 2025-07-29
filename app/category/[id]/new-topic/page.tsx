"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumb } from "@/components/breadcrumb"
import { RichTextEditor } from "@/components/rich-text-editor"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface NewTopicPageProps {
  params: {
    id: string
  }
}

export default function NewTopicPage({ params }: NewTopicPageProps) {
  const router = useRouter()
  const [title, setTitle] = React.useState("")
  const [content, setContent] = React.useState("")
  const [subcategory, setSubcategory] = React.useState("")
  const [tags, setTags] = React.useState("")
  const [error, setError] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  // Mock category data - in a real app, this would be fetched
  const categories = {
    "local-news": {
      title: "Local News & Events",
      subcategories: ["Announcements", "Upcoming Events", "Local Politics", "School News"],
    },
    recommendations: {
      title: "Recommendations",
      subcategories: ["Restaurants", "Contractors", "Healthcare", "Entertainment"],
    },
    "community-projects": {
      title: "Community Projects",
      subcategories: ["Volunteering", "Fundraisers", "Neighborhood Improvement", "Education"],
    },
    "buy-sell-trade": {
      title: "Buy, Sell & Trade",
      subcategories: ["For Sale", "Wanted", "Free Items", "Services Offered"],
    },
    "general-discussion": {
      title: "General Discussion",
      subcategories: ["Introductions", "Off-Topic", "Hobbies", "Tech Talk"],
    },
  }

  const category = categories[params.id as keyof typeof categories]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Please enter a topic title")
      return
    }

    if (!content.trim()) {
      setError("Please enter some content for your topic")
      return
    }

    setIsLoading(true)

    try {
      // Mock topic creation - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you'd get the new topic ID from the API response
      const newTopicId = Math.random().toString(36).substr(2, 9)
      router.push(`/topic/${newTopicId}`)
    } catch (err) {
      setError("Failed to create topic. Please try again.")
      setIsLoading(false)
    }
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <Link href="/categories">
            <Button>Back to Categories</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Categories", href: "/categories" },
          { label: category.title, href: `/category/${params.id}` },
          { label: "New Topic" },
        ]}
      />

      <div className="flex items-center gap-4 mb-6">
        <Link href={`/category/${params.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {category.title}
          </Button>
        </Link>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Create New Topic</CardTitle>
          <CardDescription>Start a new discussion in {category.title}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Topic Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for your topic"
                maxLength={200}
                required
              />
              <div className="text-xs text-muted-foreground">{title.length}/200 characters</div>
            </div>

            {category.subcategories.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory (Optional)</Label>
                <Select value={subcategory} onValueChange={setSubcategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {category.subcategories.map((sub) => (
                      <SelectItem key={sub} value={sub.toLowerCase().replace(/\s+/g, "-")}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Optional)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags separated by commas (e.g., gardening, community, volunteering)"
              />
              <div className="text-xs text-muted-foreground">
                Separate multiple tags with commas. Tags help others find your topic.
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your topic content here. You can use markdown formatting..."
                minHeight="300px"
              />
              <div className="text-xs text-muted-foreground">
                You can use **bold**, *italic*, `code`, [links](url), and other markdown formatting.
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Link href={`/category/${params.id}`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating Topic..." : "Create Topic"}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
