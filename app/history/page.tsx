"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function HistoryPage() {
  return (
    <>
      <Authenticated>
        <Content />
      </Authenticated>
      <Unauthenticated>
        <div className="min-h-[50vh] w-full flex items-center justify-center">
          Please sign in to view your history.
        </div>
      </Unauthenticated>
    </>
  );
}

function Content() {
  const items = useQuery(api.icons.listByCurrentUser, {}) || [];
  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Your Icons</h1>
        <Link href="/" className="text-sm text-gray-300 hover:text-white">Back</Link>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-400">No icons yet. Generate one on the home page.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {items.map((it: any) => (
            <div key={it._id} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="aspect-square bg-black/20 rounded-lg flex items-center justify-center overflow-hidden">
                {it.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={it.imageUrl}
                    alt={it.sourceName ?? "icon"}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400 text-sm">Image loading...</div>
                )}
              </div>
              <div className="mt-3 text-xs text-gray-400 break-words">
                {it.sourceName || "Generated icon"}
              </div>
              <div className="mt-1 text-[10px] text-gray-500">
                {new Date(it.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


