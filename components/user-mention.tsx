"use client"

import * as React from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AtSign } from "lucide-react"

interface User {
  id: string
  username: string
  name: string
  avatar: string
}

interface UserMentionProps {
  onMention: (user: User) => void
  trigger: string
  users: User[]
}

export function UserMention({ onMention, trigger, users }: UserMentionProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.name.toLowerCase().includes(search.toLowerCase()),
  )

  React.useEffect(() => {
    if (trigger.startsWith("@") && trigger.length > 1) {
      setSearch(trigger.slice(1))
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [trigger])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div />
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search users..." value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              {filteredUsers.slice(0, 10).map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => {
                    onMention(user)
                    setOpen(false)
                  }}
                  className="flex items-center gap-2"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">@{user.username}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Enhanced Rich Text Editor with mention support
export function RichTextEditorWithMentions({
  value,
  onChange,
  placeholder = "Write your message...",
  minHeight = "200px",
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [mentionTrigger, setMentionTrigger] = React.useState("")
  const [cursorPosition, setCursorPosition] = React.useState(0)

  // Mock users for mentions
  const users: User[] = [
    {
      id: "1",
      username: "sarah-johnson",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      username: "michael-chen",
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      username: "taylor-wilson",
      name: "Taylor Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const cursorPos = e.target.selectionStart

    onChange(newValue)
    setCursorPosition(cursorPos)

    // Check for mention trigger
    const textBeforeCursor = newValue.slice(0, cursorPos)
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/)

    if (mentionMatch) {
      setMentionTrigger(`@${mentionMatch[1]}`)
    } else {
      setMentionTrigger("")
    }
  }

  const handleMention = (user: User) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const textBeforeCursor = value.slice(0, cursorPosition)
    const textAfterCursor = value.slice(cursorPosition)
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/)

    if (mentionMatch) {
      const beforeMention = textBeforeCursor.slice(0, mentionMatch.index)
      const mention = `@${user.username} `
      const newValue = beforeMention + mention + textAfterCursor
      const newCursorPos = beforeMention.length + mention.length

      onChange(newValue)

      // Set cursor position after mention
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }, 0)
    }
  }

  const renderPreview = (text: string) => {
    // Enhanced rendering with mention highlighting
    const html = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-3 rounded-md overflow-x-auto"><code>$1</code></pre>')
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-muted pl-4 italic">$1</blockquote>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-3 mb-2">$1</h2>')
      .replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/@(\w+)/g, '<span class="bg-primary/10 text-primary px-1 py-0.5 rounded">@$1</span>')
      .replace(/\n/g, "<br>")

    return html
  }

  return (
    <div className="relative">
      <div className="border rounded-lg">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AtSign className="h-4 w-4" />
            <span>Type @ to mention users</span>
          </div>
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextChange}
          placeholder={placeholder}
          className="w-full p-3 border-0 resize-none focus:outline-none focus:ring-0"
          style={{ minHeight }}
        />
      </div>
      <UserMention onMention={handleMention} trigger={mentionTrigger} users={users} />
    </div>
  )
}
