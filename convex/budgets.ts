import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { formatCategoryName } from "~/lib/utils";

export const getAvailableBudgets = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token_identifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      ).first();

    if (!user) {
      throw new Error("User not found");
    }

    const availableBudgets = await ctx.db
      .query("budgets")
      .withIndex("by_user_name", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return availableBudgets;
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
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      ).first();

    if (!user) throw new Error("User not found");

    const normalizedName = formatCategoryName(args.name);

    const isUsed = await ctx.db
      .query("budgets")
      .withIndex("by_user_name", (q) =>
        q
          .eq("userId", user._id)
          .eq("name", normalizedName)
      ).first();

    if (isUsed) {
      throw new Error("Budget name is already used");
    }

    const newBudget = await ctx.db
      .insert("budgets", {
        userId: user._id,
        name: normalizedName,
        amount: args.amount
      });

    return newBudget;
  }
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
        q.eq("userId", user._id).eq("name", normalizedName)
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
  }
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
  }
})

export const getBudgetSpend = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token_identifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get current month date range for spendByBudget
    const now = new Date();
    const startUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const endUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));

    const toIsoDate = (d: Date) => d.toISOString().slice(0, 10);

    const spendByBudget: Record<string, number> = {};

    const txQuery = ctx.db
      .query("transactions")
      .withIndex("by_user_date", (q) =>
        q
          .eq("userId", user._id)
          .gte("date", toIsoDate(startUtc))
          .lte("date", toIsoDate(endUtc))
      )
      .order("asc");

    for await (const tx of txQuery) {
      if (tx.type !== "expense") continue;
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
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_user_name", (q) =>
        q
          .eq("userId", user._id)
      ).collect();

    const totalBudgets = budgets.reduce((sum, budget) => sum + budget.amount!, 0);

    return totalBudgets;
  }
});

export const getTotalSpent = query({
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
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Compute current month in YYYY-MM-DD to match stored string dates
    const now = new Date();
    const startUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const endUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));
    const toIsoDate = (d: Date) => d.toISOString().slice(0, 10);
    const startDate = toIsoDate(startUtc);
    const endDate = toIsoDate(endUtc);

    let total = 0;
    const txQuery = ctx.db
      .query("transactions")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).gte("date", startDate).lte("date", endDate)
      )
      .order("asc");

    for await (const tx of txQuery) {
      if (tx.type !== "expense") continue;
      total += tx.amount;
    }

    return total;
  }
});