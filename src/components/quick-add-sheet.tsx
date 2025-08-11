"use client";

import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Input } from "~/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useState } from "react";

export default function QuickAddSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const createTransaction = useMutation(api.transactions.createTransaction);

  const onQuickSave = async () => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return;
    await createTransaction({
      merchantName: merchant || undefined,
      description: undefined,
      amount: parsedAmount,
      type: "expense",
      category: undefined,
      date: new Date().toISOString(),
    });
    onOpenChange(false);
    setAmount("");
    setMerchant("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="space-y-4">
        <SheetHeader>
          <SheetTitle>Quick Add</SheetTitle>
        </SheetHeader>
        <div className="flex gap-3">
          <Input
            inputMode="decimal"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            placeholder="Merchant (optional)"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onQuickSave}>Save</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
