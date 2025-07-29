import { Badge } from "@/components/ui/badge"
import { type UserRole, ROLES } from "@/types/user-roles"
import { Shield, ShieldCheck, Crown } from "lucide-react"

interface RoleBadgeProps {
  role: UserRole
  showIcon?: boolean
  variant?: "default" | "outline" | "secondary"
}

export function RoleBadge({ role, showIcon = true, variant = "default" }: RoleBadgeProps) {
  const roleConfig = ROLES[role]

  const getIcon = () => {
    switch (role) {
      case "administrator":
        return <Crown className="h-3 w-3 mr-1" />
      case "moderator":
        return <ShieldCheck className="h-3 w-3 mr-1" />
      case "user":
        return <Shield className="h-3 w-3 mr-1" />
      default:
        return null
    }
  }

  const getVariantClass = () => {
    if (variant !== "default") return ""

    switch (role) {
      case "administrator":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "moderator":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "user":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      default:
        return ""
    }
  }

  return (
    <Badge variant={variant} className={getVariantClass()}>
      {showIcon && getIcon()}
      {roleConfig.name}
    </Badge>
  )
}
