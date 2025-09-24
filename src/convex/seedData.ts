import { internalMutation, mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

/**
 * Seed a few default challenges if none exist.
 */
export const ensureChallenges = internalMutation({
  args: {},
  handler: async (ctx) => {
    const any = await ctx.db.query("ev_challenges").take(1);
    if (any.length > 0) return;

    const defaults = [
      { title: "Remove litter in your area", description: "Pick up visible trash, bag it, and dispose responsibly.", tag: "Waste", hp: 5, pts: 15 },
      { title: "Clean a local spot (before/after)", description: "Tidy a messy corner, document before/after.", tag: "Community", hp: 8, pts: 20 },
      { title: "Plant a seedling and water it", description: "Plant and water a seedling; protect soil around it.", tag: "Nature", hp: 10, pts: 25 },
    ];

    for (const c of defaults) {
      // Ensure the required 'enabled' flag is present; cast to handle any generated type drift
      await ctx.db.insert("ev_challenges", { ...c, enabled: true } as any);
    }
  },
});

// Add: Public mutation to ensure default challenges exist (safe to call multiple times)
export const ensureChallengesPublic = mutation({
  args: {},
  handler: async (ctx) => {
    // Delegate to the internal seeding logic; idempotent
    await ctx.runMutation(internal.seedData.ensureChallenges, {});
    return null;
  },
});