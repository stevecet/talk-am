export type UserRole = "user" | "moderator" | "administrator"

export interface Permission {
  id: string
  name: string
  description: string
}

export interface Role {
  id: UserRole
  name: string
  description: string
  permissions: Permission[]
  color: string
}

export interface User {
  id: string
  username: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  joinDate: string
  lastActive: string
  isActive: boolean
  isBanned: boolean
  banReason?: string
  banExpiry?: string
}

// Define all available permissions
export const PERMISSIONS = {
  // Content permissions
  CREATE_TOPIC: { id: "create_topic", name: "Create Topics", description: "Can create new topics" },
  CREATE_REPLY: { id: "create_reply", name: "Create Replies", description: "Can post replies to topics" },
  EDIT_OWN_CONTENT: {
    id: "edit_own_content",
    name: "Edit Own Content",
    description: "Can edit own topics and replies",
  },
  DELETE_OWN_CONTENT: {
    id: "delete_own_content",
    name: "Delete Own Content",
    description: "Can delete own topics and replies",
  },

  // Moderation permissions
  EDIT_ANY_CONTENT: { id: "edit_any_content", name: "Edit Any Content", description: "Can edit any topic or reply" },
  DELETE_ANY_CONTENT: {
    id: "delete_any_content",
    name: "Delete Any Content",
    description: "Can delete any topic or reply",
  },
  MOVE_TOPICS: { id: "move_topics", name: "Move Topics", description: "Can move topics between categories" },
  LOCK_TOPICS: { id: "lock_topics", name: "Lock Topics", description: "Can lock/unlock topics" },
  PIN_TOPICS: { id: "pin_topics", name: "Pin Topics", description: "Can pin/unpin topics" },
  MODERATE_USERS: { id: "moderate_users", name: "Moderate Users", description: "Can warn, suspend, or ban users" },
  VIEW_REPORTS: { id: "view_reports", name: "View Reports", description: "Can view and handle content reports" },

  // Administrative permissions
  MANAGE_USERS: { id: "manage_users", name: "Manage Users", description: "Can create, edit, and delete user accounts" },
  MANAGE_ROLES: { id: "manage_roles", name: "Manage Roles", description: "Can assign roles to users" },
  MANAGE_CATEGORIES: {
    id: "manage_categories",
    name: "Manage Categories",
    description: "Can create, edit, and delete categories",
  },
  MANAGE_SETTINGS: { id: "manage_settings", name: "Manage Settings", description: "Can modify forum settings" },
  VIEW_ANALYTICS: {
    id: "view_analytics",
    name: "View Analytics",
    description: "Can access forum analytics and statistics",
  },
} as const

// Define roles with their permissions
export const ROLES: Record<UserRole, Role> = {
  user: {
    id: "user",
    name: "Regular User",
    description: "Standard forum member with basic posting privileges",
    color: "bg-blue-100 text-blue-800",
    permissions: [
      PERMISSIONS.CREATE_TOPIC,
      PERMISSIONS.CREATE_REPLY,
      PERMISSIONS.EDIT_OWN_CONTENT,
      PERMISSIONS.DELETE_OWN_CONTENT,
    ],
  },
  moderator: {
    id: "moderator",
    name: "Moderator",
    description: "Community moderator with content management privileges",
    color: "bg-green-100 text-green-800",
    permissions: [
      PERMISSIONS.CREATE_TOPIC,
      PERMISSIONS.CREATE_REPLY,
      PERMISSIONS.EDIT_OWN_CONTENT,
      PERMISSIONS.DELETE_OWN_CONTENT,
      PERMISSIONS.EDIT_ANY_CONTENT,
      PERMISSIONS.DELETE_ANY_CONTENT,
      PERMISSIONS.MOVE_TOPICS,
      PERMISSIONS.LOCK_TOPICS,
      PERMISSIONS.PIN_TOPICS,
      PERMISSIONS.MODERATE_USERS,
      PERMISSIONS.VIEW_REPORTS,
    ],
  },
  administrator: {
    id: "administrator",
    name: "Administrator",
    description: "Full administrative access to all forum features",
    color: "bg-red-100 text-red-800",
    permissions: Object.values(PERMISSIONS),
  },
}
