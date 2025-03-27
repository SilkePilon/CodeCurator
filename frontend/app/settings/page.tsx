"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AppSidebar } from "../../components/app-sidebar"
import { SiteHeader } from "../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2Icon, GitlabIcon as GitHubIcon, GitlabIcon, LoaderIcon, RefreshCwIcon } from "lucide-react"
import { toast } from "sonner"
import { useAPIKeysStore } from "@/lib/stores/api-keys-store"
import { useAIStore } from "@/lib/stores/ai-store"
import { fadeIn, slideUp, staggerContainer } from "@/components/ui/animations"

export default function SettingsPage() {
  const {
    githubApiKey,
    gitlabApiKey,
    githubApiKeyVerified,
    gitlabApiKeyVerified,
    dataLoaded,
    setGithubApiKey,
    setGitlabApiKey,
    setGithubApiKeyVerified,
    setGitlabApiKeyVerified,
    setDataLoaded,
  } = useAPIKeysStore()

  const { activeModel, availableModels, setActiveModel } = useAIStore()

  const [githubKeyInput, setGithubKeyInput] = useState(githubApiKey || "")
  const [gitlabKeyInput, setGitlabKeyInput] = useState(gitlabApiKey || "")
  const [isVerifyingGithub, setIsVerifyingGithub] = useState(false)
  const [isVerifyingGitlab, setIsVerifyingGitlab] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)

  const verifyGithubKey = async () => {
    if (!githubKeyInput) return

    setIsVerifyingGithub(true)

    // Simulate API verification
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo purposes, we'll consider any key valid if it's at least 10 chars
    const isValid = githubKeyInput.length >= 10

    if (isValid) {
      setGithubApiKey(githubKeyInput)
      setGithubApiKeyVerified(true)
      toast.success("GitHub API key verified successfully")
    } else {
      setGithubApiKeyVerified(false)
      toast.error("Invalid GitHub API key")
    }

    setIsVerifyingGithub(false)
  }

  const verifyGitlabKey = async () => {
    if (!gitlabKeyInput) return

    setIsVerifyingGitlab(true)

    // Simulate API verification
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo purposes, we'll consider any key valid if it's at least 10 chars
    const isValid = gitlabKeyInput.length >= 10

    if (isValid) {
      setGitlabApiKey(gitlabKeyInput)
      setGitlabApiKeyVerified(true)
      toast.success("GitLab API key verified successfully")
    } else {
      setGitlabApiKeyVerified(false)
      toast.error("Invalid GitLab API key")
    }

    setIsVerifyingGitlab(false)
  }

  const loadData = async () => {
    setIsLoadingData(true)

    // Simulate loading data
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setDataLoaded(true)
    setIsLoadingData(false)
    toast.success("Repository data loaded successfully")
  }

  const canLoadData = (githubApiKeyVerified || gitlabApiKeyVerified) && !dataLoaded

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <motion.div className="flex flex-1 flex-col p-6" initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.h1 className="text-3xl font-bold mb-6" variants={fadeIn}>
            Settings
          </motion.h1>

          <div className="space-y-8">
            {/* API Keys Section */}
            <motion.section variants={fadeIn} className="space-y-6">
              <h2 className="text-2xl font-semibold">API Keys</h2>
              <p className="text-muted-foreground">
                Connect to your repositories by adding API keys for GitHub and GitLab.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <motion.div variants={slideUp}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="flex items-center space-x-2">
                        <GitHubIcon className="h-5 w-5" />
                        <CardTitle>GitHub API Key</CardTitle>
                      </div>
                      {githubApiKeyVerified && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          <CheckCircle2Icon className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </CardHeader>
                    <CardDescription className="px-6">
                      Connect to GitHub to access your repositories and issues
                    </CardDescription>
                    <CardContent className="pt-6">
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="github-api-key">API Key</Label>
                          <Input
                            id="github-api-key"
                            type="password"
                            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                            value={githubKeyInput}
                            onChange={(e) => setGithubKeyInput(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={verifyGithubKey}
                        disabled={!githubKeyInput || isVerifyingGithub}
                        className="w-full"
                      >
                        {isVerifyingGithub && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
                        {isVerifyingGithub ? "Verifying..." : "Verify API Key"}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>

                <motion.div variants={slideUp}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="flex items-center space-x-2">
                        <GitlabIcon className="h-5 w-5" />
                        <CardTitle>GitLab API Key</CardTitle>
                      </div>
                      {gitlabApiKeyVerified && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          <CheckCircle2Icon className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </CardHeader>
                    <CardDescription className="px-6">
                      Connect to GitLab to access your repositories and merge requests
                    </CardDescription>
                    <CardContent className="pt-6">
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="gitlab-api-key">API Key</Label>
                          <Input
                            id="gitlab-api-key"
                            type="password"
                            placeholder="glpat-xxxxxxxxxxxxxxxxxxxx"
                            value={gitlabKeyInput}
                            onChange={(e) => setGitlabKeyInput(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={verifyGitlabKey}
                        disabled={!gitlabKeyInput || isVerifyingGitlab}
                        className="w-full"
                      >
                        {isVerifyingGitlab && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
                        {isVerifyingGitlab ? "Verifying..." : "Verify API Key"}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </div>

              {canLoadData && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Load Repository Data</CardTitle>
                      <CardDescription>
                        Load your repositories, issues, and pull requests from GitHub and GitLab
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        You have successfully verified your API keys. Click the button below to load your repository
                        data.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={loadData} disabled={isLoadingData} className="w-full">
                        {isLoadingData && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoadingData ? "Loading Data..." : "Load Repository Data"}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}

              {dataLoaded && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CheckCircle2Icon className="mr-2 h-5 w-5 text-green-500" />
                        Data Loaded Successfully
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Your repository data has been loaded successfully. You can now view your repositories, issues,
                        and pull requests.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setDataLoaded(false)
                          toast.success("Ready to refresh data")
                        }}
                        className="w-full"
                      >
                        <RefreshCwIcon className="mr-2 h-4 w-4" />
                        Refresh Data
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
            </motion.section>

            <Separator />

            {/* AI Model Settings */}
            <motion.section variants={fadeIn} className="space-y-6">
              <h2 className="text-2xl font-semibold">AI Model Settings</h2>
              <p className="text-muted-foreground">Configure which AI models to use for different features.</p>

              <Card>
                <CardHeader>
                  <CardTitle>Default AI Model</CardTitle>
                  <CardDescription>Select the AI model to use for the assistant and other AI features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Default AI Model</Label>
                    <Select value={activeModel} onValueChange={(value) => setActiveModel(value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModels.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      This model will be used for the AI assistant and other AI features
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Feature-specific Models</h3>

                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Code Review</Label>
                          <p className="text-sm text-muted-foreground">AI model used for code review suggestions</p>
                        </div>
                        <Select defaultValue="OpenAI GPT-4o">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a model" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableModels.map((model) => (
                              <SelectItem key={model} value={model}>
                                {model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Issue Analysis</Label>
                          <p className="text-sm text-muted-foreground">AI model used for analyzing issues</p>
                        </div>
                        <Select defaultValue="Anthropic Claude 3">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a model" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableModels.map((model) => (
                              <SelectItem key={model} value={model}>
                                {model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Documentation</Label>
                          <p className="text-sm text-muted-foreground">AI model used for generating documentation</p>
                        </div>
                        <Select defaultValue="Google Gemini Pro">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a model" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableModels.map((model) => (
                              <SelectItem key={model} value={model}>
                                {model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Save AI Settings</Button>
                </CardFooter>
              </Card>
            </motion.section>

            <Separator />

            {/* Appearance Settings */}
            <motion.section variants={fadeIn} className="space-y-6">
              <h2 className="text-2xl font-semibold">Appearance</h2>
              <p className="text-muted-foreground">Customize the look and feel of the application.</p>

              <Card>
                <CardHeader>
                  <CardTitle>Theme & Display</CardTitle>
                  <CardDescription>Adjust the visual appearance of the application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable dark mode for the application</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable animations throughout the application</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label>Theme</Label>
                    <Select defaultValue="system">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Choose between light, dark, or system theme</p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label>Font Size</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Adjust the font size throughout the application</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Save Appearance Settings</Button>
                </CardFooter>
              </Card>
            </motion.section>

            <Separator />

            {/* Notification Settings */}
            <motion.section variants={fadeIn} className="space-y-6">
              <h2 className="text-2xl font-semibold">Notifications</h2>
              <p className="text-muted-foreground">Configure how and when you receive notifications.</p>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage your notification settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Types</h3>

                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Pull Request Reviews</Label>
                          <p className="text-sm text-muted-foreground">
                            Notifications for PR review requests and comments
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Issue Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Notifications for issue assignments and comments
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Merge Completions</Label>
                          <p className="text-sm text-muted-foreground">Notifications when PRs are merged</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">AI Suggestions</Label>
                          <p className="text-sm text-muted-foreground">Notifications for AI-generated suggestions</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Save Notification Settings</Button>
                </CardFooter>
              </Card>
            </motion.section>
          </div>
        </motion.div>
      </SidebarInset>
    </SidebarProvider>
  )
}

