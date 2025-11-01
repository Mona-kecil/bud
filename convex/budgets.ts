import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { formatCategoryName } from "~/lib/utils";

export const getAvailableBudgets = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("budgets"),
      name: v.string(),
      amount: v.optional(v.number()),
    }),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token_identifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const availableBudgets = await ctx.db
      .query("budgets")
      .withIndex("by_user_name", (q) => q.eq("userId", user._id))
      .order("asc")
      .collect();

    const WINDOW_DAYS = 90;
    const NOW = new Date();
    const startUtc = new Date(
      NOW.getTime() - WINDOW_DAYS * 24 * 60 * 60 * 1000,
    );

    const startDate = startUtc.toISOString().slice(0, 10);
    // Use tomorrow as an exclusive upper bound so we include all of today
    const endExclusiveDate = new Date(NOW.getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    const last90DaysTransactions = ctx.db
      .query("transactions")
      .withIndex("by_user_date", (q) =>
        q
          .eq("userId", user._id)
          .gte("date", startDate)
          .lte("date", endExclusiveDate),
      )
      .order("desc");

    const budgetsMap: Map<Id<"budgets">, number> = new Map(
      availableBudgets.map((b) => [b._id, 0]),
    );

    for await (const tx of last90DaysTransactions) {
      if (tx.type === "income") continue;
      if (!tx.categoryId) continue;

      budgetsMap.set(tx.categoryId, (budgetsMap.get(tx.categoryId) ?? 0) + 1);
    }

    const budgetsSortedByUsage = [...availableBudgets].sort((a, b) => {
      const bHits = budgetsMap.get(b._id) ?? 0;
      const aHits = budgetsMap.get(a._id) ?? 0;
      if (bHits !== aHits) return bHits - aHits;
      return a.name.localeCompare(b.name);
    });

    return budgetsSortedByUsage.map((b) => ({
      _id: b._id,
      name: b.name,
      amount: b.amount,
    }));
  },
});

export const createBudget = mutation({
  args: {
    name: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token_identifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .first();

    if (!user) throw new Error("User not found");

    const normalizedName = formatCategoryName(args.name);

    const isUsed = await ctx.db
      .query("budgets")
      .withIndex("by_user_name", (q) =>
        q.eq("userId", user._id).eq("name", normalizedName),
      )
      .first();

    if (isUsed) {
      throw new Error("Budget name is already used");
    }

    const newBudget = await ctx.db.insert("budgets", {
      userId: user._id,
      name: normalizedName,
      amount: args.amount,
    });

    return newBudget;
  },
});

export const updateBudget = mutation({
  args: {
    budgetId: v.id("budgets"),
    name: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token_identifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const budget = await ctx.db.get(args.budgetId);

    if (!budget) {
      throw new Error("Budget not found");
    }

    if (budget.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    const normalizedName = formatCategoryName(args.name);

    // Check existing name, excluding the current budget
    const existingBudget = await ctx.db
      .query("budgets")
      .withIndex("by_user_name", (q) =>
        q.eq("userId", user._id).eq("name", normalizedName),
      )
      .filter((b) => b.neq(b.field("_id"), args.budgetId))
      .first();

    if (existingBudget) {
      throw new Error("Budget name is already used");
    }

    const newBudget = await ctx.db.patch(args.budgetId, {
      name: normalizedName,
      amount: args.amount,
    });

    return newBudget;
  },
});

export const deleteBudget = mutation({
  args: {
    budgetId: v.id("budgets"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token_identifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const budget = await ctx.db.get(args.budgetId);
    if (!budget) throw new Error("Budget not found");

    if (budget.userId !== user._id) throw new Error("Unauthorized");

    await ctx.db.delete(args.budgetId);

    return true;
  },
});

export const getAvailableMonths = query({
  args: {},
  returns: v.array(
    v.object({
      year: v.number(),
      month: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token_identifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get user registration date from _creationTime (system field)
    const userCreationTime = user._creationTime;
    const userCreationDate = new Date(userCreationTime);
    const now = new Date();

    // Generate all months from user registration to current month
    const months: Array<{ year: number; month: number }> = [];
    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth();
    const startYear = userCreationDate.getUTCFullYear();
    const startMonth = userCreationDate.getUTCMonth();

    // Iterate from user creation date to current month
    let year = startYear;
    let month = startMonth;

    while (
      year < currentYear ||
      (year === currentYear && month <= currentMonth)
    ) {
      months.push({ year, month });

      // Move to next month
      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
    }

    // Sort descending (most recent first)
    months.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

    return months;
  },
});

export const getBudgetSpend = query({
  args: {
    year: v.optional(v.number()),
    month: v.optional(v.number()),
  },
  returns: v.record(v.string(), v.number()),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token_identifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get date range for specified month, or current month if not specified
    const now = new Date();
    const targetYear = args.year ?? now.getUTCFullYear();
    const targetMonth = args.month ?? now.getUTCMonth();

    const startUtc = new Date(Date.UTC(targetYear, targetMonth, 1));
    const endUtc = new Date(Date.UTC(targetYear, targetMonth + 1, 0));

    const toIsoDate = (d: Date) => d.toISOString().slice(0, 10);

    const spendByBudget: Record<string, number> = {};

    const txQuery = ctx.db
      .query("transactions")
      .withIndex("by_user_date", (q) =>
        q
          .eq("userId", user._id)
          .gte("date", toIsoDate(startUtc))
          .lte("date", toIsoDate(endUtc)),
      )
      .order("asc");

    for await (const tx of txQuery) {
      if (tx.type === "income") continue;

      if (!tx.categoryId) continue;
      const key = tx.categoryId;
      spendByBudget[key] = (spendByBudget[key] ?? 0) + tx.amount;
    }

    return spendByBudget;
  },
});

export const getTotalBudgets = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token_identifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_user_name", (q) => q.eq("userId", user._id))
      .collect();

    const totalBudgets = budgets.reduce(
      (sum, budget) => sum + budget.amount!,
      0,
    );

    return totalBudgets;
  },
});

export const getTotalSpent = query({
  args: {
    year: v.optional(v.number()),
    month: v.optional(v.number()),
  },
  returns: v.number(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token_identifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Compute date range for specified month, or current month if not specified
    const now = new Date();
    const targetYear = args.year ?? now.getUTCFullYear();
    const targetMonth = args.month ?? now.getUTCMonth();

    const startUtc = new Date(Date.UTC(targetYear, targetMonth, 1));
    const endUtc = new Date(Date.UTC(targetYear, targetMonth + 1, 0));
    const toIsoDate = (d: Date) => d.toISOString().slice(0, 10);
    const startDate = toIsoDate(startUtc);
    const endDate = toIsoDate(endUtc);

    let total = 0;
    const txQuery = ctx.db
      .query("transactions")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).gte("date", startDate).lte("date", endDate),
      )
      .order("asc");

    for await (const tx of txQuery) {
      if (tx.type === "income") continue;
      total += tx.amount;
    }

    return total;
  },
});
