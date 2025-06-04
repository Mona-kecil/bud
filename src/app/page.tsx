import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { AccountsOverview } from "~/components/accounts-overview"
import { BudgetOverview } from "~/components/budget-overview"
import { RecentTransactions } from "~/components/recent-transactions"
import { SpendingPieChart } from "~/components/spending-pie-chart"
import { SavingsRateChart } from "~/components/savings-rate-chart"
import { DollarSign } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,580.25</div>
            <p className="text-xs text-muted-foreground">+$1,245.12 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,750.00</div>
            <p className="text-xs text-muted-foreground">+$250.00 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,890.15</div>
            <p className="text-xs text-muted-foreground">+$435.87 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">39.2%</div>
            <p className="text-xs text-muted-foreground">-2.5% from last month</p>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>Your spending distribution across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <SpendingPieChart />
            </CardContent>
          </Card>
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Savings Rate Trend</CardTitle>
              <CardDescription>Your savings rate over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <SavingsRateChart />
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
            <CardDescription>Summary of your financial accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <AccountsOverview />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
