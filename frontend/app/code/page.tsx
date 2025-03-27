"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AppSidebar } from "../../components/app-sidebar"
import { SiteHeader } from "../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BrainCircuitIcon,
  CodeIcon,
  FileIcon,
  FolderIcon,
  GitBranchIcon,
  GitCommitIcon,
  GitForkIcon,
  GitPullRequestIcon,
  SearchIcon,
  StarIcon,
} from "lucide-react"
import { fadeIn, slideUp, staggerContainer } from "@/components/ui/animations"
import { useAIStore } from "@/lib/stores/ai-store"

const repositories = [
  {
    id: 1,
    name: "frontend/user-portal",
    description: "User-facing portal for account management and dashboard",
    language: "TypeScript",
    lastCommit: "2 hours ago",
    branches: 4,
    stars: 24,
  },
  {
    id: 2,
    name: "backend/api",
    description: "Core API services for the application",
    language: "Go",
    lastCommit: "1 day ago",
    branches: 3,
    stars: 18,
  },
  {
    id: 3,
    name: "backend/auth-service",
    description: "Authentication and authorization service",
    language: "TypeScript",
    lastCommit: "3 days ago",
    branches: 2,
    stars: 15,
  },
]

const files = [
  {
    id: 1,
    name: "app/dashboard/page.tsx",
    type: "file",
    size: "4.2 KB",
    lastModified: "2 hours ago",
    author: "sarahchen",
  },
  {
    id: 2,
    name: "components",
    type: "folder",
    size: "Directory",
    lastModified: "1 day ago",
    author: "eddielake",
  },
  {
    id: 3,
    name: "lib/utils.ts",
    type: "file",
    size: "1.8 KB",
    lastModified: "3 days ago",
    author: "jamiktashpulatov",
  },
  {
    id: 4,
    name: "app/layout.tsx",
    type: "file",
    size: "2.5 KB",
    lastModified: "5 days ago",
    author: "sarahchen",
  },
  {
    id: 5,
    name: "public",
    type: "folder",
    size: "Directory",
    lastModified: "1 week ago",
    author: "mayajohnson",
  },
]

const commits = [
  {
    id: "abc123",
    message: "Fix authentication bug in login flow",
    author: "sarahchen",
    date: "2 hours ago",
    branch: "main",
  },
  {
    id: "def456",
    message: "Add dark mode support to dashboard",
    author: "eddielake",
    date: "1 day ago",
    branch: "feature/dark-mode",
  },
  {
    id: "ghi789",
    message: "Optimize database queries for user search",
    author: "rajpatel",
    date: "3 days ago",
    branch: "main",
  },
  {
    id: "jkl012",
    message: "Implement JWT token refresh mechanism",
    author: "jamiktashpulatov",
    date: "5 days ago",
    branch: "feature/jwt-refresh",
  },
  {
    id: "mno345",
    message: "Update dependencies to fix security vulnerabilities",
    author: "mayajohnson",
    date: "1 week ago",
    branch: "main",
  },
]

