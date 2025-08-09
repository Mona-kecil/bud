"use client";

import DashboardLayout from "~/components/dashboard/layout";
import SummaryCards from "~/components/dashboard/summary-cards";
import SummaryCharts from "~/components/dashboard/summary-charts";
import RecentTransactionsCard from "~/components/dashboard/recent-transactions-card";
import BudgetOverviewCard from "~/components/dashboard/budget-overview";
import AccountsOverviewCard from "~/components/dashboard/accounts-overview-card";

const data = {
  summaryCards: {
    totalBalance: {
      value: 12580.25,
      change: 1245.12,
    },
    monthlyIncome: {
      value: 4750.0,
      change: 250.0,
    },
    monthlySpending: {
      value: 2890.15,
      change: 435.87,
    },
    savingsRate: {
      value: 0.392,
      change: -0.025,
    },
  },
  summaryCharts: {
    spendingByCategory: [
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
        percentage: 0.1,
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
        percentage: 0.1,
      },
    ],
    savingsRateTrend: [
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
    ],
  },
};

export default function Dashboard() {
  return (
    <DashboardLayout>
      <SummaryCards data={data.summaryCards} />
      <div className="space-y-4">
        <SummaryCharts data={data.summaryCharts} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <RecentTransactionsCard />
          <BudgetOverviewCard />
        </div>
        <AccountsOverviewCard />
      </div>
    </DashboardLayout>
  );
}

