"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { mockTransactions } from "~/lib/mock-data";
import { TransactionItem } from "~/components/transaction-item";

type EditableTransaction = Partial<{
  id: string;
  date: string;
  merchant: string;
  description: string;
  amount: number;
  type: string;
  category: string;
}>;

interface RecentTransactionsProps {
  showAll?: boolean;
}

type Transaction = {
  id: string;
  date: string;
  merchant: string;
  description: string;
  amount: number;
  type: string;
  category: string;
};

export function RecentTransactions({
  showAll = false,
}: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(
    mockTransactions as Transaction[],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredTransactions = transactions
    .filter(
      (transaction) =>
        transaction.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter(
      (transaction) =>
        categoryFilter === "all" || transaction.category === categoryFilter,
    )
    .slice(0, showAll ? undefined : 5);

  const uniqueCategories = Array.from(
    new Set(mockTransactions.map((t) => t.category)),
  );

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleEditTransaction = (
    id: string,
    updatedTransaction: Partial<Transaction>,
  ) => {
    setTransactions(
      transactions.map((t) =>
        t.id === id ? { ...t, ...updatedTransaction } : t,
      ),
    );
  };

  return (
    <div className="space-y-4">
      {showAll && (
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onDelete={handleDeleteTransaction}
            onEdit={handleEditTransaction}
          />
        ))}
        {showAll && filteredTransactions.length === 0 && (
          <div className="text-muted-foreground py-6 text-center">
            No transactions found matching your filters.
          </div>
        )}
        {!showAll && (
          <Button variant="outline" className="w-full" size="sm">
            View All Transactions
          </Button>
        )}
      </div>
    </div>
  );
}
