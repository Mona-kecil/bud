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

function Todo() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Accounts Page</CardTitle>
          <CardDescription>
            Accounts page is a place where user can list their financial
            accounts. Then in transactions page, user can link each transaction
            to an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>Coming soon!</div>
          Example: bank account, cash. etc. Then user can link each expense to
          an account. <br />
          Example: Expense: IDR 300.000, Account: Bank Account. <br />
          Example: Income: IDR 300.000, Account: Cash. <br />
        </CardContent>
      </Card>
    </>
  );
}

export default function AccountsPage() {
  return <Todo />;
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
