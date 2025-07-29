"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface VotingSystemProps {
  contentId: string
  contentType: "topic" | "reply"
  initialScore?: number
  initialUserVote?: "up" | "down" | null
  onVote?: (contentId: string, voteType: "up" | "down" | null) => void
  className?: string
}

export function VotingSystem({
  contentId,
  contentType,
  initialScore = 0,
  initialUserVote = null,
  onVote,
  className,
}: VotingSystemProps) {
  const [score, setScore] = React.useState(initialScore)
  const [userVote, setUserVote] = React.useState<"up" | "down" | null>(initialUserVote)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleVote = async (voteType: "up" | "down") => {
    if (isLoading) return

    setIsLoading(true)

    try {
      let newVote: "up" | "down" | null = voteType
      let newScore = score

      // If clicking the same vote, remove it
      if (userVote === voteType) {
        newVote = null
        newScore = score + (voteType === "up" ? -1 : 1)
      } else {
        // If switching votes, adjust score accordingly
        if (userVote === "up" && voteType === "down") {
          newScore = score - 2
        } else if (userVote === "down" && voteType === "up") {
          newScore = score + 2
        } else {
          // First vote
          newScore = score + (voteType === "up" ? 1 : -1)
        }
      }

      setUserVote(newVote)
      setScore(newScore)

      // Call the onVote callback if provided
      if (onVote) {
        await onVote(contentId, newVote)
      }

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 200))
    } catch (error) {
      // Revert on error
      setUserVote(userVote)
      setScore(score)
      console.error("Failed to vote:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600",
          userVote === "up" && "bg-green-100 text-green-600",
        )}
        onClick={() => handleVote("up")}
        disabled={isLoading}
      >
        <ChevronUp className="h-4 w-4" />
        <span className="sr-only">Upvote</span>
      </Button>

      <span
        className={cn(
          "text-sm font-medium tabular-nums",
          score > 0 && "text-green-600",
          score < 0 && "text-red-600",
          score === 0 && "text-muted-foreground",
        )}
      >
        {score > 0 ? `+${score}` : score}
      </span>

      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600",
          userVote === "down" && "bg-red-100 text-red-600",
        )}
        onClick={() => handleVote("down")}
        disabled={isLoading}
      >
        <ChevronDown className="h-4 w-4" />
        <span className="sr-only">Downvote</span>
      </Button>
    </div>
  )
}
