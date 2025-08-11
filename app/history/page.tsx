"use client";
import { Authenticated, Unauthenticated } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { JellyCard, JellyButton, FloatingOrb } from "@/components/jelly-components";
import { Download, Clock, Sparkles } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function HistoryPage() {
  return (
    <>
      <Authenticated>
        <Content />
      </Authenticated>
      <Unauthenticated>
        <div className="min-h-[50vh] w-full flex items-center justify-center px-6">
          <JellyCard className="max-w-xl w-full text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-2">
              Sign in to view your history
            </h1>
            <p className="text-sm text-gray-300">Your generated 3D icons will appear here after you sign in.</p>
          </JellyCard>
        </div>
      </Unauthenticated>
    </>
  );
}

function Content() {
  const items = useQuery(api.icons.listByCurrentUser, {}) || [];
  const handleDownload = async (imageUrl: string, sourceName?: string) => {
    if (!imageUrl) return;
    const fallbackName = `jelly-forge-icon-${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.png`;
    const fileName = (sourceName || fallbackName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + ".png";
    try {
      const res = await fetch(imageUrl, { mode: "cors" });
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2), transparent 50%), linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
      }}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingOrb size={200} delay={0} color="purple" />
        <FloatingOrb size={150} delay={2} color="blue" />
        <FloatingOrb size={100} delay={4} color="pink" />
      </div>

      <header className="relative z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl blur opacity-30" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                Jelly Forge
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-300 hover:text-white">Home</Link>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                Your 3D Icons
              </span>
            </h2>
            <p className="text-sm text-gray-300">All the icons you’ve generated with Jelly Forge.</p>
          </div>
        </div>

        {items.length === 0 ? (
          <JellyCard className="text-center">
            <p className="text-gray-300">No icons yet. Generate one on the home page.</p>
          </JellyCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {items.map((it) => (
              <JellyCard key={it._id} className="p-5" glow>
                <div className="aspect-square bg-white/5 rounded-2xl border border-white/20 flex items-center justify-center overflow-hidden">
                  {it.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={it.imageUrl}
                      alt={it.sourceName ?? "jelly forge icon"}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">Image loading...</div>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm text-white truncate">
                      {it.sourceName || "Generated icon"}
                    </div>
                    <div className="mt-1 text-[11px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(it.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <JellyButton
                    variant="glass"
                    className="px-4 py-2"
                    onClick={() => handleDownload(it.imageUrl as string, it.sourceName ?? undefined)}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </JellyButton>
                </div>
              </JellyCard>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


