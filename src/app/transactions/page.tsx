"use client"

import { useState } from "react"
import { PlusCircle, Search } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { TransactionItem } from "~/components/transaction-item"
import { mockTransactions as initialTransactions } from "~/lib/mock-data"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const incomeTransactions = filteredTransactions.filter((t) => t.type === "income")
  const expenseTransactions = filteredTransactions.filter((t) => t.type === "expense")
  const investmentTransactions = filteredTransactions.filter((t) => t.type !== "income" && t.type !== "expense")

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const handleEditTransaction = (id: string, updatedTransaction: any) => {
    setTransactions(transactions.map((t) => (t.id === id ? { ...t, ...updatedTransaction } : t)))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <div className="flex items-center gap-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      <div className="relative flex-1 mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search transactions..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        {/* Income Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Income</CardTitle>
            <CardDescription>Your income transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incomeTransactions.length > 0 ? (
                incomeTransactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onDelete={handleDeleteTransaction}
                    onEdit={handleEditTransaction}
                  />
                ))
              ) : (
                <div className="py-6 text-center text-muted-foreground">No income transactions found.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expense Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>Your expense transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseTransactions.length > 0 ? (
                expenseTransactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onDelete={handleDeleteTransaction}
                    onEdit={handleEditTransaction}
                  />
                ))
              ) : (
                <div className="py-6 text-center text-muted-foreground">No expense transactions found.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Investment Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Investments</CardTitle>
            <CardDescription>Your investment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investmentTransactions.length > 0 ? (
                investmentTransactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onDelete={handleDeleteTransaction}
                    onEdit={handleEditTransaction}
                  />
                ))
              ) : (
                <div className="py-6 text-center text-muted-foreground">No investment transactions found.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
