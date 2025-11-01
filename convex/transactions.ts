import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllTransactions = query({
  args: {
    categoryId: v.optional(v.id("budgets")),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    min_amount: v.optional(v.number()),
    max_amount: v.optional(v.number()),
    sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
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

    const sortOrder = args.sortOrder ?? "desc";

    // Use appropriate index based on filters
    let query;
    const startDate = args.startDate;
    const endDate = args.endDate;
    if (args.categoryId) {
      // Use category_date index when category is filtered
      const categoryId = args.categoryId;
      if (startDate && endDate) {
        query = ctx.db
          .query("transactions")
          .withIndex("by_user_category_date", (q) =>
            q
              .eq("userId", user._id)
              .eq("categoryId", categoryId)
              .gte("date", startDate)
              .lte("date", endDate),
          );
      } else if (startDate) {
        query = ctx.db
          .query("transactions")
          .withIndex("by_user_category_date", (q) =>
            q
              .eq("userId", user._id)
              .eq("categoryId", categoryId)
              .gte("date", startDate),
          );
      } else if (endDate) {
        query = ctx.db
          .query("transactions")
          .withIndex("by_user_category_date", (q) =>
            q
              .eq("userId", user._id)
              .eq("categoryId", categoryId)
              .lte("date", endDate),
          );
      } else {
        query = ctx.db
          .query("transactions")
          .withIndex("by_user_category_date", (q) =>
            q.eq("userId", user._id).eq("categoryId", categoryId),
          );
      }
    } else {
      // Use date index for date range filtering or default
      if (startDate && endDate) {
        query = ctx.db
          .query("transactions")
          .withIndex("by_user_date", (q) =>
            q
              .eq("userId", user._id)
              .gte("date", startDate)
              .lte("date", endDate),
          );
      } else if (startDate) {
        query = ctx.db
          .query("transactions")
          .withIndex("by_user_date", (q) =>
            q.eq("userId", user._id).gte("date", startDate),
          );
      } else if (endDate) {
        query = ctx.db
          .query("transactions")
          .withIndex("by_user_date", (q) =>
            q.eq("userId", user._id).lte("date", endDate),
          );
      } else {
        query = ctx.db
          .query("transactions")
          .withIndex("by_user_date", (q) => q.eq("userId", user._id));
      }
    }

    // Collect transactions with sort order
    let transactions = await query.order(sortOrder).collect();

    // Apply amount filters in memory (since Convex recommends using indexes over filter)
    if (args.min_amount !== undefined) {
      transactions = transactions.filter((tx) => tx.amount >= args.min_amount!);
    }
    if (args.max_amount !== undefined) {
      transactions = transactions.filter((tx) => tx.amount <= args.max_amount!);
    }

    return transactions;
  },
});

export const createTransaction = mutation({
  args: {
    merchantName: v.string(),
    description: v.optional(v.string()),
    amount: v.number(),
    type: v.union(
      v.literal("income"),
      v.literal("expense"),
      v.literal("investment"),
    ),
    categoryId: v.id("budgets"),
    date: v.string(),
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

    const transaction = await ctx.db.insert("transactions", {
      userId: user._id,
      merchantName: args.merchantName,
      description: args.description,
      amount: args.amount,
      type: args.type,
      categoryId: args.categoryId,
      date: args.date,
    });

    return transaction;
  },
});

export const updateTransaction = mutation({
  args: {
    transactionId: v.id("transactions"),
    merchantName: v.string(),
    description: v.optional(v.string()),
    amount: v.number(),
    type: v.union(
      v.literal("income"),
      v.literal("expense"),
      v.literal("investment"),
    ),
    categoryId: v.id("budgets"),
    date: v.string(),
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

    const transaction = await ctx.db.get(args.transactionId);

    if (transaction?.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    const patch: Record<string, unknown> = {
      merchantName: args.merchantName,
      description: args.description,
      amount: args.amount,
      type: args.type,
      date: args.date,
      categoryId: args.categoryId,
    };

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

    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.transactionId);

    return true;
  },
});
