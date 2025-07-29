"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-permissions"
import { RoleBadge } from "@/components/role-badge"
import { PermissionGuard } from "@/components/permission-guard"
import { Settings, Shield, Users, FolderOpen, BarChart3 } from "lucide-react"

export function UserNav() {
  const router = useRouter()
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button size="sm">Join</Button>
        </Link>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <RoleBadge role={user.role} showIcon={false} variant="outline" />
            </div>
            <p className="text-xs leading-none text-muted-foreground">@{user.username}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/profile/${user.username}`}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/bookmarks">Bookmarks</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Moderation Menu */}
        <PermissionGuard permissions={["view_reports", "moderate_users", "edit_any_content"]}>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Moderation</DropdownMenuLabel>
          <PermissionGuard permission="view_reports">
            <DropdownMenuItem asChild>
              <Link href="/admin/moderation">
                <Shield className="h-4 w-4 mr-2" />
                Moderation Dashboard
              </Link>
            </DropdownMenuItem>
          </PermissionGuard>
        </PermissionGuard>

        {/* Administration Menu */}
        <PermissionGuard permissions={["manage_users", "manage_categories", "manage_settings", "view_analytics"]}>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Administration</DropdownMenuLabel>
          <PermissionGuard permission="manage_users">
            <DropdownMenuItem asChild>
              <Link href="/admin/users">
                <Users className="h-4 w-4 mr-2" />
                User Management
              </Link>
            </DropdownMenuItem>
          </PermissionGuard>
          <PermissionGuard permission="manage_categories">
            <DropdownMenuItem asChild>
              <Link href="/admin/categories">
                <FolderOpen className="h-4 w-4 mr-2" />
                Category Management
              </Link>
            </DropdownMenuItem>
          </PermissionGuard>
          <PermissionGuard permission="view_analytics">
            <DropdownMenuItem asChild>
              <Link href="/admin/analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Link>
            </DropdownMenuItem>
          </PermissionGuard>
        </PermissionGuard>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            // Handle logout
            router.push("/")
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
