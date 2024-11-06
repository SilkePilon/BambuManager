"use client";

import * as React from "react";
import {
  BadgeCheck,
  Bell,
  BookOpen,
  BoxesIcon,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  Folder,
  Frame,
  LifeBuoy,
  LogOut,
  Map,
  MoreHorizontal,
  PieChart,
  Send,
  Settings2,
  Share,
  Sparkles,
  FileUpIcon,
  Trash2,
  BoxIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Printers",
      url: "/",
      icon: BoxIcon,
      isActive: true,
      items: [
        {
          title: "P1S (Online)",
          url: "#",
        },
        {
          title: "P1P (Online)",
          url: "#",
        },
        {
          title: "X1c (Offline)",
          url: "#",
        },
      ],
    },
    {
      title: "Print Farm",
      url: "/farm",
      icon: BoxesIcon,
    },
    {
      title: "Uploads",
      url: "/uploads",
      icon: FileUpIcon,
    },
    {
      title: "Documentation",
      url: "/docs",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Popular Models",
      url: "#",
      icon: Frame,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Layer_2"
                    data-name="Layer 2"
                    viewBox="0 0 499.87 650.42"
                    className="size-7"
                    fill="white"
                    style={{ borderRadius: "10px" }}
                  >
                    <g id="Layer_1-2" data-name="Layer 1">
                      <g>
                        <path d="M268.35,242.77c13.19,5.16,25.85,10.1,38.49,15.08,62.68,24.68,125.34,49.4,188.07,73.97,3.64,1.42,4.97,3.05,4.96,7.12-.14,101.82-.11,203.65-.11,305.47,0,1.78,0,3.57,0,5.67-2.18,.1-3.8,.24-5.43,.24-73.49,.01-146.99-.03-220.48,.1-4.51,0-5.88-1.09-5.88-5.77,.13-132.15,.1-264.31,.11-396.46,0-1.6,.14-3.2,.25-5.42Z" />
                        <path d="M.35,0H231.48c.1,1.65,.26,3.1,.26,4.55,.03,5.5,0,11,.01,16.49,.08,96.29,.13,192.58,.36,288.87,.01,4.7-1.38,6.87-5.8,8.6-73.4,28.72-146.72,57.64-220.06,86.51-1.8,.71-3.65,1.29-5.91,2.08V0Z" />
                        <path d="M231.61,650.32h-6.48c-72.82,0-145.64,0-218.47,0q-6.57,0-6.58-6.37c0-63.99,.04-127.98-.09-191.97,0-4.05,1.05-6.05,5.04-7.61,74.17-29.07,148.26-58.32,222.38-87.52,1.2-.47,2.47-.79,4.19-1.32v294.79Z" />
                        <path d="M268.09,.01h231.38V294.51c-2.37-.82-4.64-1.51-6.84-2.38-73.17-28.83-146.33-57.72-219.55-86.42-3.99-1.56-5.08-3.5-5.07-7.57,.12-64.14,.09-128.27,.09-192.41,0-1.79,0-3.59,0-5.72Z" />
                      </g>
                    </g>
                  </svg>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate">
                    <strong>Bambulab Manager</strong>
                  </span>
                  <span
                    style={{ marginTop: "2px" }}
                    className="truncate text-xs"
                  >
                    <strong>by Silke - v0.0.1</strong>
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
