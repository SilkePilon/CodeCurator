"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AppSidebar } from "../../components/app-sidebar"
import { ChartIssueActivity } from "../../components/chart-issue-activity"
import { IssuesTable } from "../../components/issues-table"
import { SectionIssueMetrics } from "../../components/section-issue-metrics"
import { SiteHeader } from "../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { motion } from "framer-motion"
import { fadeIn, staggerContainer } from "@/components/ui/animations"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

import data from "./data.json"

export default function IssuesPage() {
  const searchParams = useSearchParams()
  const repoFilter = searchParams.get("repo")
  const [filteredData, setFilteredData] = useState(data)

  useEffect(() => {
    if (repoFilter) {
      setFilteredData(data.filter((item) => item.repository === repoFilter))
    } else {
      setFilteredData(data)
    }
  }, [repoFilter])

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <motion.div className="flex flex-1 flex-col" initial="hidden" animate="visible" variants={staggerContainer}>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {repoFilter && (
                <motion.div className="px-4 lg:px-6" variants={fadeIn}>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="px-3 py-1 text-sm">
                      Repository: {repoFilter}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-7 px-2" asChild>
                      <a href="/issues">
                        <XIcon className="h-4 w-4 mr-1" />
                        Clear filter
                      </a>
                    </Button>
                  </div>
                </motion.div>
              )}
              <SectionIssueMetrics />
              <div className="px-4 lg:px-6">
                <ChartIssueActivity />
              </div>
              <IssuesTable data={filteredData} />
            </div>
          </div>
        </motion.div>
      </SidebarInset>
    </SidebarProvider>
  )
}

