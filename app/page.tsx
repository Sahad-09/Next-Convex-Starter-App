"use client"

import React, { useCallback, useState } from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
// import { FloatingOrb, Jelly3DIcon, JellyButton } from "@/components/jelly-components";
import Hero3D from "@/components/hero-3d";
import Workflow from "@/components/workflow";
// import { Sparkles, Zap, Eye } from "lucide-react";
import { buildEnhancedPrompt } from "@/utils/logo-3d";
import { generateJelly3DIcon } from "@/utils/openai-api";
import Link from "next/link";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Home() {
  return (
    <>
      <Authenticated>
        <IndexContent />
      </Authenticated>
      <Unauthenticated>
        <Hero3D headerContent={<SignInButton />} />
      </Unauthenticated>
    </>
  );
}

function IndexContent() {
  const saveFromUrl = useAction(api.icons.saveFromUrl);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generatedIcon, setGeneratedIcon] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showCustomization, setShowCustomization] = useState<boolean>(false);

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
      const prompt = buildEnhancedPrompt();
      const url = await generateJelly3DIcon(prompt);
      setGeneratedIcon(url);
      // Fire-and-forget save to Convex for user history
      void saveFromUrl({
        prompt,
        imageUrl: url,
        model: "dall-e-3",
        sourceName: uploadedFile?.name ?? undefined,
      });
      setShowCustomization(true);
    } catch {
      // No toast layer configured; keep silent but stop loader
    } finally {
      setIsGenerating(false);
    }
  }, [uploadedFile, saveFromUrl]);

  return (
    <Hero3D 
      headerContent={
        <div className="flex items-center gap-4">
          <Link href="/history" className="text-sm text-gray-300 hover:text-white">History</Link>
          <UserButton />
        </div>
      } 
      workflowContent={
        <Workflow
          uploadedFile={uploadedFile}
          handleImageUpload={handleImageUpload}
          isGenerating={isGenerating}
          generatedIcon={generatedIcon}
          generateIcon={generateIcon}
          showCustomization={showCustomization}
        />
      }
    />
  );
}
