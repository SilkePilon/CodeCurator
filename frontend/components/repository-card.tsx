"use client"

import { motion } from "framer-motion"
import {
  GitBranchIcon,
  GitPullRequestIcon,
  GithubIcon,
  GitlabIcon,
  FolderOpenIcon as IssueOpenedIcon,
  StarIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { fadeIn } from "./ui/animations"

interface RepositoryCardProps {
  repository: {
    id: number
    name: string
    description: string
    language: string
    stars: number
    forks: number
    openIssues: number
    openPRs: number
    lastActivity: string
    platform: string
    visibility: string
    contributors: number
    branches: number
    deployments: number
    ciStatus: string
  }
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  const getLanguageColor = (language: string) => {
    switch (language) {
      case "TypeScript":
        return "bg-blue-500"
      case "Go":
        return "bg-cyan-500"
      case "Java":
        return "bg-orange-500"
      case "Python":
        return "bg-green-500"
      case "Swift":
        return "bg-red-500"
      case "YAML":
        return "bg-purple-500"
      case "Markdown":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "GitHub":
        return <GithubIcon className="h-4 w-4" />
      case "GitLab":
        return <GitlabIcon className="h-4 w-4" />
      default:
        return <GithubIcon className="h-4 w-4" />
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="flex flex-col h-full transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-1">
            {getPlatformIcon(repository.platform)}
            <Badge variant={repository.visibility === "Public" ? "outline" : "secondary"}>
              {repository.visibility}
            </Badge>
          </div>
          <CardTitle className="text-lg">{repository.name}</CardTitle>
          <CardDescription className="line-clamp-2">{repository.description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center gap-2 mb-2">
            <div className={`h-3 w-3 rounded-full ${getLanguageColor(repository.language)}`} />
            <span className="text-sm">{repository.language}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <StarIcon className="h-4 w-4" />
              <span>{repository.stars}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <GitBranchIcon className="h-4 w-4" />
              <span>{repository.branches} branches</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-2 pt-2">
          <Link href={`/issues?repo=${encodeURIComponent(repository.name)}`} passHref>
            <Button variant="outline" size="sm" className="w-full">
              <IssueOpenedIcon className="h-4 w-4 mr-1" />
              Issues ({repository.openIssues})
            </Button>
          </Link>
          <Link href={`/pull-requests?repo=${encodeURIComponent(repository.name)}`} passHref>
            <Button variant="outline" size="sm" className="w-full">
              <GitPullRequestIcon className="h-4 w-4 mr-1" />
              PRs ({repository.openPRs})
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

