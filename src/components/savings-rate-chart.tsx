"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Mock data for savings rate over time
const savingsRateData = [
  { month: "Jan", rate: 32 },
  { month: "Feb", rate: 28 },
  { month: "Mar", rate: 36 },
  { month: "Apr", rate: 42 },
  { month: "May", rate: 39 },
  { month: "Jun", rate: 35 },
  { month: "Jul", rate: 31 },
  { month: "Aug", rate: 33 },
  { month: "Sep", rate: 38 },
  { month: "Oct", rate: 41 },
  { month: "Nov", rate: 37 },
  { month: "Dec", rate: 39 },
]

export function SavingsRateChart() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={savingsRateData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${value}%`}
          domain={[0, 50]}
          ticks={[0, 10, 20, 30, 40, 50]}
        />
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <Tooltip formatter={(value) => [`${value}%`, "Savings Rate"]} />
        <Area type="monotone" dataKey="rate" stroke="#10b981" fillOpacity={1} fill="url(#colorRate)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
