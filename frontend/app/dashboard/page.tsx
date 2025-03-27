"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { AppSidebar } from "../../components/app-sidebar"
import { SiteHeader } from "../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RepositoryCard } from "../../components/repository-card"
import { fadeIn, slideUp, staggerContainer } from "@/components/ui/animations"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { NewRepositoryDialog } from "../../components/new-repository-dialog"

import repositories from "./repositories.json"

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const [showNewRepoDialog, setShowNewRepoDialog] = useState(false)

  const filteredRepos = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <motion.div className="flex flex-1 flex-col" initial="hidden" animate="visible" variants={staggerContainer}>
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="flex items-center justify-between mb-6">
                <motion.h2 className="text-2xl font-semibold" variants={fadeIn}>
                  Repositories
                </motion.h2>
                <motion.div className="flex items-center gap-4" variants={fadeIn}>
                  <Button onClick={() => setShowNewRepoDialog(true)}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    New Repository
                  </Button>
                </motion.div>
              </div>

              {searchQuery && (
                <motion.div className="mb-4" variants={fadeIn}>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      Showing results for: <span className="font-medium text-foreground">{searchQuery}</span>
                    </p>
                    <Button variant="ghost" size="sm" className="h-7 px-2" asChild>
                      <a href="/dashboard">Clear search</a>
                    </Button>
                  </div>
                </motion.div>
              )}

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                variants={staggerContainer}
              >
                {filteredRepos.map((repo, index) => (
                  <motion.div key={repo.id} variants={slideUp} transition={{ delay: index * 0.05 }}>
                    <RepositoryCard repository={repo} />
                  </motion.div>
                ))}

                {filteredRepos.length === 0 && (
                  <motion.div
                    className="col-span-full flex flex-col items-center justify-center p-12 text-center"
                    variants={fadeIn}
                  >
                    <div className="rounded-full bg-muted p-6 mb-4">
                      <SearchIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No repositories found</h3>
                    <p className="text-muted-foreground mb-4">
                      We couldn't find any repositories matching your search.
                    </p>
                    <Button asChild>
                      <a href="/dashboard">Clear Search</a>
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </SidebarInset>

      <NewRepositoryDialog open={showNewRepoDialog} onOpenChange={setShowNewRepoDialog} />
    </SidebarProvider>
  )
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

