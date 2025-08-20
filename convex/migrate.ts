import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { formatCategoryName } from "~/lib/utils";



export const backfillCategoriesTable = internalMutation({
  args: {},
  returns: v.object({
    success: v.boolean(),
    createdCount: v.number(),
    updatedCount: v.number(),
    skippedCount: v.number(),
    noCategoryCount: v.number(),
  }),
  handler: async (ctx) => {

    const transactions = await ctx.db.query("transactions").collect();

    console.log(`Starting categories backfill for ${transactions.length} transactions`);

    let createdCount = 0;
    let updatedCount = 0; // transactions relinked to target budget
    let skippedCount = 0; // already correctly linked
    let noCategoryCount = 0; // transactions missing a category string

    try {
      for (const trx of transactions) {
        if (!trx.category) {
          noCategoryCount++;
          continue;
        }

        const categoryName = formatCategoryName(trx.category);

        const existingBudget = await ctx.db
          .query("budgets")
          .withIndex("by_user_name", (q) =>
            q.eq("userId", trx.userId).eq("name", categoryName)
          )
          .first();

        let targetBudgetId = existingBudget?._id;
        if (!targetBudgetId) {
          targetBudgetId = await ctx.db.insert("budgets", {
            userId: trx.userId,
            name: categoryName,
            amount: 100,
          });
          createdCount++;
        }

        if (trx.categoryId !== targetBudgetId) {
          await ctx.db.patch(trx._id, { categoryId: targetBudgetId });
          updatedCount++;
        } else {
          skippedCount++;
        }
      }

      console.log(
        `Migration completed. Created budgets: ${createdCount}. Updated links: ${updatedCount}. Already correct: ${skippedCount}. No category: ${noCategoryCount}`,
      );
      return { success: true, createdCount, updatedCount, skippedCount, noCategoryCount };
    } catch (error) {
      console.log(`Migration failed: ${error}`);
      throw error;
    }
  },
});