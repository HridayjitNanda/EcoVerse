import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Copy management tables
    copies: defineTable({
      title: v.string(),
      content: v.string(),
      category: v.string(),
      tags: v.array(v.string()),
      userId: v.id("users"),
      isPublic: v.boolean(),
      views: v.number(),
      likes: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_category", ["category"])
      .index("by_public", ["isPublic"]),

    likes: defineTable({
      userId: v.id("users"),
      copyId: v.id("copies"),
    }).index("by_user_and_copy", ["userId", "copyId"]),

    categories: defineTable({
      name: v.string(),
      description: v.optional(v.string()),
      color: v.optional(v.string()),
      userId: v.id("users"),
    }).index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;