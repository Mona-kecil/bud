import { mockAccounts } from "~/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default function AccountsOverviewCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounts Overview</CardTitle>
        <CardDescription>Summary of your financial accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <AccountsOverview />
      </CardContent>
    </Card>
  );
}

function AccountsOverview() {
  const accounts = mockAccounts
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 3);

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
            <p className="text-sm leading-none font-medium">{account.name}</p>
            <p className="text-muted-foreground text-xs">
              {account.institution}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm font-medium">${account.balance.toFixed(2)}</p>
            <p className="text-muted-foreground text-xs">{account.type}</p>
          </div>
        </div>
      ))}
      <Link href="/accounts" passHref>
        <Button variant="outline" className="w-full" size="sm">
          View All Accounts
        </Button>
      </Link>
    </div>
  );
}
