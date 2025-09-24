import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Return the enabled challenges (seed if you want via ensureSeeded)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("ev_challenges").collect();
    return rows;
  },
});

// Idempotent seeder to ensure there are some default challenges
export const ensureSeeded = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("ev_challenges").collect();
    if (existing.length > 0) return { seeded: false, count: existing.length };

    const defaults = [
      { title: "Remove litter in your area", hp: 5, pts: 15, tag: "Waste", active: true },
      { title: "Clean a local spot (before/after)", hp: 8, pts: 20, tag: "Community", active: true },
      { title: "Plant a seedling and water it", hp: 10, pts: 25, tag: "Nature", active: true },
    ] as const;

    for (const c of defaults) {
      await ctx.db.insert("ev_challenges", c);
    }
    return { seeded: true, count: defaults.length };
  },
});

// Save a user's before/after submission
export const submit = mutation({
  args: {
    challengeId: v.id("ev_challenges"),
    beforeFileId: v.id("_storage"),
    afterFileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // get auth user
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Must be signed in");
    }

    // one active submission per (user, challenge) is acceptable; duplicates are okay for demo,
    // but we could enforce uniqueness by scanning existing "pending" ones.
    const id = await ctx.db.insert("ev_challenge_submissions", {
      userId,
      challengeId: args.challengeId,
      beforeFileId: args.beforeFileId,
      afterFileId: args.afterFileId,
      status: "pending",
      aiScore: undefined,
      notes: undefined,
    });

    return { submissionId: id };
  },
});

/**
 * Safely list current user's submissions.
 * Returns [] when not signed in instead of throwing.
 */
export const listMySubmissions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return [];
    }
    const rows = await ctx.db
      .query("ev_challenge_submissions")
      .withIndex("by_user_and_challenge", (q) => q.eq("userId", userId))
      .collect();

    return rows.map((r) => ({
      _id: r._id,
      challengeId: r.challengeId,
      status: r.status,
      aiScore: r.aiScore,
      notes: r.notes,
      _creationTime: r._creationTime,
    }));
  },
});