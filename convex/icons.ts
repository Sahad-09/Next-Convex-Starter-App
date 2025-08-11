import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Generate client upload URL for Convex storage
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx): Promise<string> => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Insert a record after the image is already in Convex storage
export const insert = mutation({
  args: {
    prompt: v.string(),
    storageId: v.id("_storage"),
    model: v.optional(v.string()),
    sourceName: v.optional(v.string()),
    sourceStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject ?? identity.tokenIdentifier;

    const id = await ctx.db.insert("icons", {
      userId,
      prompt: args.prompt,
      model: args.model,
      sourceName: args.sourceName,
      storageId: args.storageId,
      sourceStorageId: args.sourceStorageId,
      createdAt: Date.now(),
    });
    return id;
  },
});

// Action to fetch an external URL and store it, then insert a record
export const saveFromUrl = action({
  args: {
    prompt: v.string(),
    imageUrl: v.string(),
    model: v.optional(v.string()),
    sourceName: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<string> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const res = await fetch(args.imageUrl);
    if (!res.ok) throw new Error("Failed to fetch image");
    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") ?? "image/png";
    const blob = new Blob([arrayBuffer], { type: contentType });
    const storageId = await ctx.storage.store(blob);

    const id: string = await ctx.runMutation(api.icons.insert, {
      prompt: args.prompt,
      storageId,
      model: args.model,
      sourceName: args.sourceName,
    });
    return id;
  },
});

export const listByCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject ?? identity.tokenIdentifier;

    const icons = await ctx.db
      .query("icons")
      .withIndex("by_user_createdAt", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const withUrls = await Promise.all(
      icons.map(async (doc) => ({
        ...doc,
        imageUrl: await ctx.storage.getUrl(doc.storageId),
      }))
    );
    return withUrls;
  },
});


