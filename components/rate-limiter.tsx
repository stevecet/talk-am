"use client"

import * as React from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Clock } from "lucide-react"

interface RateLimitState {
  count: number
  resetTime: number
  isLimited: boolean
}

interface RateLimiterProps {
  action: string
  limit: number
  windowMs: number
  children: (canPerform: boolean, timeUntilReset: number) => React.ReactNode
}

export function RateLimiter({ action, limit, windowMs, children }: RateLimiterProps) {
  const [state, setState] = React.useState<RateLimitState>({
    count: 0,
    resetTime: Date.now() + windowMs,
    isLimited: false,
  })

  const [timeUntilReset, setTimeUntilReset] = React.useState(0)

  // Load state from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem(`rate-limit-${action}`)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const now = Date.now()

        if (now < parsed.resetTime) {
          setState(parsed)
        } else {
          // Reset if window has expired
          const newState = {
            count: 0,
            resetTime: now + windowMs,
            isLimited: false,
          }
          setState(newState)
          localStorage.setItem(`rate-limit-${action}`, JSON.stringify(newState))
        }
      } catch (error) {
        console.error("Failed to parse rate limit state:", error)
      }
    }
  }, [action, windowMs])

  // Update countdown timer
  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const remaining = Math.max(0, state.resetTime - now)
      setTimeUntilReset(remaining)

      // Reset if window has expired
      if (remaining === 0 && state.isLimited) {
        const newState = {
          count: 0,
          resetTime: now + windowMs,
          isLimited: false,
        }
        setState(newState)
        localStorage.setItem(`rate-limit-${action}`, JSON.stringify(newState))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [state, action, windowMs])

  const canPerform = !state.isLimited && state.count < limit

  return (
    <div>
      {children(canPerform, timeUntilReset)}
      {state.isLimited && (
        <RateLimitWarning action={action} limit={limit} timeUntilReset={timeUntilReset} currentCount={state.count} />
      )}
    </div>
  )
}

function RateLimitWarning({
  action,
  limit,
  timeUntilReset,
  currentCount,
}: {
  action: string
  limit: number
  timeUntilReset: number
  currentCount: number
}) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }

  const progressPercentage = ((limit - currentCount) / limit) * 100

  return (
    <Alert variant="destructive" className="mt-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <p>
            You've reached the rate limit for {action} ({currentCount}/{limit} attempts).
          </p>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Reset in: {formatTime(timeUntilReset)}</span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </div>
      </AlertDescription>
    </Alert>
  )
}

// Hook for managing rate limits
export function useRateLimit(action: string, limit: number, windowMs: number) {
  const [state, setState] = React.useState<RateLimitState>({
    count: 0,
    resetTime: Date.now() + windowMs,
    isLimited: false,
  })

  // Load and initialize state
  React.useEffect(() => {
    const stored = localStorage.getItem(`rate-limit-${action}`)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const now = Date.now()

        if (now < parsed.resetTime) {
          setState(parsed)
        } else {
          resetLimit()
        }
      } catch (error) {
        console.error("Failed to parse rate limit state:", error)
        resetLimit()
      }
    }
  }, [action])

  const resetLimit = () => {
    const newState = {
      count: 0,
      resetTime: Date.now() + windowMs,
      isLimited: false,
    }
    setState(newState)
    localStorage.setItem(`rate-limit-${action}`, JSON.stringify(newState))
  }

  const attemptAction = (): boolean => {
    const now = Date.now()

    // Check if window has expired
    if (now >= state.resetTime) {
      resetLimit()
      return attemptAction()
    }

    // Check if already limited
    if (state.isLimited) {
      return false
    }

    // Check if would exceed limit
    if (state.count >= limit) {
      const newState = { ...state, isLimited: true }
      setState(newState)
      localStorage.setItem(`rate-limit-${action}`, JSON.stringify(newState))
      return false
    }

    // Increment count
    const newState = {
      ...state,
      count: state.count + 1,
      isLimited: state.count + 1 >= limit,
    }
    setState(newState)
    localStorage.setItem(`rate-limit-${action}`, JSON.stringify(newState))

    return true
  }

  const canPerform = !state.isLimited && state.count < limit
  const timeUntilReset = Math.max(0, state.resetTime - Date.now())

  return {
    canPerform,
    attemptAction,
    timeUntilReset,
    currentCount: state.count,
    limit,
    resetLimit,
  }
}
