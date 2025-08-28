import { PlusCircle } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { AccountsOverview } from "~/components/accounts-overview";
import { mockAccounts } from "~/lib/mock-data";
import { formatCurrency } from "~/lib/utils";

export default function AccountsPage() {
  return <div>Coming soon!</div>;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Link Account
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-hand text-sm font-medium">
              Total Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                mockAccounts
                  .filter((account) => account.type !== "Credit")
                  .reduce((sum, account) => sum + account.balance, 0),
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-hand text-sm font-medium">
              Total Debt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                mockAccounts
                  .filter((account) => account.type === "Credit")
                  .reduce((sum, account) => sum + account.balance, 0),
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-hand text-sm font-medium">
              Net Worth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                mockAccounts
                  .filter((account) => account.type !== "Credit")
                  .reduce((sum, account) => sum + account.balance, 0) -
                  mockAccounts
                    .filter((account) => account.type === "Credit")
                    .reduce((sum, account) => sum + account.balance, 0),
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-hand text-sm font-medium">
              Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAccounts.length}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-hand">All Accounts</CardTitle>
          <CardDescription>
            Manage your connected financial accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccountsOverview showAll={true} />
        </CardContent>
      </Card>
    </div>
  );
}
