"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { usePermissions } from "@/hooks/use-permissions"
import { PermissionGuard } from "@/components/permission-guard"
import { MoreHorizontal, Edit, Trash2, Lock, Unlock, Pin, PinOff, Move, Eye, EyeOff } from "lucide-react"

interface ModerationActionsProps {
  contentType: "topic" | "reply"
  contentId: string
  isLocked?: boolean
  isPinned?: boolean
  isHidden?: boolean
  currentCategory?: string
  onAction?: (action: string, data?: any) => void
}

export function ModerationActions({
  contentType,
  contentId,
  isLocked = false,
  isPinned = false,
  isHidden = false,
  currentCategory,
  onAction,
}: ModerationActionsProps) {
  const { hasPermission } = usePermissions()
  const [showMoveDialog, setShowMoveDialog] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState("")
  const [deleteReason, setDeleteReason] = React.useState("")

  // Mock categories for move dialog
  const categories = [
    { id: "local-news", name: "Local News & Events" },
    { id: "recommendations", name: "Recommendations" },
    { id: "community-projects", name: "Community Projects" },
    { id: "buy-sell-trade", name: "Buy, Sell & Trade" },
    { id: "general-discussion", name: "General Discussion" },
  ]

  const handleAction = (action: string, data?: any) => {
    if (onAction) {
      onAction(action, data)
    }
    console.log(`${action} performed on ${contentType} ${contentId}`, data)
  }

  const handleMove = () => {
    if (selectedCategory) {
      handleAction("move", { categoryId: selectedCategory })
      setShowMoveDialog(false)
      setSelectedCategory("")
    }
  }

  const handleDelete = () => {
    handleAction("delete", { reason: deleteReason })
    setShowDeleteDialog(false)
    setDeleteReason("")
  }

  // Don't show moderation actions if user has no moderation permissions
  if (!hasPermission("edit_any_content") && !hasPermission("delete_any_content")) {
    return null
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Moderation actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <PermissionGuard permission="edit_any_content">
            <DropdownMenuItem onClick={() => handleAction("edit")}>
              <Edit className="h-4 w-4 mr-2" />
              Edit {contentType}
            </DropdownMenuItem>
          </PermissionGuard>

          {contentType === "topic" && (
            <>
              <PermissionGuard permission="lock_topics">
                <DropdownMenuItem onClick={() => handleAction(isLocked ? "unlock" : "lock")}>
                  {isLocked ? (
                    <>
                      <Unlock className="h-4 w-4 mr-2" />
                      Unlock Topic
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Lock Topic
                    </>
                  )}
                </DropdownMenuItem>
              </PermissionGuard>

              <PermissionGuard permission="pin_topics">
                <DropdownMenuItem onClick={() => handleAction(isPinned ? "unpin" : "pin")}>
                  {isPinned ? (
                    <>
                      <PinOff className="h-4 w-4 mr-2" />
                      Unpin Topic
                    </>
                  ) : (
                    <>
                      <Pin className="h-4 w-4 mr-2" />
                      Pin Topic
                    </>
                  )}
                </DropdownMenuItem>
              </PermissionGuard>

              <PermissionGuard permission="move_topics">
                <DropdownMenuItem onClick={() => setShowMoveDialog(true)}>
                  <Move className="h-4 w-4 mr-2" />
                  Move Topic
                </DropdownMenuItem>
              </PermissionGuard>
            </>
          )}

          <PermissionGuard permission="edit_any_content">
            <DropdownMenuItem onClick={() => handleAction(isHidden ? "show" : "hide")}>
              {isHidden ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show {contentType}
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide {contentType}
                </>
              )}
            </DropdownMenuItem>
          </PermissionGuard>

          <DropdownMenuSeparator />

          <PermissionGuard permission="delete_any_content">
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete {contentType}
            </DropdownMenuItem>
          </PermissionGuard>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Move Topic Dialog */}
      <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Topic</DialogTitle>
            <DialogDescription>Select a new category for this topic.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Category</Label>
              <div className="mt-1">
                <Badge variant="outline">{currentCategory}</Badge>
              </div>
            </div>
            <div>
              <Label>New Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((cat) => cat.id !== currentCategory)
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMoveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleMove} disabled={!selectedCategory}>
              Move Topic
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {contentType}</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The {contentType} will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Reason for deletion (optional)</Label>
              <Textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Explain why this content is being deleted..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete {contentType}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
