"use client";

import * as React from "react";
import {
  ArrowBigUp,
  BookOpen,
  Bot,
  CircleDollarSign,
  CommandIcon,
  CreditCard,
  DollarSign,
  PieChart,
  PiggyBank,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "~/components/nav-main";
import { NavUser } from "~/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";

// This is sample data.
// TODO: Replace with actual user data
// TODO: Replace navigation with actual pages
// TODO: Remove projects Section
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/favicon.ico",
  },
  teams: [
    {
      name: "Personal",
      logo: CommandIcon,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: "/",
      icon: DollarSign,
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: CreditCard,
    },
    {
      title: "Budgets",
      url: "/budgets",
      icon: PieChart,
    },
    {
      title: "Goals",
      url: "/goals",
      icon: PiggyBank,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
