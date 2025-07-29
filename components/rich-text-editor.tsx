"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bold, Italic, Link, Code, List, ListOrdered, Quote, Heading1, Heading2 } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your message...",
  minHeight = "200px",
}: RichTextEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const insertText = (before: string, after = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
    onChange(newText)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const formatText = (type: string) => {
    switch (type) {
      case "bold":
        insertText("**", "**")
        break
      case "italic":
        insertText("*", "*")
        break
      case "code":
        insertText("`", "`")
        break
      case "codeblock":
        insertText("\n```\n", "\n```\n")
        break
      case "link":
        insertText("[", "](url)")
        break
      case "quote":
        insertText("\n> ", "")
        break
      case "ul":
        insertText("\n- ", "")
        break
      case "ol":
        insertText("\n1. ", "")
        break
      case "h1":
        insertText("\n# ", "")
        break
      case "h2":
        insertText("\n## ", "")
        break
    }
  }

  const renderPreview = (text: string) => {
    // Simple markdown-like rendering for preview
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
      .replace(/\n/g, "<br>")

    return html
  }

  return (
    <div className="border rounded-lg">
      <Tabs defaultValue="write" className="w-full">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <TabsList className="h-8">
            <TabsTrigger value="write" className="text-xs">
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">
              Preview
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => formatText("bold")}
              title="Bold"
            >
              <Bold className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => formatText("italic")}
              title="Italic"
            >
              <Italic className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => formatText("code")}
              title="Inline Code"
            >
              <Code className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => formatText("link")}
              title="Link"
            >
              <Link className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => formatText("quote")}
              title="Quote"
            >
              <Quote className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => formatText("ul")}
              title="Bullet List"
            >
              <List className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => formatText("ol")}
              title="Numbered List"
            >
              <ListOrdered className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => formatText("h1")}
              title="Heading 1"
            >
              <Heading1 className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => formatText("h2")}
              title="Heading 2"
            >
              <Heading2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <TabsContent value="write" className="m-0">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="border-0 resize-none focus-visible:ring-0 rounded-none"
            style={{ minHeight }}
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0">
          <div
            className="p-3 prose max-w-none"
            style={{ minHeight }}
            dangerouslySetInnerHTML={{
              __html: renderPreview(value) || '<p class="text-muted-foreground">Nothing to preview</p>',
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
