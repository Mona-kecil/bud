import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
        q.eq("tokenIdentifier", identity.tokenIdentifier),
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

    const transaction = await ctx.db.insert("transactions", {
      userId: user._id,
      merchantName: args.merchantName,
      description: args.description,
      amount: args.amount,
      type: args.type,
      category: args.category,
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

    const newTransaction = await ctx.db.patch(args.transactionId, {
      merchantName: args.merchantName,
      description: args.description,
      amount: args.amount,
      type: args.type,
      category: args.category,
      date: args.date,
    });

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
