"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PermissionGuard } from "@/components/permission-guard"
import { Edit, Trash2, MoreHorizontal, FolderPlus, MessageSquare, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Category {
  id: string
  name: string
  description: string
  slug: string
  topicCount: number
  postCount: number
  isActive: boolean
  sortOrder: number
  createdAt: string
}

export default function CategoriesManagementPage() {
  const [categories, setCategories] = React.useState<Category[]>([
    {
      id: "1",
      name: "Local News & Events",
      description: "Discuss the latest happenings in our community",
      slug: "local-news",
      topicCount: 24,
      postCount: 186,
      isActive: true,
      sortOrder: 1,
      createdAt: "2022-01-15T10:00:00Z",
    },
    {
      id: "2",
      name: "Recommendations",
      description: "Ask for and share local business recommendations",
      slug: "recommendations",
      topicCount: 18,
      postCount: 143,
      isActive: true,
      sortOrder: 2,
      createdAt: "2022-01-15T10:00:00Z",
    },
    {
      id: "3",
      name: "Community Projects",
      description: "Collaborate on initiatives to improve our neighborhood",
      slug: "community-projects",
      topicCount: 12,
      postCount: 97,
      isActive: true,
      sortOrder: 3,
      createdAt: "2022-01-15T10:00:00Z",
    },
  ])

  const [showCreateDialog, setShowCreateDialog] = React.useState(false)
  const [showEditDialog, setShowEditDialog] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null)
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    slug: "",
  })

  const handleCreate = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
      topicCount: 0,
      postCount: 0,
      isActive: true,
      sortOrder: categories.length + 1,
      createdAt: new Date().toISOString(),
    }

    setCategories([...categories, newCategory])
    setShowCreateDialog(false)
    setFormData({ name: "", description: "", slug: "" })
  }

  const handleEdit = () => {
    if (!selectedCategory) return

    setCategories(
      categories.map((cat) =>
        cat.id === selectedCategory.id
          ? {
              ...cat,
              name: formData.name,
              description: formData.description,
              slug: formData.slug,
            }
          : cat,
      ),
    )

    setShowEditDialog(false)
    setSelectedCategory(null)
    setFormData({ name: "", description: "", slug: "" })
  }

  const handleDelete = () => {
    if (!selectedCategory) return

    setCategories(categories.filter((cat) => cat.id !== selectedCategory.id))
    setShowDeleteDialog(false)
    setSelectedCategory(null)
  }

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      slug: category.slug,
    })
    setShowEditDialog(true)
  }

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category)
    setShowDeleteDialog(true)
  }

  const toggleCategoryStatus = (categoryId: string) => {
    setCategories(categories.map((cat) => (cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat)))
  }

  return (
    <PermissionGuard permission="manage_categories">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Category Management</h1>
            <p className="text-muted-foreground">Organize forum discussions with categories</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <FolderPlus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Categories ({categories.length})</CardTitle>
            <CardDescription>Manage forum categories and their settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Topics</TableHead>
                    <TableHead>Posts</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-muted-foreground">{category.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">Slug: /{category.slug}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={category.isActive ? "outline" : "secondary"}
                          className={
                            category.isActive ? "text-green-600 border-green-600" : "text-gray-600 border-gray-600"
                          }
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          {category.topicCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {category.postCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(category)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Category
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleCategoryStatus(category.id)}>
                              {category.isActive ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(category)}
                              className="text-destructive focus:text-destructive"
                              disabled={category.topicCount > 0}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Category
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Create Category Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>Add a new category to organize forum discussions.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this category is for"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="slug">URL Slug (optional)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="category-url-slug"
                />
                <div className="text-xs text-muted-foreground mt-1">Leave empty to auto-generate from name</div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!formData.name.trim()}>
                Create Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Update category information and settings.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Category Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this category is for"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-slug">URL Slug</Label>
                <Input
                  id="edit-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="category-url-slug"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit} disabled={!formData.name.trim()}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Category Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
                {selectedCategory?.topicCount && selectedCategory.topicCount > 0 && (
                  <div className="mt-2 p-2 bg-destructive/10 rounded text-destructive text-sm">
                    This category contains {selectedCategory.topicCount} topics. You must move or delete all topics
                    before deleting the category.
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={selectedCategory?.topicCount ? selectedCategory.topicCount > 0 : false}
              >
                Delete Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PermissionGuard>
  )
}
