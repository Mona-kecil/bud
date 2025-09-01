"use client";

import {
  ArrowUpRight,
  ArrowDownLeft,
  PlusCircle,
  CalendarIcon,
  Ellipsis,
  ChevronsUpDownIcon,
  CheckIcon,
  Plus,
  SearchIcon,
  FilterIcon,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn, formatCurrency, formatDate } from "~/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Button } from "~/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Calendar } from "~/components/ui/calendar";
import { parseDate } from "chrono-node";
import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { toast } from "sonner";
import { Skeleton } from "~/components/ui/skeleton";
import type { Doc, Id } from "convex/_generated/dataModel";
import { motion } from "motion/react";
import { Separator } from "~/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";

type Transaction = Doc<"transactions">;

type DialogState = {
  mode: "create" | "edit";
  transaction?: Transaction;
};

export default function TransactionsPage() {
  const transactionList = useQuery(api.transactions.getAllTransactions, {});

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>({
    mode: "create",
  });

  const { isFabVisible, bottomSentinelRef } = useScrollDirectionVisibility();

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TransactionDialog
            dialogState={dialogState}
            setDialogState={setDialogState}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
        </div>
      </div>

      {/* Loading state */}
      {transactionList === undefined && <LoadingState />}

      {/* Empty state */}
      {transactionList && transactionList.length === 0 && (
        <EmptyState
          setIsDialogOpen={setIsDialogOpen}
          setDialogState={setDialogState}
        />
      )}

      {/* Transactions list */}
      {transactionList && transactionList.length > 0 && (
        <TransactionsList
          transactionList={transactionList}
          setDialogState={setDialogState}
          setIsDialogOpen={setIsDialogOpen}
        />
      )}

      {/* Bottom sentinel to force-show FAB at end of list */}
      <div ref={bottomSentinelRef} className="h-1 w-1 opacity-0" />

      {/* Spacer so last item isn't covered by FAB */}
      <div className="h-[calc(env(safe-area-inset-bottom)+24px)]" />

      {/* FAB - left side, hide on scroll down, show on scroll up */}
      <Button
        aria-label="Add transaction"
        className={cn(
          "fixed left-4 z-50 h-12 w-12 rounded-full shadow-lg",
          "bottom-[calc(env(safe-area-inset-bottom)+72px)]",
          "transition-all duration-200",
          isFabVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-6 opacity-0",
        )}
        onClick={() => {
          setDialogState({ mode: "create" });
          setIsDialogOpen(true);
        }}
      >
        <Plus className="h-5 w-5" />
      </Button>
    </>
  );
}

