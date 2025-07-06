"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import {
  SidebarMenu,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

export function NavUser() {
  const user = useUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2">
          <UserButton />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {user.user?.fullName ?? "User"}
            </span>
            <span className="text-xs text-muted-foreground">
              {user.user?.emailAddresses[0]?.emailAddress ?? "No email"}
            </span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
