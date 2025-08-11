"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
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

export default function QuickAddFab() {
  const [open, setOpen] = useState(false);
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
    setOpen(false);
    setAmount("");
    setMerchant("");
  };

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-16 z-50 flex justify-center"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)" }}
      >
        <Button
          aria-label="Quick add transaction"
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
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
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onQuickSave}>Save</Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
} 