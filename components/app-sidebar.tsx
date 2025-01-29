"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Logo from "@/public/assets/logo_IRIS.png";

import { userData, solutionItems, navMainItems } from "./sidebar-data";
import { Separator } from "@radix-ui/react-separator";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className={isDarkTheme ? "dark" : ""}
    >
      <SidebarHeader>
        <div className="flex items-center justify-center px-2 py-3">
          <Image height={100} width={100} alt="logo" src={Logo}></Image>
        </div>
        <Separator className="my-1" />
        <TeamSwitcher teams={solutionItems} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
