"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Edit,
  MoreHorizontal,
  Trash,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { formatCurrency } from "~/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface TransactionItemProps {
  transaction: {
    id: string;
    date: string;
    merchant: string;
    description: string;
    amount: number;
    type: string;
    category: string;
  };
  onDelete: (id: string) => void;
  onEdit: (
    id: string,
    updatedTransaction: Partial<TransactionItemProps["transaction"]>,
  ) => void;
}

export function TransactionItem({
  transaction,
  onDelete,
  onEdit,
}: TransactionItemProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState({
    ...transaction,
  });

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmEdit = () => {
    onEdit(transaction.id, editedTransaction);
    setShowEditDialog(false);
  };

  const confirmDelete = () => {
    onDelete(transaction.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="flex items-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border">
          {transaction.type === "expense" ? (
            <ArrowDownLeft className="h-4 w-4 text-red-500" />
          ) : transaction.type === "income" ? (
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          ) : (
            <ArrowUpRight className="h-4 w-4 text-blue-500" />
          )}
        </div>
        <div className="ml-4 space-y-1">
          <p className="text-sm leading-none font-medium">
            {transaction.merchant}
          </p>
          <p className="text-muted-foreground text-xs">
            {transaction.description}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p
            className={`text-sm font-medium ${
              transaction.type === "expense"
                ? "text-red-500"
                : transaction.type === "income"
                  ? "text-emerald-500"
                  : "text-blue-500"
            }`}
          >
            {transaction.type === "expense" ? "-" : "+"}
            {formatCurrency(transaction.amount)}
          </p>
          <p className="text-muted-foreground text-xs">{transaction.date}</p>
        </div>
        <div className="ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-500">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Make changes to this transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="merchant" className="text-right">
                Merchant
              </Label>
              <Input
                id="merchant"
                value={editedTransaction.merchant}
                onChange={(e) =>
                  setEditedTransaction({
                    ...editedTransaction,
                    merchant: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={editedTransaction.description}
                onChange={(e) =>
                  setEditedTransaction({
                    ...editedTransaction,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                value={editedTransaction.amount}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers and decimal point
                  if (/^\d*\.?\d*$/.test(value)) {
                    setEditedTransaction({
                      ...editedTransaction,
                      amount: parseFloat(value) || 0,
                    });
                  }
                }}
                placeholder="0.00"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={editedTransaction.type}
                onValueChange={(value) =>
                  setEditedTransaction({ ...editedTransaction, type: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                value={editedTransaction.category}
                onChange={(e) =>
                  setEditedTransaction({
                    ...editedTransaction,
                    category: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
