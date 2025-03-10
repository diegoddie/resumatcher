"use client";

import * as React from "react";
import {
  LayoutDashboard,
  BarChart,
  FilePlus,
  User,
  Briefcase,
} from "lucide-react";

import { NavMain } from "@/components/Dashboard/Sidebar/nav-main";
import { NavUser } from "@/components/Dashboard/Sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "New Research",
      url: "/upload",
      icon: FilePlus,
    },
    {
      title: "Job Reports",
      url: "/reports",
      icon: BarChart,
    },
    {
      title: "Account",
      url: "/account",
      icon: User,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-r-black/30 dark:border-r-slate-500">
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="text-left text-lg leading-tight">
            <span className="truncate font-medium">Resumatcher</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent className="pt-5">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <div className="border-t border-gray-200 mx-3"></div>
      <SidebarFooter className="">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
