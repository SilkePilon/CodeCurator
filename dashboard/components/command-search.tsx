"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { DialogProps } from "@radix-ui/react-dialog"
import { FolderIcon, FolderOpenIcon as IssueOpenedIcon, GitPullRequestIcon, SearchIcon, UsersIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { toast } from "sonner"

// Create a store to manage the command dialog state
type CommandStore = {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

const useCommandStore = (() => {
  let store: CommandStore | null = null

  return () => {
    if (!store) {
      store = {
        open: false,
        setOpen: (open: boolean) => {
          if (store) store.open = open
        },
        toggle: () => {
          if (store) store.open = !store.open
        },
      }
    }
    return store
  }
})()

// Export a function to open the command dialog
export const openCommandDialog = () => {
  const store = useCommandStore()
  store.setOpen(true)
}

interface CommandSearchProps extends DialogProps {}

export function CommandSearch({ ...props }: CommandSearchProps) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const commandStore = useCommandStore()

  // Sync the local state with the store
  React.useEffect(() => {
    const originalSetOpen = commandStore.setOpen
    commandStore.setOpen = (newOpen: boolean) => {
      setOpen(newOpen)
      originalSetOpen(newOpen)
    }

    const originalToggle = commandStore.toggle
    commandStore.toggle = () => {
      setOpen(!open)
      originalToggle()
    }
  }, [commandStore, open])

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

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  // Sample repositories data
  const repositories = [
    { id: 1, name: "frontend/user-portal", platform: "GitHub" },
    { id: 2, name: "backend/api", platform: "GitLab" },
    { id: 3, name: "backend/auth-service", platform: "GitHub" },
    { id: 4, name: "frontend/admin-portal", platform: "GitLab" },
  ]

  // Sample issues data
  const issues = [
    { id: 1, title: "Login page crashes on mobile devices", repository: "frontend/user-portal" },
    { id: 2, title: "Add support for OAuth 2.0 login", repository: "frontend/user-portal" },
    { id: 3, title: "Database queries timeout on large datasets", repository: "backend/api" },
  ]

  // Sample pull requests data
  const pullRequests = [
    { id: 1, title: "Fix authentication bug in login flow", repository: "frontend/user-portal" },
    { id: 2, title: "Add dark mode support to dashboard", repository: "frontend/user-portal" },
    { id: 3, title: "Optimize database queries for user search", repository: "backend/api" },
  ]

  // Sample team members data
  const teamMembers = [
    { id: 1, name: "Sarah Chen", role: "Frontend Developer" },
    { id: 2, name: "Eddie Lake", role: "Backend Developer" },
    { id: 3, name: "Jamik Tashpulatov", role: "DevOps Engineer" },
  ]

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
        {...props}
      >
        <SearchIcon className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search...</span>
        <span className="sr-only">Search</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
              <LayoutDashboardIcon className="mr-2 h-4 w-4" />
              <span>Go to Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/pull-requests"))}>
              <GitPullRequestIcon className="mr-2 h-4 w-4" />
              <span>View Pull Requests</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/issues"))}>
              <IssueOpenedIcon className="mr-2 h-4 w-4" />
              <span>View Issues</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Open Settings</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Repositories">
            {repositories.map((repo) => (
              <CommandItem
                key={repo.id}
                onSelect={() => runCommand(() => router.push(`/dashboard?search=${encodeURIComponent(repo.name)}`))}
              >
                <FolderIcon className="mr-2 h-4 w-4" />
                <span>{repo.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{repo.platform}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Issues">
            {issues.map((issue) => (
              <CommandItem
                key={issue.id}
                onSelect={() => runCommand(() => router.push(`/issues?repo=${encodeURIComponent(issue.repository)}`))}
              >
                <IssueOpenedIcon className="mr-2 h-4 w-4" />
                <span>{issue.title}</span>
                <span className="ml-auto text-xs text-muted-foreground">{issue.repository}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Pull Requests">
            {pullRequests.map((pr) => (
              <CommandItem
                key={pr.id}
                onSelect={() =>
                  runCommand(() => router.push(`/pull-requests?repo=${encodeURIComponent(pr.repository)}`))
                }
              >
                <GitPullRequestIcon className="mr-2 h-4 w-4" />
                <span>{pr.title}</span>
                <span className="ml-auto text-xs text-muted-foreground">{pr.repository}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Team Members">
            {teamMembers.map((member) => (
              <CommandItem key={member.id} onSelect={() => runCommand(() => router.push("/team"))}>
                <UsersIcon className="mr-2 h-4 w-4" />
                <span>{member.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{member.role}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Quick Actions">
            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  toast.success("Creating new repository...")
                  // You could trigger the new repository dialog here
                })
              }
            >
              <FolderIcon className="mr-2 h-4 w-4" />
              <span>New Repository</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  toast.success("Creating new issue...")
                  // You could trigger the new issue dialog here
                })
              }
            >
              <IssueOpenedIcon className="mr-2 h-4 w-4" />
              <span>New Issue</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  toast.success("Creating new pull request...")
                  // You could trigger the new PR dialog here
                })
              }
            >
              <GitPullRequestIcon className="mr-2 h-4 w-4" />
              <span>New Pull Request</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

function LayoutDashboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  )
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