function TransactionDialog({
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
  // Date picker state
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [datePickerInputValue, setDatePickerInputValue] = useState("");
  const [datePickerDate, setDatePickerDate] = useState<Date | undefined>();
  const [datePickerMonth, setDatePickerMonth] = useState<Date | undefined>();

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categoryValue, setCategoryValue] = useState<string>("");
  const [categoryOpen, setCategoryOpen] = useState(false);

  const createTransaction = useMutation(api.transactions.createTransaction);
  const updateTransaction = useMutation(api.transactions.updateTransaction);

  const getAvailableCategories = useQuery(api.budgets.getAvailableBudgets, {});

  const formSchema = z.object({
    merchantName: z.string().min(1, { message: "Merchant name is required" }),
    description: z.string().optional(),
    amount: z.number().min(1, { message: "Amount must be greater than 0" }),
    type: z.enum(["income", "expense", "investment"]),
    categoryId: z.string().min(1, { message: "Category is required" }),
    date: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      merchantName: "",
      description: "",
      amount: 0,
      type: "expense" as const,
      categoryId: getAvailableCategories?.[0]?._id ?? "",
      date: new Date().toISOString(),
    },
  });

  // Autofill form when editing a specific transaction
  useEffect(() => {
    if (dialogState.mode === "edit" && dialogState.transaction) {
      form.reset({
        merchantName: dialogState.transaction.merchantName,
        description: dialogState.transaction.description ?? "",
        amount: dialogState.transaction.amount,
        type: dialogState.transaction.type,
        categoryId: dialogState.transaction.categoryId ?? "",
        date: dialogState.transaction.date,
      });

      setDatePickerDate(new Date(dialogState.transaction.date));
      setDatePickerInputValue(formatDate(dialogState.transaction.date));
      setDatePickerMonth(new Date(dialogState.transaction.date));
      setCategoryValue(String(dialogState.transaction.categoryId ?? ""));
    } else if (dialogState.mode === "create") {
      const now = new Date();
      const nowIso = now.toISOString();
      form.reset({
        merchantName: "",
        description: "",
        amount: 0,
        type: "expense" as const,
        categoryId: getAvailableCategories?.[0]?._id ?? "",
        date: nowIso,
      });
      // Set date-related UI to "now"
      setDatePickerDate(now);
      setDatePickerInputValue("Now");
      setDatePickerMonth(now);
      // Reset category selection; a separate effect will set the first available once categories load
      setCategoryValue(getAvailableCategories?.[0]?._id ?? "");
    }
  }, [dialogState, form, getAvailableCategories]);

  const handleCreateTransaction = async (
    values: z.infer<typeof formSchema>,
  ) => {
    try {
      setIsSubmitting(true);

      await createTransaction({
        ...values,
        categoryId: values.categoryId as Id<"budgets">,
      });

      setIsDialogOpen(false);
      setDialogState({ mode: "create" });

      toast.success("Transaction created successfully", {
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
  };

  const handleUpdateTransaction = async (
    values: z.infer<typeof formSchema>,
  ) => {
    try {
      setIsSubmitting(true);

      if (!dialogState.transaction) {
        throw new Error("Transaction not found");
      }
      await updateTransaction({
        ...values,
        categoryId: values.categoryId as Id<"budgets">,
        transactionId: dialogState.transaction._id,
      });

      setIsDialogOpen(false);
      setDialogState({ mode: "create" });

      toast.success("Transaction updated successfully", {
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
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const { date } = values;

    // Check if date is valid
    if (!date || !parseDate(date)) {
      toast.error(
        "Date is either invalid or empty, please select a valid date",
        {
          position: "top-center",
        },
      );
      return;
    }

    if (dialogState.mode === "create") {
      await handleCreateTransaction(values);
    } else if (dialogState.mode === "edit") {
      await handleUpdateTransaction(values);
    }
  };

  return (
    <Drawer open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DrawerContent aria-describedby={undefined} className="w-full">
        <DrawerHeader className="text-left">
          <DrawerTitle className="font-hand">
            {dialogState.mode === "create"
              ? "Add Transaction"
              : "Edit Transaction"}
          </DrawerTitle>
          <DrawerDescription>
            {dialogState.mode === "create"
              ? "Add new transaction here. Click submit when you're done."
              : "Modify existing transaction. Click submit when you're done."}
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 overflow-y-scroll px-4"
          >
            {/* Merchant Name */}
            <FormField
              control={form.control}
              name="merchantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Merchant Name
                    <span
                      className="text-red-500"
                      aria-hidden="true"
                      aria-label="required"
                    >
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Merchant Name"
                      {...field}
                      required
                      aria-required="true"
                    />
                  </FormControl>
                  <FormDescription>
                    Name of the merchant or business
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormDescription>
                    Short description of the transaction.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      inputMode="numeric"
                      // pattern="[0-9]*"
                      value={
                        field.value === 0 ? "" : formatCurrency(field.value)
                      }
                      onChange={(e) => {
                        // Remove all non-digit characters (including "Rp", dots, commas, etc.)
                        const raw = e.target.value.replace(/[^\d]/g, "");
                        // Parse to number, fallback to 0 if empty
                        const num = raw ? parseInt(raw, 10) : 0;
                        field.onChange(num);
                      }}
                      min="0"
                    />
                  </FormControl>
                  <FormDescription>Amount of the transaction.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Type of the transaction.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category
                    <span
                      className="text-red-500"
                      aria-hidden="true"
                      aria-label="required"
                    >
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-[200px] justify-between"
                        >
                          {field.value || categoryValue
                            ? getAvailableCategories?.find(
                                (cat) =>
                                  String(cat._id) ===
                                  (field.value || categoryValue),
                              )?.name
                            : "Select category..."}
                          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="search category..." />
                          <CommandList>
                            <CommandEmpty>
                              No Category found. Please create it first at
                              `/budgets` page
                            </CommandEmpty>
                            <CommandGroup>
                              {getAvailableCategories?.map((cat) => (
                                <CommandItem
                                  key={cat._id}
                                  value={cat.name}
                                  onSelect={(currentValue: string) => {
                                    const newValue =
                                      currentValue === categoryValue
                                        ? ""
                                        : currentValue;
                                    setCategoryValue(newValue);
                                    field.onChange(cat._id);
                                    setCategoryOpen(false);
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      (field.value || categoryValue) ===
                                        String(cat._id)
                                        ? "opacity-100"
                                        : "opacity-50",
                                    )}
                                  />
                                  {cat.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    Category of the transaction.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => {
                // local helper to format date for display without instantly throwing error
                function formatDateDisplay(date: Date | undefined) {
                  if (!date) return "";
                  return formatDate(date);
                }

                return (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-3">
                        <div className="relative flex gap-2">
                          <Input
                            id="date"
                            value={datePickerInputValue}
                            placeholder="Tomorrow or next week"
                            className="bg-background pr-10"
                            onChange={(e) => {
                              setDatePickerInputValue(e.target.value);
                              const parsed = parseDate(e.target.value);
                              if (parsed) {
                                setDatePickerDate(parsed);
                                setDatePickerMonth(parsed);
                                field.onChange(parsed.toISOString());
                              } else {
                                field.onChange(e.target.value);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "ArrowDown") {
                                e.preventDefault();
                                setDatePickerOpen(true);
                              }
                            }}
                          />
                          <Popover
                            open={datePickerOpen}
                            onOpenChange={setDatePickerOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                id="date-picker"
                                variant="ghost"
                                className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                              >
                                <CalendarIcon className="size-3.5" />
                                <span className="sr-only">Select date</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto overflow-hidden p-0"
                              align="end"
                            >
                              <Calendar
                                mode="single"
                                selected={datePickerDate}
                                captionLayout="dropdown"
                                month={datePickerMonth}
                                onMonthChange={setDatePickerMonth}
                                onSelect={(selectedDate) => {
                                  setDatePickerDate(selectedDate);
                                  setDatePickerInputValue(
                                    formatDateDisplay(selectedDate),
                                  );
                                  field.onChange(
                                    selectedDate
                                      ? selectedDate.toISOString()
                                      : "",
                                  );
                                  setDatePickerOpen(false);
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="text-muted-foreground px-1 text-sm">
                          Your transaction will be set on{" "}
                          <span className="font-medium">
                            {formatDateDisplay(datePickerDate)}
                          </span>
                          .
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>Date of the transaction.</FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <DrawerFooter className="flex w-full justify-end gap-4 pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Submitting..."
                  : dialogState.mode === "create"
                    ? "Create"
                    : "Update"}
              </Button>
              <Button
                variant="outline"
                type="reset"
                onClick={() => {
                  const now = new Date();
                  const nowIso = now.toISOString();
                  const [firstCat] = getAvailableCategories ?? [];
                  const firstCatId = firstCat ? String(firstCat._id) : "";
                  form.reset({
                    merchantName: "",
                    description: "",
                    amount: 0,
                    type: "expense" as const,
                    categoryId: firstCatId,
                    date: nowIso,
                  });
                  setCategoryValue(firstCatId);
                  setDatePickerDate(now);
                  setDatePickerInputValue(formatDate(nowIso));
                  setDatePickerMonth(now);
                }}
                disabled={isSubmitting}
              >
                Clear
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}

function LoadingState() {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    </>
  );
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
            <PlusCircle className="text-muted-foreground h-8 w-8" />
          </div>
          `<h3 className="mb-2 text-lg font-semibold">No transactions yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Start tracking your finances by adding your first transaction.
          </p>
          <Button
            onClick={() => {
              setDialogState({ mode: "create" });
              setIsDialogOpen(true);
            }}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Your First Transaction
          </Button>
          `
        </div>
      </div>
    </>
  );
}

const TransactionsList = memo(
  ({
    transactionList,
    setDialogState,
    setIsDialogOpen,
  }: {
    transactionList: Transaction[];
    setDialogState: (state: DialogState) => void;
    setIsDialogOpen: (open: boolean) => void;
  }) => {
    const deleteTransaction = useMutation(api.transactions.deleteTransaction);

    const [searchTerm, setSearchTerm] = useState("");

    const handleEditTransaction = useCallback(
      (transaction: Transaction) => {
        setDialogState({ mode: "edit", transaction });
        setIsDialogOpen(true);
      },
      [setDialogState, setIsDialogOpen],
    );

    const handleDeleteTransaction = useCallback(
      async (transaction: Transaction) => {
        try {
          await deleteTransaction({ transactionId: transaction._id });
          toast.success("Transaction deleted successfully", {
            position: "top-center",
          });
        } catch (error) {
          console.error(error);
          toast.error("Failed to delete transaction", {
            position: "top-center",
          });
        }
      },
      [deleteTransaction],
    );

    if (searchTerm) {
      transactionList = transactionList.filter(
        (transaction) =>
          transaction.merchantName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-hand">All Transactions</CardTitle>
          <CardDescription>
            View and manage all your financial transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {useMemo(() => {
            const sections = groupTransactionsByDate(transactionList);
            const container = {
              hidden: { opacity: 1 },
              show: { opacity: 1, transition: { staggerChildren: 0.05 } },
            } as const;
            const headerVariant = {
              hidden: { opacity: 0, y: -4 },
              show: { opacity: 0.5, y: 0 },
            } as const;
            const rowVariant = {
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 },
            } as const;

            return (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-2"
              >
                {sections.map((section) => (
                  <Fragment key={section.key}>
                    <motion.div variants={headerVariant}>
                      <DateHeader label={section.label} />
                    </motion.div>
                    {section.items.map((transaction) => (
                      <motion.div
                        key={transaction._id}
                        variants={rowVariant}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="border-border/25 hover:bg-muted flex cursor-pointer items-center gap-4 rounded-md border p-2 shadow-xs"
                      >
                        {/* Icon */}
                        <div className="h-fit w-fit rounded-full border p-2">
                          {transaction.type === "income" ? (
                            <ArrowDownLeft className="h-4 w-4 stroke-3 text-green-400" />
                          ) : transaction.type === "expense" ? (
                            <ArrowUpRight className="h-4 w-4 stroke-3 text-red-400" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 stroke-3 text-blue-400" />
                          )}
                        </div>

                        {/* Merchant Name and Description */}
                        <div className="flex flex-3/5 flex-col">
                          <p className="font-bold">
                            {transaction.merchantName}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {transaction.description}
                          </p>
                        </div>

                        {/* Amount */}
                        <div>
                          <p className="font-bold">
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>

                        {/* Menu button to edit and delete functionality */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Ellipsis className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditTransaction(transaction)}
                              className="cursor-pointer"
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDeleteTransaction(transaction)
                              }
                              className="cursor-pointer"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </motion.div>
                    ))}
                  </Fragment>
                ))}
              </motion.div>
            );
          }, [transactionList, handleEditTransaction, handleDeleteTransaction])}
        </CardContent>
      </Card>
    );
  },
);

TransactionsList.displayName = "TransactionsList";

// Helpers for rendering date headers in a single-pass map
function dateLabel(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";
  return formatDate(date);
}

function dateKey(iso: string): string {
  // Use local day so headers align with what users see
  return new Date(iso).toDateString();
}

function DateHeader({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4 py-3 opacity-50", className)}>
      <Separator className="flex-1" />
      <span className="text-muted-foreground text-sm font-medium">{label}</span>
      <Separator className="flex-1" />
    </div>
  );
}

function groupTransactionsByDate(transactions: Array<Transaction>) {
  const sections: Array<{
    key: string;
    label: string;
    items: Array<Transaction>;
  }> = [];

  let currentKey: string | null = null;

  let current: {
    key: string;
    label: string;
    items: Array<Transaction>;
  } | null = null;

  for (const t of transactions) {
    const key = dateKey(t.date);
    if (key !== currentKey) {
      currentKey = key;
      current = { key, label: dateLabel(t.date), items: [] };
      sections.push(current);
    }
    current!.items.push(t);
  }
  return sections;
}

function useScrollDirectionVisibility() {
  const [isFabVisible, setIsFabVisible] = useState(true);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);
  const visibleRef = useRef(true);
  const bottomSentinelRef = useRef<HTMLDivElement | null>(null);

  /**
   * This hook is used to:
   * - Get current scroll level
   * - Use requestAnimationFrame to batch reads/writes and avoid jank
   * - Toggle FAB visibility based on scroll direction with a small threshold
   * - Force-show the FAB when reaching the end of the list so it doesn't hide
   */
  useEffect(() => {
    lastYRef.current = window.scrollY;
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const diff = currentY - lastYRef.current;
        const threshold = 10; // small movement threshold to avoid jitter
        const doc = document.documentElement;
        const atBottom = window.innerHeight + currentY >= doc.scrollHeight - 2;
        if (diff > threshold && visibleRef.current) {
          visibleRef.current = false;
          setIsFabVisible(false);
        } else if (diff < -threshold && !visibleRef.current) {
          visibleRef.current = true;
          setIsFabVisible(true);
        }
        if (atBottom && !visibleRef.current) {
          visibleRef.current = true;
          setIsFabVisible(true);
        }
        lastYRef.current = currentY;
        tickingRef.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const target = bottomSentinelRef.current;
    if (!target) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!visibleRef.current) {
              visibleRef.current = true;
              setIsFabVisible(true);
            }
          }
        }
      },
      { root: null, threshold: 0 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return { isFabVisible, bottomSentinelRef } as const;
}

function SearchBar({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}) {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <SearchIcon className="absolute left-7 h-4 w-4" />
      <Input
        type="search"
        placeholder="Search transactions..."
        className="ring-offset-ring/50 w-full pl-8 ring-offset-1"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Drawer open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon" className="opacity-50">
            <FilterIcon className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filter Transactions</DrawerTitle>
            <DrawerDescription>Not yet implemented :p</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Apply</Button>
            <Button variant="outline">Reset</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
