"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Flag, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ReportDialogProps {
  contentType: "topic" | "reply"
  contentId: string
  contentTitle?: string
  children?: React.ReactNode
}

export function ReportDialog({ contentType, contentId, contentTitle, children }: ReportDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [reason, setReason] = React.useState("")
  const [details, setDetails] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)

  const reportReasons = [
    { value: "spam", label: "Spam or promotional content" },
    { value: "harassment", label: "Harassment or bullying" },
    { value: "hate-speech", label: "Hate speech or discrimination" },
    { value: "inappropriate", label: "Inappropriate or offensive content" },
    { value: "misinformation", label: "Misinformation or false claims" },
    { value: "copyright", label: "Copyright violation" },
    { value: "off-topic", label: "Off-topic or irrelevant" },
    { value: "other", label: "Other (please specify)" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason) return

    setIsSubmitting(true)

    try {
      // Mock API call - replace with actual reporting logic
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you'd send the report to your backend
      console.log("Report submitted:", {
        contentType,
        contentId,
        reason,
        details,
        timestamp: new Date().toISOString(),
      })

      setSubmitted(true)
      setTimeout(() => {
        setOpen(false)
        setSubmitted(false)
        setReason("")
        setDetails("")
      }, 2000)
    } catch (error) {
      console.error("Failed to submit report:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm">
            <Flag className="h-4 w-4 mr-1" />
            Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-destructive" />
            Report {contentType === "topic" ? "Topic" : "Reply"}
          </DialogTitle>
          <DialogDescription>
            Help us maintain a safe and respectful community by reporting inappropriate content.
            {contentTitle && (
              <div className="mt-2 p-2 bg-muted rounded text-sm">
                <strong>Content:</strong> {contentTitle}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Thank you for your report. Our moderation team will review it shortly.</AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Why are you reporting this content?</Label>
                <RadioGroup value={reason} onValueChange={setReason} className="mt-2">
                  {reportReasons.map((reportReason) => (
                    <div key={reportReason.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={reportReason.value} id={reportReason.value} />
                      <Label htmlFor={reportReason.value} className="text-sm font-normal">
                        {reportReason.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="details">Additional details (optional)</Label>
                <Textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide any additional context that might help our moderators..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!reason || isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
