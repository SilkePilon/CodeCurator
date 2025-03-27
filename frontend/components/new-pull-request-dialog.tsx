"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { GitBranchIcon, GitPullRequestIcon } from "lucide-react"

interface NewPullRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewPullRequestDialog({ open, onOpenChange }: NewPullRequestDialogProps) {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [repository, setRepository] = React.useState("")
  const [sourceBranch, setSourceBranch] = React.useState("")
  const [targetBranch, setTargetBranch] = React.useState("main")
  const [reviewers, setReviewers] = React.useState<string[]>([])
  const [isCreating, setIsCreating] = React.useState(false)

  const repositories = [
    { id: 1, name: "frontend/user-portal" },
    { id: 2, name: "backend/api" },
    { id: 3, name: "backend/auth-service" },
    { id: 4, name: "frontend/admin-portal" },
  ]

  const branches = [
    { name: "main" },
    { name: "develop" },
    { name: "feature/dark-mode" },
    { name: "feature/jwt-refresh" },
    { name: "fix/auth-login-flow" },
  ]

  const users = [
    { id: 1, name: "Sarah Chen" },
    { id: 2, name: "Eddie Lake" },
    { id: 3, name: "Jamik Tashpulatov" },
    { id: 4, name: "Raj Patel" },
  ]

  const handleCreate = async () => {
    if (!title) {
      toast.error("Pull request title is required")
      return
    }

    if (!repository) {
      toast.error("Repository is required")
      return
    }

    if (!sourceBranch) {
      toast.error("Source branch is required")
      return
    }

    setIsCreating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success(`Pull request "${title}" created successfully`)
    setIsCreating(false)
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setRepository("")
    setSourceBranch("")
    setTargetBranch("main")
    setReviewers([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitPullRequestIcon className="h-5 w-5" />
            Create New Pull Request
          </DialogTitle>
          <DialogDescription>
            Create a new pull request to propose and collaborate on changes to a repository.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="repository">Repository</Label>
            <Select value={repository} onValueChange={setRepository}>
              <SelectTrigger>
                <SelectValue placeholder="Select repository" />
              </SelectTrigger>
              <SelectContent>
                {repositories.map((repo) => (
                  <SelectItem key={repo.id} value={repo.name}>
                    {repo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source-branch">Source Branch</Label>
              <Select value={sourceBranch} onValueChange={setSourceBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.name} value={branch.name}>
                      <div className="flex items-center gap-2">
                        <GitBranchIcon className="h-4 w-4" />
                        {branch.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-branch">Target Branch</Label>
              <Select value={targetBranch} onValueChange={setTargetBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.name} value={branch.name}>
                      <div className="flex items-center gap-2">
                        <GitBranchIcon className="h-4 w-4" />
                        {branch.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Pull request title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the changes in this pull request"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reviewers">Reviewers (optional)</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Add reviewers" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.name}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Pull Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

