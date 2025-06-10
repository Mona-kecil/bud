import { PlusCircle } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { mockGoals } from "~/lib/mock-data";
import { formatCurrency } from "~/lib/utils";

export default function GoalsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Financial Goals</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Goal
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockGoals.map((goal) => {
          const percentage = Math.min(100, (goal.current / goal.target) * 100);

          return (
            <Card key={goal.id}>
              <CardHeader>
                <CardTitle>{goal.name}</CardTitle>
                <CardDescription>Target date: {goal.deadline}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-sm">
                      {formatCurrency(goal.current)} of{" "}
                      {formatCurrency(goal.target)}
                    </div>
                    <div className="text-sm font-medium">
                      {percentage.toFixed(0)}%
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm font-medium">Remaining</div>
                    <div className="text-lg font-bold">
                      {formatCurrency(goal.target - goal.current)}
                    </div>
                  </div>
                  <Button size="sm">Add Funds</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        <Card className="flex flex-col items-center justify-center p-6">
          <div className="bg-muted mb-4 rounded-full p-3">
            <PlusCircle className="text-muted-foreground h-6 w-6" />
          </div>
          <h3 className="mb-2 text-lg font-medium">Create New Goal</h3>
          <p className="text-muted-foreground mb-4 text-center text-sm">
            Set up a new financial goal to track your progress
          </p>
          <Button>Get Started</Button>
        </Card>
      </div>
    </div>
  );
}
