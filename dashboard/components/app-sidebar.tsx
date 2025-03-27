"use client"

import type * as React from "react"
import {
  ArrowUpCircleIcon,
  CodeIcon,
  GitPullRequestIcon,
  GithubIcon,
  GitlabIcon,
  HelpCircleIcon,
  FolderOpenIcon as IssueOpenedIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"
import Link from "next/link"

import { NavRepositories } from "./nav-repositories"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "devuser",
    email: "dev@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Issues",
      url: "/issues",
      icon: IssueOpenedIcon,
    },
    {
      title: "Pull Requests",
      url: "/pull-requests",
      icon: GitPullRequestIcon,
    },
    {
      title: "Merge Requests",
      url: "/merge-requests",
      icon: GitPullRequestIcon,
    },
    {
      title: "Code",
      url: "/code",
      icon: CodeIcon,
    },
    {
      title: "Team",
      url: "/team",
      icon: UsersIcon,
    },
  ],
  navRepositories: [
    {
      name: "frontend/user-portal",
      url: "#",
      icon: GithubIcon,
    },
    {
      name: "backend/api",
      url: "#",
      icon: GitlabIcon,
    },
    {
      name: "backend/auth-service",
      url: "#",
      icon: GithubIcon,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/dashboard">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">DevFlow</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavRepositories items={data.navRepositories} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

