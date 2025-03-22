"use client";

import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import ThemeButton from "../ThemeButton";
import { useUser, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { LogOut } from "lucide-react";

function DashboardNavbar() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-b-slate-500 px-3">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="cursor-pointer" />
      </div>
      <div className="flex items-center gap-4">
        <ThemeButton />
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <Avatar className="h-10 w-10 rounded-full cursor-pointer">
              <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-black border border-slate-400 dark:border-slate-700">
          <DropdownMenuItem
                    onClick={() => signOut()}
                    className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-600/20 dark:hover:bg-red-600/20 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default DashboardNavbar;
