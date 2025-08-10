"use client"

import React, { useCallback, useState } from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { FloatingOrb, Jelly3DIcon, JellyButton } from "@/components/jelly-components";
import Workflow from "@/components/workflow";
import { Sparkles, Zap, Eye } from "lucide-react";
import { buildEnhancedPrompt } from "@/utils/logo-3d";
import { extractPaletteFromFile } from "@/utils/color-palette";
import { generateJelly3DIcon } from "@/utils/openai-api";

export default function Home() {
  return (
    <>
      <Authenticated>
        <IndexContent />
      </Authenticated>
      <Unauthenticated>
        <div className="min-h-[50vh] w-full flex items-center justify-center">
          <SignInButton />
        </div>
      </Unauthenticated>
    </>
  );
}

function IndexContent() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generatedIcon, setGeneratedIcon] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showCustomization, setShowCustomization] = useState<boolean>(false);
  const [usePlanner, setUsePlanner] = useState<boolean>(false);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      setUploadedFile(file);
      setGeneratedIcon("");
      setShowCustomization(false);
    },
    []
  );

  const generateIcon = useCallback(async () => {
    if (!uploadedFile) return;
    setIsGenerating(true);
    try {
      const description = uploadedFile?.name
        ? `the uploaded asset: ${uploadedFile.name}`
        : "uploaded logo";
      let baseColor: string | undefined;
      let iconColor: string | undefined;
      try {
        const palette = await extractPaletteFromFile(uploadedFile);
        baseColor = palette.baseColor;
        iconColor = palette.iconColor;
      } catch {
        // If palette extraction fails, fall back silently
      }
      const prompt = buildEnhancedPrompt(description, {
        ...(baseColor ? { baseColor } : {}),
        ...(iconColor ? { iconColor } : {}),
      });
      const url = await generateJelly3DIcon(prompt, { usePlanner });
      setGeneratedIcon(url);
      setShowCustomization(true);
    } catch {
      // No toast layer configured; keep silent but stop loader
    } finally {
      setIsGenerating(false);
    }
  }, [uploadedFile, usePlanner]);

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

      <header className="z-50 backdrop-blur-2xl bg-white/5 border-b border-white/10 sticky top-0 flex justify-between items-center">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(168,85,247,0.4)]">
                <Sparkles className="w-7 h-7 text-white animate-pulse" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl blur opacity-30 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                JellyMagic AI
              </h1>
              <p className="text-sm text-gray-300">
                Transform logos into stunning 3D jelly icons
              </p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <UserButton />
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-12 mb-20">
            <div className="space-y-8">
              <h2 className="text-6xl md:text-8xl font-black leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                  Sculpt Magic
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                  From Pixels
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Watch boring flat logos transform into
                <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-semibold">
                  {" "}
                  mesmerizing jelly masterpieces
                </span>{" "}
                with translucent glass effects, inner glow, and studio-quality lighting.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <JellyButton variant="primary" className="text-lg px-12 py-4" onClick={() => {}}>
                <Zap className="w-6 h-6" />
                <span>Start Creating Magic</span>
              </JellyButton>
              <JellyButton variant="glass" className="text-lg px-8 py-4" onClick={() => {}}>
                <Eye className="w-5 h-5" />
                <span>Watch Demo</span>
              </JellyButton>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mb-6">
            <div className="flex items-center justify-center gap-3 text-sm text-gray-300">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/30 bg-white/10"
                  checked={usePlanner}
                  onChange={(e) => setUsePlanner(e.target.checked)}
                />
                <span>Use smart planner</span>
              </label>
              <span className="text-xs text-gray-400">Refines prompt with a tiny extra LLM call</span>
            </div>
          </div>

          <Workflow
            uploadedFile={uploadedFile}
            handleImageUpload={handleImageUpload}
            isGenerating={isGenerating}
            generatedIcon={generatedIcon}
            generateIcon={generateIcon}
            showCustomization={showCustomization}
          />

          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                Experience the
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Interactive Magic
              </span>
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Every icon is a living, breathing work of art with real glass physics and mesmerizing animations
            </p>
            <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
              {[
                { text: "📱", title: "App Icons", desc: "iOS & Android ready" },
                { text: "💎", title: "Brand Logos", desc: "Premium identity" },
                { text: "🚀", title: "SaaS Products", desc: "Conversion optimized" },
              ].map((item, index) => (
                <div key={index} className="group text-center space-y-6">
                  <div className="relative">
                    <Jelly3DIcon logoText={item.text} size={180} interactive />
                    <div className="absolute -inset-8 bg-gradient-radial from-purple-400/20 via-transparent to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 33% { transform: translateY(-20px) rotate(120deg); } 66% { transform: translateY(-10px) rotate(240deg); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .slider-thumb-purple::-webkit-slider-thumb { appearance: none; height: 20px; width: 20px; border-radius: 50%; background: linear-gradient(45deg, #a855f7, #ec4899); cursor: pointer; box-shadow: 0 4px 20px rgba(168, 85, 247, 0.4); }
        .slider-thumb-pink::-webkit-slider-thumb { appearance: none; height: 20px; width: 20px; border-radius: 50%; background: linear-gradient(45deg, #ec4899, #f43f5e); cursor: pointer; box-shadow: 0 4px 20px rgba(236, 72, 153, 0.4); }
        .slider-thumb-cyan::-webkit-slider-thumb { appearance: none; height: 20px; width: 20px; border-radius: 50%; background: linear-gradient(45deg, #06b6d4, #3b82f6); cursor: pointer; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4); }
        .bg-gradient-radial { background: radial-gradient(circle, var(--tw-gradient-stops)); }
      `}</style>
    </div>
  );
}
