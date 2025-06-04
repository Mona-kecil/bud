"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { date: "May 1", amount: 120 },
  { date: "May 2", amount: 85 },
  { date: "May 3", amount: 93 },
  { date: "May 4", amount: 270 },
  { date: "May 5", amount: 42 },
  { date: "May 6", amount: 110 },
  { date: "May 7", amount: 57 },
  { date: "May 8", amount: 89 },
  { date: "May 9", amount: 210 },
  { date: "May 10", amount: 136 },
  { date: "May 11", amount: 187 },
  { date: "May 12", amount: 45 },
  { date: "May 13", amount: 65 },
  { date: "May 14", amount: 91 },
  { date: "May 15", amount: 190 },
  { date: "May 16", amount: 97 },
  { date: "May 17", amount: 123 },
  { date: "May 18", amount: 65 },
  { date: "May 19", amount: 87 },
  { date: "May 20", amount: 156 },
  { date: "May 21", amount: 47 },
  { date: "May 22", amount: 78 },
  { date: "May 23", amount: 95 },
  { date: "May 24", amount: 102 },
  { date: "May 25", amount: 112 },
  { date: "May 26", amount: 57 },
  { date: "May 27", amount: 89 },
  { date: "May 28", amount: 136 },
  { date: "May 29", amount: 99 },
  { date: "May 30", amount: 87 },
]

export function SpendingChart() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(value) => value.split(" ")[1]} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <Tooltip formatter={(value) => [`$${value}`, "Spending"]} labelFormatter={(label) => `Date: ${label}`} />
        <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="url(#colorAmount)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
