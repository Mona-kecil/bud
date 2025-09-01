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
import { Sidebar, SidebarContent, SidebarRail } from "~/components/ui/sidebar";

export const NAV_ITEMS = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: DollarSign,
  },
  {
    title: "Budgets",
    url: "/budgets",
    icon: PieChart,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: CreditCard,
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
];

const data = {
  navMain: NAV_ITEMS,
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
