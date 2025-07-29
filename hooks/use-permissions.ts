"use client"

import * as React from "react"
import { type UserRole, ROLES } from "@/types/user-roles"

interface AuthContext {
  user: {
    id: string
    username: string
    name: string
    role: UserRole
  } | null
  hasPermission: (permissionId: string) => boolean
  hasAnyPermission: (permissionIds: string[]) => boolean
  hasRole: (role: UserRole) => boolean
  isAtLeastRole: (role: UserRole) => boolean
}

const AuthContext = React.createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Mock current user - in a real app, this would come from your auth system
  const [user] = React.useState({
    id: "1",
    username: "current-user",
    name: "Current User",
    role: "moderator" as UserRole, // Change this to test different roles
  })

  const hasPermission = React.useCallback(
    (permissionId: string): boolean => {
      if (!user) return false
      const userRole = ROLES[user.role]
      return userRole.permissions.some((permission) => permission.id === permissionId)
    },
    [user],
  )

  const hasAnyPermission = React.useCallback(
    (permissionIds: string[]): boolean => {
      return permissionIds.some((permissionId) => hasPermission(permissionId))
    },
    [hasPermission],
  )

  const hasRole = React.useCallback(
    (role: UserRole): boolean => {
      return user?.role === role
    },
    [user],
  )

  const isAtLeastRole = React.useCallback(
    (role: UserRole): boolean => {
      if (!user) return false
      const roleHierarchy: UserRole[] = ["user", "moderator", "administrator"]
      const userRoleIndex = roleHierarchy.indexOf(user.role)
      const requiredRoleIndex = roleHierarchy.indexOf(role)
      return userRoleIndex >= requiredRoleIndex
    },
    [user],
  )

  const value = React.useMemo(
    () => ({
      user,
      hasPermission,
      hasAnyPermission,
      hasRole,
      isAtLeastRole,
    }),
    [user, hasPermission, hasAnyPermission, hasRole, isAtLeastRole],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function usePermissions() {
  const { hasPermission, hasAnyPermission } = useAuth()
  return { hasPermission, hasAnyPermission }
}
