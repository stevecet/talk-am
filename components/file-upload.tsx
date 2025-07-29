"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, X, File, ImageIcon, FileText, Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadProgress?: number
}

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void
  maxFiles?: number
  maxFileSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
}

export function FileUpload({
  onFilesChange,
  maxFiles = 5,
  maxFileSize = 10,
  acceptedTypes = ["image/*", ".pdf", ".doc", ".docx", ".txt"],
  className,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: UploadedFile[] = []

    Array.from(selectedFiles).forEach((file) => {
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxFileSize}MB.`)
        return
      }

      // Check if we've reached max files
      if (files.length + newFiles.length >= maxFiles) {
        alert(`Maximum ${maxFiles} files allowed.`)
        return
      }

      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        uploadProgress: 0,
      }

      newFiles.push(uploadedFile)

      // Simulate upload progress
      simulateUpload(uploadedFile)
    })

    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const simulateUpload = (file: UploadedFile) => {
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.id === file.id && f.uploadProgress !== undefined && f.uploadProgress < 100) {
            const newProgress = Math.min(f.uploadProgress + Math.random() * 30, 100)
            return { ...f, uploadProgress: newProgress }
          }
          return f
        }),
      )
    }, 200)

    setTimeout(() => {
      clearInterval(interval)
      setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, uploadProgress: undefined } : f)))
    }, 2000)
  }

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter((f) => f.id !== fileId)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (type.includes("pdf")) return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Card
        className={cn(
          "border-2 border-dashed transition-colors",
          isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="text-sm font-medium">Drop files here or click to upload</p>
            <p className="text-xs text-muted-foreground">
              Maximum {maxFiles} files, {maxFileSize}MB each
            </p>
            <p className="text-xs text-muted-foreground">Supported: Images, PDF, Word documents, Text files</p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-4 bg-transparent"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(",")}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files ({files.length})</h4>
          {files.map((file) => (
            <Card key={file.id} className="p-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeFile(file.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {formatFileSize(file.size)}
                    </Badge>
                    {file.type.startsWith("image/") && (
                      <Badge variant="outline" className="text-xs">
                        Image
                      </Badge>
                    )}
                  </div>
                  {file.uploadProgress !== undefined && (
                    <div className="mt-2">
                      <Progress value={file.uploadProgress} className="h-1" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Uploading... {Math.round(file.uploadProgress)}%
                      </p>
                    </div>
                  )}
                </div>
                {file.uploadProgress === undefined && (
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                    <a href={file.url} download={file.name}>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
