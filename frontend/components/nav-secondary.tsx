"use client";
import * as React from "react";
import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { setTheme, theme } = useTheme();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                <a href={item.url} className="flex items-center gap-2">
                  <item.icon />
                  <span>
                    <strong>{item.title}</strong>
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <SidebarMenuItem key="toggle2">
            <SidebarMenuButton
              asChild
              size="sm"
              className="flex items-center gap-2 text-left"
            >
              <button
                onClick={() =>
                  setTheme((prevTheme) =>
                    prevTheme === "dark" ? "light" : "dark"
                  )
                }
                className="flex items-center gap-2"
              >
                {theme === "dark" ? <Moon /> : <Sun />}
                <span>
                  <strong>
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </strong>
                </span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
