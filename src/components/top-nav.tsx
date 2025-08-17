"use client";

import { UserButton } from "@clerk/nextjs";
import { Settings, UserCircle } from "lucide-react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export default function TopNav() {
  const pathname = usePathname();
  const currentPageTitle = pathname.slice(1, 2).toLocaleUpperCase() + pathname.slice(2);

  const onSettingButtonClicked = () => {
    toast.message("We don't have this feature yet 😭")
  }

  return (
    <div className="w-full flex justify-between items-center">
      {/* settings button */}
      <Button variant="ghost" size={"icon"} onClick={onSettingButtonClicked}>
        <Settings />
      </Button>
      {/* current page title*/}
      <h1 className="font-bold text-xl">{currentPageTitle}</h1>
      {/* user button */}
      <UserButton fallback={<UserCircle />} />
    </div>
  )
}