import { action, query } from "./_generated/server";
import { v } from "convex/values";

// Generate a signed upload URL for uploading files (before/after photos)
export const generateUploadUrl = action({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Get a temporary URL to view a stored file
export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
