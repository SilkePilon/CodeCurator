"use client"

import * as React from "react"
import { AnimatePresence } from "framer-motion"
import {
  GitPullRequestIcon,
  FolderOpenIcon as IssueOpenedIcon,
  PlusCircleIcon,
  FolderIcon,
  FileIcon,
  GitBranchIcon,
  GitMergeIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NewRepositoryDialog } from "./new-repository-dialog"
import { NewIssueDialog } from "./new-issue-dialog"
import { NewPullRequestDialog } from "./new-pull-request-dialog"

export function QuickCreateMenu() {
  const [showNewRepoDialog, setShowNewRepoDialog] = React.useState(false)
  const [showNewIssueDialog, setShowNewIssueDialog] = React.useState(false)
  const [showNewPRDialog, setShowNewPRDialog] = React.useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground">
            <PlusCircleIcon />
            <span>Quick Create</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={() => setShowNewRepoDialog(true)}>
            <FolderIcon className="mr-2 h-4 w-4" />
            <span>New Repository</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowNewIssueDialog(true)}>
            <IssueOpenedIcon className="mr-2 h-4 w-4" />
            <span>New Issue</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowNewPRDialog(true)}>
            <GitPullRequestIcon className="mr-2 h-4 w-4" />
            <span>New Pull Request</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <GitMergeIcon className="mr-2 h-4 w-4" />
            <span>New Merge Request</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <GitBranchIcon className="mr-2 h-4 w-4" />
            <span>New Branch</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileIcon className="mr-2 h-4 w-4" />
            <span>New File</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AnimatePresence>
        {showNewRepoDialog && <NewRepositoryDialog open={showNewRepoDialog} onOpenChange={setShowNewRepoDialog} />}

        {showNewIssueDialog && <NewIssueDialog open={showNewIssueDialog} onOpenChange={setShowNewIssueDialog} />}

        {showNewPRDialog && <NewPullRequestDialog open={showNewPRDialog} onOpenChange={setShowNewPRDialog} />}
      </AnimatePresence>
    </>
  )
}

