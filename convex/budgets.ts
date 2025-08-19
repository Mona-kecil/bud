import { query } from "./_generated/server";

export const getAvailableBudgets = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized access");
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
})