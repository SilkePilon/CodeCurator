"use client"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { AIAssistantDialog } from "./ai-assistant-dialog"
import { CommandSearch } from "./command-search"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader() {
  const pathname = usePathname()

  let title = "Repository Overview"
  if (pathname.includes("/issues")) {
    title = "Issues"
  } else if (pathname.includes("/merge-requests")) {
    title = "Merge Requests"
  } else if (pathname.includes("/pull-requests")) {
    title = "Pull Requests"
  } else if (pathname.includes("/team")) {
    title = "Team"
  } else if (pathname.includes("/code")) {
    title = "Code Explorer"
  } else if (pathname.includes("/settings")) {
    title = "Settings"
  }

  return (
    <motion.header
      className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <motion.h1
          className="text-base font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={title} // This forces re-animation when title changes
        >
          {title}
        </motion.h1>
        <div className="ml-auto flex items-center gap-2">
          <CommandSearch />
          <ThemeToggle />
          <AIAssistantDialog />
        </div>
      </div>
    </motion.header>
  )
}

