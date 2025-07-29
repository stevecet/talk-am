"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { SearchIcon } from "lucide-react"

export function Search() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2 bg-transparent"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="h-4 w-4 xl:mr-2" aria-hidden="true" />
        <span className="hidden xl:inline-flex">Search forum...</span>
        <span className="sr-only">Search forum</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search forum..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Categories">
            <CommandItem onSelect={() => runCommand(() => router.push("/category/local-news"))}>
              Local News & Events
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/category/recommendations"))}>
              Recommendations
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/category/community-projects"))}>
              Community Projects
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Popular Topics">
            <CommandItem onSelect={() => runCommand(() => router.push("/topic/1"))}>
              New community garden proposal
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/topic/2"))}>
              Weekend farmers market expansion
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/topic/5"))}>
              City council meeting highlights
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
