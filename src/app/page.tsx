"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { AccountsOverview } from "~/components/accounts-overview";
import { BudgetOverview } from "~/components/budget-overview";
import { RecentTransactions } from "~/components/recent-transactions";
import { SpendingPieChart } from "~/components/spending-pie-chart";
import { SavingsRateChart } from "~/components/savings-rate-chart";
import { DollarSign } from "lucide-react";
import { useStatsigClient } from "@statsig/react-bindings";
import { AgCharts } from "ag-charts-react";

const data = {
  totalBalance: {
    value: 12580.25,
    change: 1245.12,
  },
  monthlyIncome: {
    value: 4750.00,
    change: 250.00,
  },
  monthlySpending: {
    value: 2890.15,
    change: 435.87,
  },
  savingsRate: {
    value: 0.392,
    change: -0.025,
  }
};

const spendingByCategoryChartOptions = {
  data: [
    {
      category: "Groceries",
      valueInPercentage: "28%",
      percentage: 0.28,
    },
    {
      category: "Entertainment",
      valueInPercentage: "18%",
      percentage: 0.18,
    },
    {
      category: "Transport",
      valueInPercentage: "12%",
      percentage: 0.12,
    },
    {
      category: "Utilities",
      valueInPercentage: "10%",
      percentage: 0.10,
    },
    {
      category: "Dining Out",
      valueInPercentage: "15%",
      percentage: 0.15,
    },
    {
      category: "Healthcare",
      valueInPercentage: "7%",
      percentage: 0.07,
    },
    {
      category: "Other",
      valueInPercentage: "10%",
      percentage: 0.10,
    },
  ],
};

const savingsRateTrendChartOptions = {
  data: [
    {
      month: "Jan",
      rate: 32,
    },
    {
      month: "Feb",
      rate: 28,
    },
    {
      month: "Mar",
      rate: 36,
    },
    {
      month: "Apr",
      rate: 42,
    },
    {
      month: "May",
      rate: 38,
    },
    {
      month: "Jun",
      rate: 45,
    },
  ]
}

export default function Dashboard() {
  const { client } = useStatsigClient();

  const formatCurrency = (value: number) => {
    return Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  }

  const formatPercentage = (value: number) => {
    return Intl.NumberFormat("id-ID", {
      style: "percent",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      signDisplay: "exceptZero",
    }).format(value);
  }

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Balance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalBalance.value)}</div>
            <p className="text-muted-foreground text-xs">
              {data.totalBalance.change > 0 ? "+" : ""}
              {formatCurrency(data.totalBalance.change)} from last month
            </p>
          </CardContent>
        </Card>
        {/* Monthly Income Card*/}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Income and Expense
            </CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.monthlyIncome.value)}</div>
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
            <div className="text-2xl font-bold">{formatCurrency(data.monthlySpending.value)}</div>
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
            <div className="text-2xl font-bold">{formatPercentage(data.savingsRate.value)}</div>
            <p className="text-muted-foreground text-xs">
              {data.savingsRate.change > 0 ? "+" : ""}
              {formatPercentage(data.savingsRate.change)} from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Spending grouped by category chart */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>
                Your spending distribution across categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AgCharts
                options={{
                  data: spendingByCategoryChartOptions.data,
                  series: [
                    {
                      type: "pie",
                      angleKey: "percentage",
                      calloutLabelKey: "category",
                      sectorLabelKey: "valueInPercentage",
                      fills: [
                        "#10B981", // emerald-500
                        "#059669", // emerald-600
                        "#047857", // emerald-700
                        "#065F46", // emerald-800
                        "#064E3B", // emerald-900
                        "#34D399", // emerald-400
                        "#6EE7B7", // emerald-300
                        "#A7F3D0", // emerald-200
                        "#D1FAE5", // emerald-100
                        "#ECFDF5", // emerald-50
                      ]
                    },
                  ],
                }}
              />
            </CardContent>
          </Card>
          {/* Savings rate trend chart */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Savings Rate Trend</CardTitle>
              <CardDescription>
                Your savings rate over the past 6 months (%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AgCharts
                options={{
                  data: savingsRateTrendChartOptions.data,
                  series: [
                    {
                      type: "line",
                      xKey: "month",
                      xName: "Month",
                      yKey: "rate",
                      yName: "Savings Rate (%)",
                      interpolation: {
                        type: "smooth"
                      },
                      stroke: "#34D399",
                      marker: {
                        enabled: true,
                        shape: "circle",
                        size: 6,
                        fill: "#10B981",
                      },
                    },
                  ],
                }}
              />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activity</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTransactions />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Your monthly budget progress</CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetOverview />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Accounts Overview</CardTitle>
            <CardDescription>
              Summary of your financial accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccountsOverview />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
