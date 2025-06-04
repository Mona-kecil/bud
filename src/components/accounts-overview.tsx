"use client"

import Image from "next/image"
import { mockAccounts } from "~/lib/mock-data"
import { Button } from "~/components/ui/button"

interface AccountsOverviewProps {
  showAll?: boolean
}

export function AccountsOverview({ showAll = false }: AccountsOverviewProps) {
  const accounts = showAll ? mockAccounts : mockAccounts.slice(0, 3)

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <div key={account.id} className="flex items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-white">
            <Image
              src={`/placeholder.svg?height=36&width=36&text=${account.institution.charAt(0)}`}
              alt={account.institution}
              width={36}
              height={36}
              className="rounded-full"
            />
          </div>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{account.name}</p>
            <p className="text-xs text-muted-foreground">{account.institution}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm font-medium">${account.balance.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">{account.type}</p>
          </div>
        </div>
      ))}
      {!showAll && (
        <Button variant="outline" className="w-full" size="sm">
          View All Accounts
        </Button>
      )}
      {showAll && (
        <Button className="w-full" size="sm">
          Link New Account
        </Button>
      )}
    </div>
  )
}
