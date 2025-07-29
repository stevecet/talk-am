"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, CalendarIcon, User, MessageSquare, Tag, SlidersHorizontal } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

export function AdvancedSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = React.useState(searchParams.get("q") || "")
  const [category, setCategory] = React.useState(searchParams.get("category") || "all")
  const [author, setAuthor] = React.useState(searchParams.get("author") || "")
  const [dateFrom, setDateFrom] = React.useState<Date | undefined>(
    searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined,
  )
  const [dateTo, setDateTo] = React.useState<Date | undefined>(
    searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined,
  )
  const [contentType, setContentType] = React.useState(searchParams.get("type") || "all")
  const [sortBy, setSortBy] = React.useState(searchParams.get("sort") || "relevance")
  const [tags, setTags] = React.useState<string[]>(searchParams.get("tags")?.split(",") || [])
  const [showAdvanced, setShowAdvanced] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  // Mock search results
  const [searchResults, setSearchResults] = React.useState<any[]>([])
  const [totalResults, setTotalResults] = React.useState(0)

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "local-news", label: "Local News & Events" },
    { value: "recommendations", label: "Recommendations" },
    { value: "community-projects", label: "Community Projects" },
    { value: "buy-sell-trade", label: "Buy, Sell & Trade" },
    { value: "general-discussion", label: "General Discussion" },
  ]

  const availableTags = [
    "Community",
    "Gardening",
    "Parks",
    "Volunteering",
    "Events",
    "Business",
    "Education",
    "Healthcare",
    "Technology",
    "Environment",
    "Safety",
    "Transportation",
  ]

  const mockResults = [
    {
      id: "1",
      type: "topic",
      title: "New community garden proposal for Oak Street Park",
      content: "I'd like to propose a community garden project for the unused space in Oak Street Park...",
      author: {
        name: "Sarah Johnson",
        username: "sarah-johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SJ",
      },
      category: "Community Projects",
      createdAt: "2024-01-15T10:30:00Z",
      replies: 24,
      views: 156,
      tags: ["Community", "Gardening", "Parks"],
    },
    {
      id: "2",
      type: "reply",
      title: "Re: Best local restaurants for families",
      content: "I highly recommend The Garden Bistro on Main Street. They have excellent kids' menu...",
      author: {
        name: "Michael Chen",
        username: "michael-chen",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "MC",
      },
      category: "Recommendations",
      createdAt: "2024-01-14T15:20:00Z",
      topicTitle: "Best local restaurants for families",
      tags: ["Business", "Food"],
    },
    {
      id: "3",
      type: "topic",
      title: "Volunteer opportunities at the community center",
      content: "The community center is looking for volunteers to help with various programs...",
      author: {
        name: "Taylor Wilson",
        username: "taylor-wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "TW",
      },
      category: "Community Projects",
      createdAt: "2024-01-13T09:45:00Z",
      replies: 18,
      views: 89,
      tags: ["Volunteering", "Community", "Events"],
    },
  ]

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    setIsLoading(true)

    // Build search parameters
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (category !== "all") params.set("category", category)
    if (author) params.set("author", author)
    if (dateFrom) params.set("from", dateFrom.toISOString())
    if (dateTo) params.set("to", dateTo.toISOString())
    if (contentType !== "all") params.set("type", contentType)
    if (sortBy !== "relevance") params.set("sort", sortBy)
    if (tags.length > 0) params.set("tags", tags.join(","))

    // Update URL
    router.push(`/search?${params.toString()}`)

    // Mock search API call
    setTimeout(() => {
      // Filter mock results based on search criteria
      const filteredResults = mockResults.filter((result) => {
        const matchesQuery =
          !query ||
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.content.toLowerCase().includes(query.toLowerCase())

        const matchesCategory = category === "all" || result.category.toLowerCase().replace(/\s+/g, "-") === category

        const matchesAuthor =
          !author ||
          result.author.name.toLowerCase().includes(author.toLowerCase()) ||
          result.author.username.toLowerCase().includes(author.toLowerCase())

        const matchesType = contentType === "all" || result.type === contentType

        const matchesTags = tags.length === 0 || tags.some((tag) => result.tags.includes(tag))

        return matchesQuery && matchesCategory && matchesAuthor && matchesType && matchesTags
      })

      // Sort results
      if (sortBy === "date") {
        filteredResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      } else if (sortBy === "replies") {
        filteredResults.sort((a, b) => (b.replies || 0) - (a.replies || 0))
      }

      setSearchResults(filteredResults)
      setTotalResults(filteredResults.length)
      setIsLoading(false)
    }, 500)
  }

  const handleTagToggle = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setQuery("")
    setCategory("all")
    setAuthor("")
    setDateFrom(undefined)
    setDateTo(undefined)
    setContentType("all")
    setSortBy("relevance")
    setTags([])
    setSearchResults([])
    setTotalResults(0)
    router.push("/search")
  }

  // Perform search on component mount if there are search params
  React.useEffect(() => {
    if (searchParams.get("q")) {
      handleSearch()
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Forum</h1>
          <p className="text-muted-foreground">Find topics, replies, and users across the community</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Search topics, replies, and users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="text-base"
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Searching..." : "Search"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAdvanced(!showAdvanced)}>
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Content Type</Label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Content</SelectItem>
                        <SelectItem value="topic">Topics Only</SelectItem>
                        <SelectItem value="reply">Replies Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="replies">Most Replies</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Author</Label>
                    <Input
                      placeholder="Username or display name"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Date From</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Date To</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="md:col-span-2 lg:col-span-3">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {availableTags.map((tag) => (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox
                            id={tag}
                            checked={tags.includes(tag)}
                            onCheckedChange={() => handleTagToggle(tag)}
                          />
                          <Label htmlFor={tag} className="text-sm font-normal">
                            {tag}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2 lg:col-span-3 flex gap-2">
                    <Button type="submit" disabled={isLoading}>
                      Apply Filters
                    </Button>
                    <Button type="button" variant="outline" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {totalResults > 0 && (
          <div className="mb-4">
            <p className="text-muted-foreground">
              Found {totalResults} result{totalResults !== 1 ? "s" : ""}
              {query && ` for "${query}"`}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {searchResults.map((result) => (
            <Card key={result.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={result.author.avatar || "/placeholder.svg"} alt={result.author.name} />
                    <AvatarFallback>{result.author.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{result.type}</Badge>
                      <Badge variant="secondary">{result.category}</Badge>
                      {result.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div>
                      <Link href={`/${result.type}/${result.id}`} className="font-semibold hover:underline text-lg">
                        {result.title}
                      </Link>
                      {result.topicTitle && (
                        <p className="text-sm text-muted-foreground">in topic: {result.topicTitle}</p>
                      )}
                    </div>
                    <p className="text-muted-foreground line-clamp-2">{result.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Link href={`/profile/${result.author.username}`} className="hover:underline">
                        <User className="h-4 w-4 inline mr-1" />
                        {result.author.name}
                      </Link>
                      <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                      {result.replies !== undefined && (
                        <span>
                          <MessageSquare className="h-4 w-4 inline mr-1" />
                          {result.replies} replies
                        </span>
                      )}
                      {result.views !== undefined && <span>{result.views} views</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {searchResults.length === 0 && totalResults === 0 && query && !isLoading && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search terms or filters</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
