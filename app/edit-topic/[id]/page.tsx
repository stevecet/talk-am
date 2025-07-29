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

interface EditTopicPageProps {
  params: {
    id: string
  }
}

export default function EditTopicPage({ params }: EditTopicPageProps) {
  const router = useRouter()

  // Mock topic data - in a real app, this would be fetched
  const [topic, setTopic] = React.useState({
    id: params.id,
    title: "New community garden proposal for Oak Street Park",
    content: `Hello neighbors!

I'd like to propose a community garden project for the unused space in Oak Street Park. The area behind the playground has about 2,000 square feet that could be converted into garden plots for residents.

**Benefits would include:**
- Fresh produce for community members
- Educational opportunities for local schools
- Beautification of currently unused space
- Community building and social connections

I've already spoken with a few city council members who seem supportive, but we'd need community backing to move forward. I'm thinking we could have around 20 plots, a shared tool shed, and a small seating area.

What do you all think? Would anyone be interested in helping organize this or having a garden plot?`,
    category: {
      id: "community-projects",
      name: "Community Projects",
    },
    subcategory: "volunteering",
    tags: "Community, Gardening, Parks, Volunteering",
  })

  const [title, setTitle] = React.useState(topic.title)
  const [content, setContent] = React.useState(topic.content)
  const [subcategory, setSubcategory] = React.useState(topic.subcategory)
  const [tags, setTags] = React.useState(topic.tags)
  const [error, setError] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const subcategories = ["Volunteering", "Fundraisers", "Neighborhood Improvement", "Education"]

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
      // Mock topic update - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push(`/topic/${params.id}`)
    } catch (err) {
      setError("Failed to update topic. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Categories", href: "/categories" },
          { label: topic.category.name, href: `/category/${topic.category.id}` },
          { label: topic.title, href: `/topic/${params.id}` },
          { label: "Edit" },
        ]}
      />

      <div className="flex items-center gap-4 mb-6">
        <Link href={`/topic/${params.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Topic
          </Button>
        </Link>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Edit Topic</CardTitle>
          <CardDescription>Make changes to your topic in {topic.category.name}</CardDescription>
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

            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory (Optional)</Label>
              <Select value={subcategory} onValueChange={setSubcategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((sub) => (
                    <SelectItem key={sub} value={sub.toLowerCase().replace(/\s+/g, "-")}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Optional)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your topic content here..."
                minHeight="300px"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Link href={`/topic/${params.id}`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
