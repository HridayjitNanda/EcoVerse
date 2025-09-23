import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated to create copy");
    }

    return await ctx.db.insert("copies", {
      title: args.title,
      content: args.content,
      category: args.category || "general",
      tags: args.tags || [],
      userId: user._id,
      isPublic: false,
      views: 0,
      likes: 0,
    });
  },
});

export const list = query({
  args: {
    userId: v.optional(v.id("users")),
    category: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let copies;

    if (args.userId) {
      // Narrow the userId for TypeScript inside the closure
      const userId = args.userId!;
      // Use the narrowed value in the index equality check
      copies = await ctx.db
        .query("copies")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
    } else if (args.isPublic) {
      copies = await ctx.db
        .query("copies")
        .withIndex("by_public", (q) => q.eq("isPublic", true))
        .collect();
    } else {
      copies = await ctx.db.query("copies").collect();
    }
    
    if (args.category) {
      return copies.filter(copy => copy.category === args.category);
    }

    return copies;
  },
});

export const get = query({
  args: { id: v.id("copies") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("copies"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated");
    }

    const copy = await ctx.db.get(args.id);
    if (!copy || copy.userId !== user._id) {
      throw new Error("Copy not found or unauthorized");
    }

    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("copies") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated");
    }

    const copy = await ctx.db.get(args.id);
    if (!copy || copy.userId !== user._id) {
      throw new Error("Copy not found or unauthorized");
    }

    return await ctx.db.delete(args.id);
  },
});

export const incrementViews = mutation({
  args: { id: v.id("copies") },
  handler: async (ctx, args) => {
    const copy = await ctx.db.get(args.id);
    if (!copy) return;

    return await ctx.db.patch(args.id, {
      views: copy.views + 1,
    });
  },
});

export const toggleLike = mutation({
  args: { id: v.id("copies") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated");
    }

    const copy = await ctx.db.get(args.id);
    if (!copy) {
      throw new Error("Copy not found");
    }

    // Check if user already liked this copy
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_user_and_copy", (q) => 
        q.eq("userId", user._id).eq("copyId", args.id)
      )
      .unique();

    if (existingLike) {
      // Unlike
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.id, {
        likes: Math.max(0, copy.likes - 1),
      });
      return false;
    } else {
      // Like
      await ctx.db.insert("likes", {
        userId: user._id,
        copyId: args.id,
      });
      await ctx.db.patch(args.id, {
        likes: copy.likes + 1,
      });
      return true;
    }
  },
});