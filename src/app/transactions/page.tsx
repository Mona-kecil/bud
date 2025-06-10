"use client";

import { useState, useEffect } from "react";
import {
  CalendarIcon,
  PlusCircle,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { Label } from "~/components/ui/label";
import { TransactionItem } from "~/components/transaction-item";
import { mockTransactions as initialTransactions } from "~/lib/mock-data";
import { cn } from "~/lib/utils";
import { format } from "date-fns";

// Define categories for each transaction type
const INCOME_CATEGORIES = [
  "salary",
  "freelance",
  "investment-returns",
  "bonus",
  "rental-income",
  "business-income",
];
const EXPENSE_CATEGORIES = [
  "groceries",
  "dining",
  "transportation",
  "utilities",
  "entertainment",
  "shopping",
  "health",
  "travel",
  "insurance",
  "education",
];
const INVESTMENT_CATEGORIES = [
  "stocks",
  "bonds",
  "mutual-funds",
  "etf",
  "crypto",
  "real-estate",
  "retirement",
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Get categories based on active tab
  const getAvailableCategories = () => {
    switch (activeTab) {
      case "income":
        return INCOME_CATEGORIES;
      case "expenses":
        return EXPENSE_CATEGORIES;
      case "investments":
        return INVESTMENT_CATEGORIES;
      case "all":
      default:
        return [
          ...INCOME_CATEGORIES,
          ...EXPENSE_CATEGORIES,
          ...INVESTMENT_CATEGORIES,
        ];
    }
  };

  // Get actual categories from transactions based on tab
  const getActualCategories = () => {
    let filteredTransactions = transactions;

    switch (activeTab) {
      case "income":
        filteredTransactions = transactions.filter((t) => t.type === "income");
        break;
      case "expenses":
        filteredTransactions = transactions.filter((t) => t.type === "expense");
        break;
      case "investments":
        filteredTransactions = transactions.filter(
          (t) => t.type === "investment",
        );
        break;
    }

    return Array.from(new Set(filteredTransactions.map((t) => t.category)));
  };

  // Reset category filter when switching tabs if current category is not available
  useEffect(() => {
    const availableCategories = getActualCategories();
    if (
      categoryFilter !== "all" &&
      !availableCategories.includes(categoryFilter)
    ) {
      setCategoryFilter("all");
    }
  }, [activeTab]);

  const applyFilters = (transactionList: typeof transactions) => {
    return transactionList.filter((transaction) => {
      // Search filter
      const matchesSearch =
        transaction.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        categoryFilter === "all" || transaction.category === categoryFilter;

      // Amount filter
      const matchesMinAmount =
        !minAmount || transaction.amount >= Number.parseFloat(minAmount);
      const matchesMaxAmount =
        !maxAmount || transaction.amount <= Number.parseFloat(maxAmount);

      // Date filter (simplified - in real app you'd parse the date strings properly)
      const matchesDateFrom = !dateFrom || true; // Simplified for demo
      const matchesDateTo = !dateTo || true; // Simplified for demo

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMinAmount &&
        matchesMaxAmount &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  };

  const filteredTransactions = applyFilters(transactions);
  const incomeTransactions = applyFilters(
    transactions.filter((t) => t.type === "income"),
  );
  const expenseTransactions = applyFilters(
    transactions.filter((t) => t.type === "expense"),
  );
  const investmentTransactions = applyFilters(
    transactions.filter((t) => t.type === "investment"),
  );

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleEditTransaction = (id: string, updatedTransaction: any) => {
    setTransactions(
      transactions.map((t) =>
        t.id === id ? { ...t, ...updatedTransaction } : t,
      ),
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setMinAmount("");
    setMaxAmount("");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  // Get placeholder text based on active tab
  const getAmountPlaceholder = () => {
    switch (activeTab) {
      case "income":
        return { min: "Min income", max: "Max income" };
      case "expenses":
        return { min: "Min expense", max: "Max expense" };
      case "investments":
        return { min: "Min investment", max: "Max investment" };
      default:
        return { min: "Min amount", max: "Max amount" };
    }
  };

  const TransactionList = ({
    transactions: txList,
  }: {
    transactions: typeof transactions;
  }) => (
    <div className="space-y-4">
      {txList.length > 0 ? (
        txList.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onDelete={handleDeleteTransaction}
            onEdit={handleEditTransaction}
          />
        ))
      ) : (
        <div className="text-muted-foreground py-6 text-center">
          No {activeTab === "all" ? "" : activeTab} transactions found matching
          your filters.
        </div>
      )}
    </div>
  );

  const amountPlaceholders = getAmountPlaceholder();
  const actualCategories = getActualCategories();

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

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                <Input
                  type="search"
                  placeholder={`Search ${activeTab === "all" ? "transactions" : activeTab}...`}
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {showFilters && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      {activeTab === "all"
                        ? "Category"
                        : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(0, -1)} Category`}
                    </Label>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={`All ${activeTab === "all" ? "Categories" : activeTab.charAt(0).toUpperCase() + activeTab.slice(0, -1) + " Categories"}`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          All{" "}
                          {activeTab === "all"
                            ? "Categories"
                            : activeTab.charAt(0).toUpperCase() +
                            activeTab.slice(0, -1) +
                            " Categories"}
                        </SelectItem>
                        {actualCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category
                              .split("-")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1),
                              )
                              .join(" ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="min-amount">{amountPlaceholders.min}</Label>
                    <Input
                      id="min-amount"
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*\.?[0-9]*"
                      placeholder="0.00"
                      value={minAmount}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                          setMinAmount(value);
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-amount">{amountPlaceholders.max}</Label>
                    <Input
                      id="max-amount"
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*\.?[0-9]*"
                      placeholder="999.99"
                      value={maxAmount}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                          setMaxAmount(value);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateFrom && !dateTo && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFrom && dateTo
                            ? `${format(dateFrom, "MMM d")} - ${format(dateTo, "MMM d, yyyy")}`
                            : dateFrom
                              ? `From ${format(dateFrom, "MMM d, yyyy")}`
                              : dateTo
                                ? `Until ${format(dateTo, "MMM d, yyyy")}`
                                : "Select date range"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="p-4 space-y-4">
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">
                              {!dateFrom && !dateTo
                                ? "Click a date to start selecting range"
                                : dateFrom && !dateTo
                                  ? "Click another date to complete range"
                                  : "Date range selected"}
                            </div>
                            <Calendar
                              mode="range"
                              selected={dateFrom && dateTo ? { from: dateFrom, to: dateTo } : undefined}
                              onSelect={(range) => {
                                if (range?.from) {
                                  setDateFrom(range.from);
                                  setDateTo(range.to);
                                } else {
                                  setDateFrom(undefined);
                                  setDateTo(undefined);
                                }
                              }}
                              numberOfMonths={1}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setDateFrom(undefined);
                                setDateTo(undefined);
                              }}
                              className="flex-1"
                            >
                              Clear
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All ({filteredTransactions.length})
          </TabsTrigger>
          <TabsTrigger value="income">
            Income ({incomeTransactions.length})
          </TabsTrigger>
          <TabsTrigger value="expenses">
            Expenses ({expenseTransactions.length})
          </TabsTrigger>
          <TabsTrigger value="investments">
            Investments ({investmentTransactions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>
                View and manage all your financial transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList transactions={filteredTransactions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Income Transactions</CardTitle>
              <CardDescription>
                Your income and earnings from various sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList transactions={incomeTransactions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Transactions</CardTitle>
              <CardDescription>
                Your spending and purchases across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList transactions={expenseTransactions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investment Transactions</CardTitle>
              <CardDescription>
                Your investment activities and portfolio transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList transactions={investmentTransactions} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
