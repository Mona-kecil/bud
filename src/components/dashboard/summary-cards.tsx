import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatCurrency, formatPercentage } from "~/lib/utils";

export default function SummaryCards({
  data,
}: {
  data: {
    totalBalance: { value: number; change: number };
    monthlyIncome: { value: number; change: number };
    monthlySpending: { value: number; change: number };
    savingsRate: { value: number; change: number };
  };
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Balance Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <DollarSign className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(data.totalBalance.value)}
          </div>
          <p className="text-muted-foreground text-xs">
            {data.totalBalance.change > 0 ? "+" : ""}
            {formatCurrency(data.totalBalance.change)} from last month
          </p>
        </CardContent>
      </Card>

      {/* Monthly Income Card*/}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
          <DollarSign className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(data.monthlyIncome.value)}
          </div>
          <p className="text-muted-foreground text-xs">
            {data.monthlyIncome.change > 0 ? "+" : ""}
            {formatCurrency(data.monthlyIncome.change)} from last month
          </p>
        </CardContent>
      </Card>

      {/* Monthly Spending Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Monthly Spending
          </CardTitle>
          <DollarSign className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(data.monthlySpending.value)}
          </div>
          <p className="text-muted-foreground text-xs">
            {data.monthlySpending.change > 0 ? "+" : ""}
            {formatCurrency(data.monthlySpending.change)} from last month
          </p>
        </CardContent>
      </Card>

      {/* Savings Rate Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
          <DollarSign className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPercentage(data.savingsRate.value)}
          </div>
          <p className="text-muted-foreground text-xs">
            {data.savingsRate.change > 0 ? "+" : ""}
            {formatPercentage(data.savingsRate.change)} from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
