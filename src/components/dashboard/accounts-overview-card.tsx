import { AccountsOverview } from "../accounts-overview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function AccountsOverviewCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounts Overview</CardTitle>
        <CardDescription>Summary of your financial accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <AccountsOverview />
      </CardContent>
    </Card>
  );
}
