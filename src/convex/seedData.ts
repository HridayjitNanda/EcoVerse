import { mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

export const seedUserData = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Must be authenticated to seed data");
    }

    // Check if user already has copies
    const existingCopies = await ctx.db
      .query("copies")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    if (existingCopies.length > 0) {
      return { message: "User already has copies, skipping seed" };
    }

    // Sample copy data
    const sampleCopies = [
      {
        title: "Welcome Email Subject Line",
        content: "🎉 Welcome to the family! Your journey starts now",
        category: "email",
        tags: ["welcome", "onboarding", "email"],
      },
      {
        title: "Social Media Post - Product Launch",
        content: "Introducing our game-changing new feature! 🚀 Say goodbye to manual work and hello to automation. Who's ready to level up? #ProductLaunch #Innovation",
        category: "social",
        tags: ["product launch", "social media", "engagement"],
      },
      {
        title: "Ad Headline - Black Friday",
        content: "FLASH SALE: 50% OFF Everything! Limited Time Only - Don't Miss Out!",
        category: "ads",
        tags: ["black friday", "sale", "urgency"],
      },
      {
        title: "Newsletter CTA",
        content: "Ready to transform your workflow? Join 10,000+ professionals who've already made the switch. Get started today →",
        category: "marketing",
        tags: ["newsletter", "cta", "conversion"],
      },
      {
        title: "Customer Support Response",
        content: "Hi there! Thanks for reaching out. I'd be happy to help you with that. Let me look into this right away and get back to you within the next hour.",
        category: "general",
        tags: ["support", "customer service", "response"],
      }
    ];

    // Insert sample copies
    for (const copy of sampleCopies) {
      await ctx.db.insert("copies", {
        ...copy,
        userId: user._id,
        isPublic: false,
        views: Math.floor(Math.random() * 50),
        likes: Math.floor(Math.random() * 10),
      });
    }

    return { message: "Sample data seeded successfully", count: sampleCopies.length };
  },
});
