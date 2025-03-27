"use client"

import { motion } from "framer-motion"
import { AppSidebar } from "../../components/app-sidebar"
import { SiteHeader } from "../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { GitCommitIcon, GitPullRequestIcon, MessageSquareIcon, PlusIcon, SearchIcon } from "lucide-react"
import { fadeIn, slideUp, staggerContainer } from "@/components/ui/animations"

const teamMembers = [
  {
    id: 1,
    name: "Sarah Chen",
    username: "sarahchen",
    role: "Frontend Developer",
    avatar: "/placeholder.svg?height=100&width=100",
    email: "sarah@example.com",
    commits: 156,
    prs: 24,
    issues: 18,
    status: "active",
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Eddie Lake",
    username: "eddielake",
    role: "Backend Developer",
    avatar: "/placeholder.svg?height=100&width=100",
    email: "eddie@example.com",
    commits: 203,
    prs: 31,
    issues: 12,
    status: "active",
    lastActive: "5 minutes ago",
  },
  {
    id: 3,
    name: "Jamik Tashpulatov",
    username: "jamiktashpulatov",
    role: "DevOps Engineer",
    avatar: "/placeholder.svg?height=100&width=100",
    email: "jamik@example.com",
    commits: 178,
    prs: 19,
    issues: 8,
    status: "away",
    lastActive: "1 day ago",
  },
  {
    id: 4,
    name: "Raj Patel",
    username: "rajpatel",
    role: "Full Stack Developer",
    avatar: "/placeholder.svg?height=100&width=100",
    email: "raj@example.com",
    commits: 134,
    prs: 22,
    issues: 15,
    status: "active",
    lastActive: "30 minutes ago",
  },
  {
    id: 5,
    name: "Maya Johnson",
    username: "mayajohnson",
    role: "UI/UX Designer",
    avatar: "/placeholder.svg?height=100&width=100",
    email: "maya@example.com",
    commits: 89,
    prs: 17,
    issues: 21,
    status: "offline",
    lastActive: "3 days ago",
  },
  {
    id: 6,
    name: "Thomas Wilson",
    username: "thomaswilson",
    role: "Database Administrator",
    avatar: "/placeholder.svg?height=100&width=100",
    email: "thomas@example.com",
    commits: 112,
    prs: 14,
    issues: 9,
    status: "active",
    lastActive: "1 hour ago",
  },
  {
    id: 7,
    name: "Leila Ahmadi",
    username: "leilaahmadi",
    role: "Frontend Developer",
    avatar: "/placeholder.svg?height=100&width=100",
    email: "leila@example.com",
    commits: 143,
    prs: 26,
    issues: 14,
    status: "active",
    lastActive: "15 minutes ago",
  },
  {
    id: 8,
    name: "Carlos Rodriguez",
    username: "carlosrodriguez",
    role: "QA Engineer",
    avatar: "/placeholder.svg?height=100&width=100",
    email: "carlos@example.com",
    commits: 98,
    prs: 12,
    issues: 27,
    status: "away",
    lastActive: "4 hours ago",
  },
]

export default function TeamPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <motion.div className="flex flex-1 flex-col p-6" initial="hidden" animate="visible" variants={staggerContainer}>
          <div className="flex items-center justify-between mb-6">
            <motion.h1 className="text-3xl font-bold" variants={fadeIn}>
              Team Members
            </motion.h1>
            <motion.div className="flex items-center gap-4" variants={fadeIn}>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search team members..." className="pl-10 w-[250px]" />
              </div>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={staggerContainer}
          >
            {teamMembers.map((member, index) => (
              <motion.div key={member.id} variants={slideUp} transition={{ delay: index * 0.05 }}>
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Avatar className="h-12 w-12 border-2 border-primary">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <Badge
                        variant={
                          member.status === "active" ? "default" : member.status === "away" ? "outline" : "secondary"
                        }
                      >
                        {member.status}
                      </Badge>
                    </div>
                    <CardTitle className="mt-2">{member.name}</CardTitle>
                    <CardDescription className="flex flex-col">
                      <span>@{member.username}</span>
                      <span>{member.role}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <GitCommitIcon className="h-4 w-4" />
                          <span>{member.commits}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Commits</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <GitPullRequestIcon className="h-4 w-4" />
                          <span>{member.prs}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">PRs</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <MessageSquareIcon className="h-4 w-4" />
                          <span>{member.issues}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Issues</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <span className="text-xs text-muted-foreground">Active {member.lastActive}</span>
                    <Button variant="ghost" size="sm">
                      View Profile
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </SidebarInset>
    </SidebarProvider>
  )
}

