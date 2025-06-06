"use client";

import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { mockTransactions } from "~/lib/mock-data";

// Group transactions by category and calculate total spending
const getCategoryData = () => {
  const expenseTransactions = mockTransactions.filter(
    (t) => t.type === "expense",
  );
  const categoryMap = new Map();

  expenseTransactions.forEach((transaction) => {
    const { category, amount } = transaction;
    const currentAmount = categoryMap.get(category) || 0;
    categoryMap.set(category, currentAmount + amount);
  });

  return Array.from(categoryMap.entries()).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));
};

const COLORS = [
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
];

export function SpendingPieChart() {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    setIsMounted(true);
    setData(getCategoryData());
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => {
            const num =
              typeof value === "number" ? value : parseFloat(value as string);
            return [`$${num.toFixed(2)}`, "Spending"];
          }}
          labelFormatter={(label) => `Category: ${label}`}
        />
        <Legend layout="vertical" verticalAlign="middle" align="right" />
      </PieChart>
    </ResponsiveContainer>
  );
}
