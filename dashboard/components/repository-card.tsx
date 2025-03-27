"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  GitBranchIcon,
  GitPullRequestIcon,
  GithubIcon,
  GitlabIcon,
  FolderOpenIcon as IssueOpenedIcon,
  StarIcon,
  TrendingUp,
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { fadeIn } from "./ui/animations"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"

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
  const [isHovered, setIsHovered] = useState(false)

  // Generate random chart data for the background
  const generateChartData = (repoId: number) => {
    const seed = repoId * 13;
    return [
      { month: "Jan", value: 30 + (seed % 100), fill: "var(--chart-1)" },
      { month: "Feb", value: 40 + ((seed * 2) % 120), fill: "var(--chart-2)" },
      { month: "Mar", value: 20 + ((seed * 3) % 90), fill: "var(--chart-3)" },
      { month: "Apr", value: 70 + ((seed * 4) % 70), fill: "var(--chart-4)" },
      { month: "May", value: 50 + ((seed * 5) % 110), fill: "var(--chart-5)" },
      { month: "Jun", value: 60 + ((seed * 6) % 80), fill: "var(--chart-1)" },
    ];
  };

  const chartData = generateChartData(repository.id);
  
  const chartConfig = {
    value: {
      label: "Activity",
    },
  } satisfies ChartConfig;

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
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className={`flex flex-col h-full relative overflow-hidden transition-all ${isHovered ? 'border-blue-500 border-2' : ''}`}
        style={{ transition: 'border-color 0.3s ease' }}
      >
        {/* Background Chart */}
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} strokeOpacity={0.2} />
              <XAxis 
                dataKey="month" 
                tickLine={false} 
                axisLine={false} 
                tick={false}
              />
              <Bar
                dataKey="value"
                strokeWidth={0}
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        </div>

        <CardHeader className="pb-1 z-10 relative">
          <div className="flex items-center justify-between mb-1">
            <motion.div 
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {getPlatformIcon(repository.platform)}
            </motion.div>
            <Badge variant={repository.visibility === "Public" ? "outline" : "secondary"}>
              {repository.visibility}
            </Badge>
          </div>
          <CardTitle className="text-lg">{repository.name}</CardTitle>
          <CardDescription className="line-clamp-1">{repository.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="pb-2 z-10 relative">
          <div className="flex items-center gap-3 mb-2 justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${getLanguageColor(repository.language)}`} />
              <span className="text-sm">{repository.language}</span>
            </div>
            <motion.div 
              className="flex items-center gap-1 text-sm text-muted-foreground"
              animate={{ y: isHovered ? -2 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <StarIcon className="h-4 w-4" />
              <span>{repository.stars}</span>
            </motion.div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Link href={`/issues?repo=${encodeURIComponent(repository.name)}`} passHref>
              <Button variant="ghost" size="sm" className="p-2 h-8 w-8">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IssueOpenedIcon className="h-4 w-4" />
                </motion.div>
                <span className="sr-only">Issues ({repository.openIssues})</span>
              </Button>
            </Link>
            
            <motion.div 
              className="flex gap-1 items-center"
              animate={{ x: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">Active</span>
            </motion.div>
            
            <Link href={`/pull-requests?repo=${encodeURIComponent(repository.name)}`} passHref>
              <Button variant="ghost" size="sm" className="p-2 h-8 w-8">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <GitPullRequestIcon className="h-4 w-4" />
                </motion.div>
                <span className="sr-only">PRs ({repository.openPRs})</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

