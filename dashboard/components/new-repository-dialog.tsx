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
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GithubIcon, GitlabIcon, ServerIcon } from "lucide-react"
import { toast } from "sonner"
import { useAPIKeysStore } from "@/lib/stores/api-keys-store"

interface NewRepositoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewRepositoryDialog({ open, onOpenChange }: NewRepositoryDialogProps) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [visibility, setVisibility] = React.useState("private")
  const [platform, setPlatform] = React.useState("github")
  const [selfHostedUrl, setSelfHostedUrl] = React.useState("")
  const [isCreating, setIsCreating] = React.useState(false)
  const [includeReadme, setIncludeReadme] = React.useState(true)
  const [includeGitignore, setIncludeGitignore] = React.useState(true)
  const [gitignoreTemplate, setGitignoreTemplate] = React.useState("Node")
  const [license, setLicense] = React.useState("MIT")

  const { githubApiKeyVerified, gitlabApiKeyVerified } = useAPIKeysStore()

  const handleCreate = async () => {
    if (!name) {
      toast.error("Repository name is required")
      return
    }

    if (platform === "self-hosted" && !selfHostedUrl) {
      toast.error("Self-hosted GitLab URL is required")
      return
    }

    setIsCreating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success(`Repository ${name} created successfully`)
    setIsCreating(false)
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setVisibility("private")
    setPlatform("github")
    setSelfHostedUrl("")
    setIncludeReadme(true)
    setIncludeGitignore(true)
    setGitignoreTemplate("Node")
    setLicense("MIT")
  }

  const getPlatformStatus = () => {
    if (platform === "github" && !githubApiKeyVerified) {
      return {
        disabled: true,
        message: "GitHub API key not configured. Please add it in Settings.",
      }
    }

    if (platform === "gitlab" && !gitlabApiKeyVerified) {
      return {
        disabled: true,
        message: "GitLab API key not configured. Please add it in Settings.",
      }
    }

    return {
      disabled: false,
      message: null,
    }
  }

  const platformStatus = getPlatformStatus()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Repository</DialogTitle>
          <DialogDescription>Create a new repository to store your code and collaborate with others.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={platform === "github" ? "default" : "outline"}
                  className="flex flex-col items-center justify-center h-20 gap-2"
                  onClick={() => setPlatform("github")}
                >
                  <GithubIcon className="h-8 w-8" />
                  <span>GitHub</span>
                </Button>
                <Button
                  type="button"
                  variant={platform === "gitlab" ? "default" : "outline"}
                  className="flex flex-col items-center justify-center h-20 gap-2"
                  onClick={() => setPlatform("gitlab")}
                >
                  <GitlabIcon className="h-8 w-8" />
                  <span>GitLab</span>
                </Button>
                <Button
                  type="button"
                  variant={platform === "self-hosted" ? "default" : "outline"}
                  className="flex flex-col items-center justify-center h-20 gap-2"
                  onClick={() => setPlatform("self-hosted")}
                >
                  <ServerIcon className="h-8 w-8" />
                  <span>Self-hosted</span>
                </Button>
              </div>
            </div>

            {platform === "self-hosted" && (
              <div className="space-y-2">
                <Label htmlFor="self-hosted-url">Self-hosted GitLab URL</Label>
                <Input
                  id="self-hosted-url"
                  placeholder="https://gitlab.example.com"
                  value={selfHostedUrl}
                  onChange={(e) => setSelfHostedUrl(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Repository Name</Label>
              <Input
                id="name"
                placeholder="my-awesome-project"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="A short description of your repository"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {visibility === "public" && "Anyone can see this repository. You choose who can commit."}
                {visibility === "private" && "You choose who can see and commit to this repository."}
                {visibility === "internal" &&
                  "Members of your organization can see this repository. You choose who can commit."}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Initialize with README</Label>
                <p className="text-sm text-muted-foreground">
                  Add a README file to help others understand your project
                </p>
              </div>
              <Switch checked={includeReadme} onCheckedChange={setIncludeReadme} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Add .gitignore</Label>
                <p className="text-sm text-muted-foreground">Add a .gitignore file to specify which files to ignore</p>
              </div>
              <Switch checked={includeGitignore} onCheckedChange={setIncludeGitignore} />
            </div>

            {includeGitignore && (
              <div className="space-y-2">
                <Label htmlFor="gitignore-template">Gitignore Template</Label>
                <Select value={gitignoreTemplate} onValueChange={setGitignoreTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Node">Node</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Java">Java</SelectItem>
                    <SelectItem value="Go">Go</SelectItem>
                    <SelectItem value="Ruby">Ruby</SelectItem>
                    <SelectItem value="C++">C++</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="license">License</Label>
              <Select value={license} onValueChange={setLicense}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a license" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MIT">MIT License</SelectItem>
                  <SelectItem value="Apache-2.0">Apache License 2.0</SelectItem>
                  <SelectItem value="GPL-3.0">GNU GPL v3</SelectItem>
                  <SelectItem value="BSD-3-Clause">BSD 3-Clause</SelectItem>
                  <SelectItem value="None">No License</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        {platformStatus.message && <div className="text-sm text-red-500 mt-2">{platformStatus.message}</div>}

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isCreating || platformStatus.disabled}>
            {isCreating ? "Creating..." : "Create Repository"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

