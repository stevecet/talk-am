"use client"

import * as React from "react"
import { usePermissions } from "@/hooks/use-permissions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldX } from "lucide-react"

interface PermissionGuardProps {
  permission?: string
  permissions?: string[]
  requireAll?: boolean
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PermissionGuard({
  permission,
  permissions = [],
  requireAll = false,
  fallback,
  children,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission } = usePermissions()

  const hasAccess = React.useMemo(() => {
    if (permission) {
      return hasPermission(permission)
    }

    if (permissions.length > 0) {
      return requireAll ? permissions.every((p) => hasPermission(p)) : hasAnyPermission(permissions)
    }

    return true
  }, [permission, permissions, requireAll, hasPermission, hasAnyPermission])

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <Alert variant="destructive">
        <ShieldX className="h-4 w-4" />
        <AlertDescription>You don't have permission to access this content.</AlertDescription>
      </Alert>
    )
  }

  return <>{children}</>
}
