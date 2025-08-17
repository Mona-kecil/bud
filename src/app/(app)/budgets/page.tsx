import { PlusCircle } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { BudgetOverview } from "~/components/budget-overview";
import { mockBudgets } from "~/lib/mock-data";
import { formatCurrency } from "~/lib/utils";

export default function BudgetsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Budget
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Budgeted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                mockBudgets.reduce((sum, budget) => sum + budget.limit, 0),
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                mockBudgets.reduce((sum, budget) => sum + budget.spent, 0),
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                mockBudgets.reduce((sum, budget) => sum + budget.limit, 0) -
                  mockBudgets.reduce((sum, budget) => sum + budget.spent, 0),
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (mockBudgets.reduce((sum, budget) => sum + budget.spent, 0) /
                  mockBudgets.reduce((sum, budget) => sum + budget.limit, 0)) *
                  100,
              )}
              %
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Budgets</CardTitle>
          <CardDescription>
            Track your spending against budget categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetOverview showAll={true} />
        </CardContent>
      </Card>
    </div>
  );
}
