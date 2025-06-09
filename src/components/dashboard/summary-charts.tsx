import { AgCharts } from "ag-charts-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function SummaryCharts({
  data,
}: {
  data: {
    spendingByCategory: {
      category: string;
      percentage: number;
    }[];
    savingsRateTrend: {
      month: string;
      rate: number;
    }[];
  };
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
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
              data: data.spendingByCategory,
              series: [
                {
                  type: "pie",
                  angleKey: "percentage",
                  calloutLabelKey: "category",
                  sectorLabelKey: "percentage",
                  sectorLabelName: "Percentage",
                  sectorLabel: {
                    formatter: ({ value }: { value: number }) =>
                      `${(value * 100).toFixed(0)}%`,
                  },
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
                  ],
                },
              ],
              legend: {
                enabled: true,
                position: "right",
              },
            }}
          />
        </CardContent>
      </Card>
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
              data: data.savingsRateTrend,
              series: [
                {
                  type: "line",
                  xKey: "month",
                  xName: "Month",
                  yKey: "rate",
                  interpolation: {
                    type: "smooth",
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
              legend: {
                enabled: true,
                position: "right",
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
