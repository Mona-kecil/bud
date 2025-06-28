import { defineTable, defineSchema } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  }).index("by_token_identifier", ["tokenIdentifier"]),
  transactions: defineTable({
    userId: v.id("users"),
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
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_user_type", ["userId", "type"])
    .index("by_user_amount", ["userId", "amount"]),
});
