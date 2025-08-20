import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { formatCategoryName } from "~/lib/utils";

export const getAllTransactions = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    min_amount: v.optional(v.number()),
    max_amount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized access");
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

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user_date", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return transactions;
  },
});

export const createTransaction = mutation({
  args: {
    merchantName: v.optional(v.string()),
    description: v.optional(v.string()),
    amount: v.number(),
    type: v.union(
      v.literal("income"),
      v.literal("expense"),
      v.literal("investment"),
    ),
    category: v.optional(v.string()),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized access");
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

    // Resolve categoryId from budgets if a category name is provided
    let resolvedCategoryId = undefined;
    let normalizedCategory: string | undefined = undefined;
    if (args.category) {
      normalizedCategory = formatCategoryName(args.category);
      const budget = await ctx.db
        .query("budgets")
        .withIndex("by_user_name", (q) =>
          q.eq("userId", user._id).eq("name", normalizedCategory!),
        )
        .first();
      if (budget) {
        resolvedCategoryId = budget._id;
      }
    }

    const transaction = await ctx.db.insert("transactions", {
      userId: user._id,
      merchantName: args.merchantName,
      description: args.description,
      amount: args.amount,
      type: args.type,
      category: normalizedCategory ?? args.category,
      categoryId: resolvedCategoryId,
      date: args.date,
    });

    return transaction;
  },
});

export const updateTransaction = mutation({
  args: {
    transactionId: v.id("transactions"),
    merchantName: v.optional(v.string()),
    description: v.optional(v.string()),
    amount: v.optional(v.number()),
    type: v.optional(
      v.union(
        v.literal("income"),
        v.literal("expense"),
        v.literal("investment"),
      ),
    ),
    category: v.optional(v.string()),
    date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized access");
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

    const patch: Record<string, unknown> = {
      merchantName: args.merchantName,
      description: args.description,
      amount: args.amount,
      type: args.type,
      date: args.date,
    };

    if (args.category !== undefined) {
      const normalized = formatCategoryName(args.category);
      patch["category"] = normalized;
      const budget = await ctx.db
        .query("budgets")
        .withIndex("by_user_name", (q) =>
          q.eq("userId", user._id).eq("name", normalized),
        )
        .first();
      if (budget) {
        patch["categoryId"] = budget._id;
      }
    }

    const newTransaction = await ctx.db.patch(args.transactionId, patch);

    return newTransaction;
  },
});

export const deleteTransaction = mutation({
  args: {
    transactionId: v.id("transactions"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized access");
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

    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction.userId !== user._id) {
      throw new Error("Unauthorized access");
    }

    await ctx.db.delete(args.transactionId);

    return true;
  },
});