export default function CodePage() {
  const [selectedRepo, setSelectedRepo] = useState(repositories[0].name)
  const { activeModel } = useAIStore()

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <motion.div className="flex flex-1 flex-col p-6" initial="hidden" animate="visible" variants={staggerContainer}>
          <div className="flex items-center justify-between mb-6">
            <motion.h1 className="text-3xl font-bold" variants={fadeIn}>
              Code Explorer
            </motion.h1>
            <motion.div className="flex items-center gap-4" variants={fadeIn}>
              <Select value={selectedRepo} onValueChange={setSelectedRepo}>
                <SelectTrigger className="w-[250px]">
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
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search code..." className="pl-10 w-[250px]" />
              </div>
            </motion.div>
          </div>

          <Tabs defaultValue="files" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="commits">Commits</TabsTrigger>
              <TabsTrigger value="branches">Branches</TabsTrigger>
              <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="files">
              <motion.div variants={slideUp}>
                <Card>
                  <CardHeader>
                    <CardTitle>Repository Files</CardTitle>
                    <CardDescription>Browse files in {selectedRepo}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[400px]">Name</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Last Modified</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {files.map((file) => (
                          <TableRow key={file.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {file.type === "folder" ? (
                                  <FolderIcon className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <FileIcon className="h-4 w-4 text-gray-500" />
                                )}
                                {file.name}
                              </div>
                            </TableCell>
                            <TableCell>{file.size}</TableCell>
                            <TableCell>{file.lastModified}</TableCell>
                            <TableCell>{file.author}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="commits">
              <motion.div variants={slideUp}>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Commits</CardTitle>
                    <CardDescription>View recent commits to {selectedRepo}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Commit ID</TableHead>
                          <TableHead className="w-[400px]">Message</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Branch</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {commits.map((commit) => (
                          <TableRow key={commit.id}>
                            <TableCell className="font-mono text-xs">{commit.id.substring(0, 7)}</TableCell>
                            <TableCell className="font-medium">{commit.message}</TableCell>
                            <TableCell>{commit.author}</TableCell>
                            <TableCell>{commit.date}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="flex w-fit items-center gap-1">
                                <GitBranchIcon className="h-3 w-3" />
                                {commit.branch}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="branches">
              <motion.div variants={slideUp}>
                <Card>
                  <CardHeader>
                    <CardTitle>Branches</CardTitle>
                    <CardDescription>View and manage branches in {selectedRepo}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle className="text-lg">main</CardTitle>
                            <Badge>Default</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <GitCommitIcon className="h-4 w-4" />
                            <span>Last commit 2 hours ago</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <GitPullRequestIcon className="h-4 w-4" />
                            <span>3 open pull requests</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" className="w-full">
                            View Branch
                          </Button>
                        </CardFooter>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">feature/dark-mode</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <GitCommitIcon className="h-4 w-4" />
                            <span>Last commit 1 day ago</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <GitPullRequestIcon className="h-4 w-4" />
                            <span>1 open pull request</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" className="w-full">
                            View Branch
                          </Button>
                        </CardFooter>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">feature/jwt-refresh</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <GitCommitIcon className="h-4 w-4" />
                            <span>Last commit 5 days ago</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <GitPullRequestIcon className="h-4 w-4" />
                            <span>1 open pull request</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" className="w-full">
                            View Branch
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="ai-insights">
              <motion.div variants={slideUp}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BrainCircuitIcon className="h-5 w-5" />
                          AI Code Insights
                        </CardTitle>
                        <CardDescription>AI-powered insights and suggestions for your codebase</CardDescription>
                      </div>
                      <Badge variant="outline">Using {activeModel}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-950">
                        <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                          <CodeIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                          Code Quality Analysis
                        </h3>
                        <p className="text-sm mb-4">
                          Based on analysis of your codebase, here are some insights and recommendations:
                        </p>
                        <div className="space-y-3">
                          <div className="rounded-md bg-white dark:bg-gray-800 p-3 border border-green-200 dark:border-green-800">
                            <h4 className="text-sm font-medium mb-1">Consistent Code Style</h4>
                            <p className="text-sm text-muted-foreground">
                              Your codebase has consistent styling across most files. Consider adding ESLint and
                              Prettier to enforce consistent style across all files.
                            </p>
                          </div>
                          <div className="rounded-md bg-white dark:bg-gray-800 p-3 border border-yellow-200 dark:border-yellow-800">
                            <h4 className="text-sm font-medium mb-1">Test Coverage</h4>
                            <p className="text-sm text-muted-foreground">
                              Test coverage is currently at 68%. Consider adding more tests for the authentication and
                              user management modules.
                            </p>
                          </div>
                          <div className="rounded-md bg-white dark:bg-gray-800 p-3 border border-blue-200 dark:border-blue-800">
                            <h4 className="text-sm font-medium mb-1">Performance Optimization</h4>
                            <p className="text-sm text-muted-foreground">
                              Several components could benefit from memoization to prevent unnecessary re-renders. Check
                              components in the dashboard module.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                          <GitForkIcon className="h-5 w-5" />
                          Repository Structure
                        </h3>
                        <p className="text-sm mb-4">Analysis of your repository structure and organization:</p>
                        <div className="space-y-3">
                          <div className="rounded-md bg-muted p-3">
                            <h4 className="text-sm font-medium mb-1">Well-Organized Structure</h4>
                            <p className="text-sm text-muted-foreground">
                              Your repository follows a clean and organized structure with clear separation of concerns.
                            </p>
                          </div>
                          <div className="rounded-md bg-muted p-3">
                            <h4 className="text-sm font-medium mb-1">Documentation</h4>
                            <p className="text-sm text-muted-foreground">
                              Consider adding more inline documentation for complex functions and components to improve
                              maintainability.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                          <StarIcon className="h-5 w-5" />
                          Recommendations
                        </h3>
                        <p className="text-sm mb-4">Based on your codebase, here are some recommendations:</p>
                        <div className="space-y-3">
                          <div className="rounded-md bg-muted p-3">
                            <h4 className="text-sm font-medium mb-1">Dependency Management</h4>
                            <p className="text-sm text-muted-foreground">
                              Several dependencies are outdated. Consider updating to the latest versions for security
                              and performance improvements.
                            </p>
                          </div>
                          <div className="rounded-md bg-muted p-3">
                            <h4 className="text-sm font-medium mb-1">Error Handling</h4>
                            <p className="text-sm text-muted-foreground">
                              Implement more robust error handling in API calls and form submissions to improve user
                              experience.
                            </p>
                          </div>
                          <div className="rounded-md bg-muted p-3">
                            <h4 className="text-sm font-medium mb-1">Accessibility</h4>
                            <p className="text-sm text-muted-foreground">
                              Add ARIA attributes to interactive elements and ensure proper keyboard navigation for
                              better accessibility.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      <BrainCircuitIcon className="mr-2 h-4 w-4" />
                      Generate Detailed Report
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </SidebarInset>
    </SidebarProvider>
  )
}

