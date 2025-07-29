"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Camera, Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AvatarUploadProps {
  currentAvatar?: string
  userName: string
  onAvatarChange: (avatarUrl: string | null) => void
  className?: string
}

export function AvatarUpload({ currentAvatar, userName, onAvatarChange, className }: AvatarUploadProps) {
  const [avatar, setAvatar] = React.useState(currentAvatar)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File | null) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.")
      return
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setAvatar(previewUrl)

    // Simulate upload
    simulateUpload(previewUrl)
  }

  const simulateUpload = (previewUrl: string) => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          onAvatarChange(previewUrl)
          return 100
        }
        return prev + Math.random() * 20
      })
    }, 200)
  }

  const removeAvatar = () => {
    setAvatar(undefined)
    onAvatarChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>Upload a custom avatar for your profile</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatar || "/placeholder.svg"} alt={userName} />
              <AvatarFallback className="text-lg">{getInitials(userName)}</AvatarFallback>
            </Avatar>
            {avatar && !isUploading && (
              <Button
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={removeAvatar}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          {isUploading && (
            <div className="w-full space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">Uploading... {Math.round(uploadProgress)}%</p>
            </div>
          )}

          <div className="flex flex-col items-center space-y-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {avatar ? "Change Avatar" : "Upload Avatar"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Recommended: Square image, at least 200x200px
              <br />
              Maximum file size: 5MB
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  )
}
