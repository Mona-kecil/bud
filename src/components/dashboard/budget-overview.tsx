import { mockBudgets } from "~/lib/mock-data";
import {
  Card,
  CardDescription,
  CardTitle,
  CardHeader,
  CardContent,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { formatCurrency } from "~/lib/utils";
import Link from "next/link";

export default function BudgetOverviewCard() {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
        <CardDescription>Your monthly budget progress</CardDescription>
      </CardHeader>
      <CardContent>
        <BudgetOverview />
      </CardContent>
    </Card>
  );
}

function BudgetOverview() {
  const budgets = mockBudgets
    .sort((a, b) => {
      const percentageA = (a.spent / a.limit) * 100;
      const percentageB = (b.spent / b.limit) * 100;
      return percentageB - percentageA;
    })
    .slice(0, 4);

  return (
    <div className="space-y-4">
      {budgets.map((budget) => {
        const percentage = Math.min(100, (budget.spent / budget.limit) * 100);
        const isOverBudget = budget.spent > budget.limit;

        return (
          <div key={budget.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">{budget.category}</div>
                <div className="text-muted-foreground text-xs">
                  {formatCurrency(budget.spent)} of{" "}
                  {formatCurrency(budget.limit)}
                </div>
              </div>
              <div
                className={`text-sm font-medium ${isOverBudget ? "text-red-500" : ""}`}
              >
                {percentage.toFixed(0)}%
              </div>
            </div>
            <Progress
              value={percentage}
              className={`h-2 ${isOverBudget ? "bg-red-100" : ""}`}
            />
          </div>
        );
      })}
      <Link href="/budgets" passHref>
        <Button variant="outline" className="w-full" size="sm">
          View All Budgets
        </Button>
      </Link>
    </div>
  );
}
