"use client";

import { mockBudgets } from "~/lib/mock-data";
import { Progress } from "~/components/ui/progress";
import { Button } from "~/components/ui/button";
import { formatCurrency } from "~/lib/utils";

interface BudgetOverviewProps {
  showAll?: boolean;
}

export function BudgetOverview({ showAll = false }: BudgetOverviewProps) {
  const budgets = showAll ? mockBudgets : mockBudgets.slice(0, 4);

  return (
    <div className="space-y-4">
      {budgets.map((budget) => {
        const pct = (budget.spent / budget.limit) * 100;
        const percentage = Math.min(100, Math.max(pct, 0));
        const isOverBudget = pct >= 100;

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
              className="h-2"
              indicatorClassName={isOverBudget ? "bg-destructive" : undefined}
            />
            {isOverBudget && (
              <div className="text-destructive text-xs">Overspent</div>
            )}
          </div>
        );
      })}
      {!showAll && (
        <Button variant="outline" className="w-full" size="sm">
          View All Budgets
        </Button>
      )}
      {showAll && (
        <Button className="w-full" size="sm">
          Create New Budget
        </Button>
      )}
    </div>
  );
}
