"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { formatCurrency } from "~/lib/utils";
import type { Doc } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { memo, useCallback, useEffect, useState, type ReactNode } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "~/components/ui/drawer";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Ellipsis, PlusCircleIcon } from "lucide-react";
import { deleteTransaction } from "convex/transactions";
import { Progress } from "~/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";

type Budget = Doc<"budgets">;

type DialogState = {
  mode: "create" | "edit";
  budget?: Budget;
}

export default function BudgetsPage() {

  const budgetList = useQuery(api.budgets.getAvailableBudgets, {});
  const spendByBudget = useQuery(api.budgets.getBudgetSpend, {});

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>({
    mode: "create",
  });

  // Loading state
  if (budgetList === undefined) return <LoadingState />;

  // Empty state
  if (budgetList && budgetList.length === 0) return <EmptyState setIsDialogOpen={setIsDialogOpen} setDialogState={setDialogState} />

  return (
    <>
      <BudgetMetrics />

      {budgetList && budgetList.length > 0 && (
        <BudgetsList
          budgetList={budgetList}
          setDialogState={setDialogState}
          setIsDialogOpen={setIsDialogOpen}
          spendByBudget={spendByBudget}
        >
          <BudgetDialog
            dialogState={dialogState}
            setDialogState={setDialogState}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
        </BudgetsList>
      )}
    </>
  )
}

