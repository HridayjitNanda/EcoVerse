import { query } from "./_generated/server";

/**
 * Minimal stub to prevent errors from clients calling challenges:listMySubmissions.
 * Returns an empty list for now, regardless of auth state.
 */
export const listMySubmissions = query({
  args: {},
  handler: async (ctx, _args) => {
    return [] as Array<{
      _id?: string;
      title?: string;
      points?: number;
      createdAt?: number;
    }>;
  },
});
