import { BudgetOverview } from "../budget-overview";
import {
  Card,
  CardDescription,
  CardTitle,
  CardHeader,
  CardContent,
} from "../ui/card";

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