function BudgetMetrics() {
  const totalBudgeted = useQuery(api.budgets.getTotalBudgets, {})!;
  const totalSpent = useQuery(api.budgets.getTotalSpent, {})!;
  const remaining = totalBudgeted - totalSpent;
  // budgetHealth: percentage of budget used (0% = unused, 100% = fully used, >100% = overspent)
  const budgetHealth = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  const data = [
    {
      title: "Total Budgeted",
      value: totalBudgeted,
      description: "The total amount you have allocated across all your budgets.",
    },
    {
      title: "Total Spent",
      value: totalSpent,
      description: "The total amount you have spent across all your budgets.",
    },
    {
      title: "Remaining",
      value: remaining,
      description: "The amount left to spend before reaching your total budget.",
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 mb-4">
      {data.map((item) => (
        <Card key={item.title} className="col-span-1 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base">{item.title}</CardTitle>
            <CardDescription className="text-xs">{item.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <span className={`text-lg font-bold ${item.value > 0 ? "text-primary" : "text-destructive"}`}>{formatCurrency(item.value ?? 0)}</span>
          </CardContent>
        </Card>
      ))}

      {/* Budget Health Card */}
      <Card className="col-span-1 flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-base">Budget Health</CardTitle>
          <CardDescription className="text-xs">
            Percentage of your total budget that has been spent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className={`font-bold self-start text-lg ${budgetHealth > 100 ? "text-destructive" : "text-primary"}`}>
              {budgetHealth.toFixed(1)}%
            </div>
            <div className="w-full h-3 bg-muted rounded">
              <div
                className={`h-3 rounded ${budgetHealth < 100 ? "bg-primary" : "bg-destructive"}`}
                style={{
                  width: `${Math.min(budgetHealth, 100)}%`,
                }}
              />
            </div>
          </div>
          {budgetHealth > 100 && (
            <div className="text-destructive mt-2 text-sm">
              You have overspent your budget!
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )

}

function BudgetDialog({
  dialogState,
  setDialogState,
  isDialogOpen,
  setIsDialogOpen,
}: {
  dialogState: DialogState;
  setDialogState: (state: DialogState) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}) {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const createBudget = useMutation(api.budgets.createBudget);
  const updateBudget = useMutation(api.budgets.updateBudget);

  const formSchema = z.object({
    name: z.string().min(1, {message: "Budget name is required"}),
    amount: z.number().min(1, {message: "Amount must be greater than 0"}),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: 0,
    },
  });

  useEffect(() => {
    if (dialogState.mode === "edit" && dialogState.budget) {
      form.reset({
        name: dialogState.budget.name,
        amount: Number(dialogState.budget.amount ?? 0),
      });
    } else if (dialogState.mode === "create") {
      form.reset({
        name: "",
        amount: 0,
      })
    }
  }, [dialogState, form]);

  const handleCreateBudget = async (
    values: z.infer<typeof formSchema>,
  ) => {
    try {
      setIsSubmitting(true);

      await createBudget({...values});

      setIsDialogOpen(false);
      setDialogState({mode: "create"});

      toast.success("Budget created successfully", {
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create transaction", {
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleUpdateTransaction = async (
    values: z.infer<typeof formSchema>,
  ) => {
    try {
      setIsSubmitting(true);

      if (!dialogState.budget) {
        throw new Error("Budget not found");
      }

      await updateBudget({
        ...values,
        budgetId: dialogState.budget._id,
      });

      setIsDialogOpen(false);
      setDialogState({mode: "create"});

      toast.success("Budget updated successfully", {
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update transaction", {
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (dialogState.mode === "create") await handleCreateBudget(values);
    else if (dialogState.mode === "edit") await handleUpdateTransaction(values);
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DrawerTrigger asChild>
        <div className="flex items-center justify-center pt-2">
          <Button
            onClick={() => {
              setDialogState({mode: "create"});
              setIsDialogOpen(true);
            }}
            className="w-full"
          >
            <PlusCircleIcon />
            Add another budget
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent aria-describedby={undefined} className="w-full">
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {dialogState.mode === "create"
              ? "Add Budget"
              : "Edit Budget"}
          </DrawerTitle>
          <DrawerDescription>
            {dialogState.mode === "create"
              ? "Add new budget here. Click submit when you're done."
              : "Modify existing budget. Click submit when you're done."}
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 px-4 overflow-y-scroll"
          >
            {/* Budget Name */}
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    Budget Name
                    <span className="text-destructive" aria-hidden="true" aria-label="required">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Budget Name"
                      {...field}
                      required
                      aria-required="true"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="text-sm">Amount</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="text"
                      inputMode="numeric"
                      value={
                        field.value === 0 ? "" : formatCurrency(field.value)
                      }
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^\d]/g, "");
                        const num = raw ? parseInt(raw, 10) : 0;
                        field.onChange(num);
                      }}
                      min="0"
                    /> 
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DrawerFooter className="flex w-full justify-end gap-4 pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Submitting..."
                  : dialogState.mode === "create"
                    ? "Create"
                    : "Update"}
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}

function LoadingState() {
  return (
    <div>Loading...</div>
  )
}

function EmptyState({
  setIsDialogOpen,
  setDialogState,
}: {
  setIsDialogOpen: (open: boolean) => void;
  setDialogState: (state: DialogState) => void;
}) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted mb-4 rounded-full p-4">
            <PlusCircleIcon className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No budgets yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Start adding budgets
          </p>
          <Button
            onClick={() => {
              setDialogState({ mode: "create" });
              setIsDialogOpen(true);
            }}
            className="gap-2"
          >
            <PlusCircleIcon className="h-4 w-4" />
            Add Your First Budget
          </Button>
        </div>
      </div>
    </>
  )
}

const BudgetsList = memo(({
  budgetList,
  setDialogState,
  setIsDialogOpen,
  spendByBudget,
  children,
}: {
  budgetList: Budget[];
  setDialogState: (state: DialogState) => void;
  setIsDialogOpen: (open: boolean) => void;
  spendByBudget?: Record<string, number>;
  children: ReactNode;
}) => {
  const deleteBudget = useMutation(api.budgets.deleteBudget);

  const handleDeleteBudget = useCallback(async (budget: Budget) => {
    try {
      await deleteBudget({budgetId: budget._id});
      toast.success("Budget deleted successfully", {
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete budget", {
        position: "top-center",
      });
    }
  }, [deleteBudget]);

  const handleEditBudget = useCallback(async (budget: Budget) => {
    setDialogState({mode: "edit", budget});
    setIsDialogOpen(true);
  }, [setDialogState, setIsDialogOpen]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">All Budgets</CardTitle>
        <CardDescription className="text-xs">Track your spending against budget categories</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgetList.map((budget) => {
          const spent = spendByBudget?.[budget._id] ?? 0;
          const amount = budget.amount ?? 0;
          const pct = amount > 0 ? (spent / amount) * 100 : 0;
          const pctClamped = Math.min(Math.max(pct, 0), 100);
          return (
            <div key={budget._id} className="flex flex-col gap-2 border-b last:border-b-0 pb-3">
              <div className="flex items-center justify-between gap-4">
                {/* name, amount, spent */}
                <div className="flex min-w-0 flex-col">
                  <div className="truncate font-medium text-sm">{budget.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(spent)} / {formatCurrency(amount)}
                  </div>
                </div>

                {/* the used percentage (right-aligned, fixed width) */}
                <div className="shrink-0 flex items-center justify-center w-16 text-right tabular-nums text-xs text-muted-foreground">
                  {pct.toFixed(1)}%
                  {/* Dropdowns to add edit and delete functionality */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Ellipsis className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="absolute right-0">
                    <DropdownMenuItem
                      onClick={() => handleEditBudget(budget)}
                      className="cursor-pointer"
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteBudget(budget)}
                      className="cursor-pointer"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                </div>
              </div>
              <Progress value={pctClamped} />
            </div>
          );
        })}
        {children}
      </CardContent>
    </Card>
  )
});

BudgetsList.displayName ="BudgetsList";