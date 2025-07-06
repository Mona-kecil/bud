"use client";

import * as React from "react";
import {
  CreditCard,
  DollarSign,
  PieChart,
  PiggyBank,
  Banknote,
} from "lucide-react";

import { NavMain } from "~/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "~/components/ui/sidebar";

// This is sample data.
// TODO: Replace with actual user data
// TODO: Replace navigation with actual pages
// TODO: Remove projects Section
const data = {
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
    {
      title: "Accounts",
      url: "/accounts",
      icon: Banknote,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
