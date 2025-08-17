import { internalMutation } from "./_generated/server";

const formatCategoryName = (name: string) => {
  return name.trim().toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export const backfillCategoriesTable = internalMutation({
  handler: async (ctx) => {

    const transactions = await ctx.db.query("transactions").collect();

    console.log(`Starting categories backfill for ${transactions.length} transactions`);

    let createdCount = 0;
    let skippedCount = 0;

    try {
      for (const trx of transactions) {
        if (!trx.category) {
          skippedCount++;
          continue;
        }

        const categoryName = formatCategoryName(trx.category);

        const isExist = await ctx.db.query("budgets").withIndex("by_user_name", q =>
          q.eq("userId", trx.userId).eq("name", categoryName)
        ).first();
        if (isExist) {
          skippedCount++;
          continue;
        }

        await ctx.db.insert("budgets", {
          userId: trx.userId,
          name: categoryName,
        });

        createdCount++;
      }

      console.log(`Migration completed. Created: ${createdCount}. Skipped: ${skippedCount}`);
      return { success: true, createdCount, skippedCount };
    } catch (error) {
      console.log(`Migration failed: ${error}`);
      throw error;
    }
  }
});