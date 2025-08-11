"use client"

import React, { useCallback, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Hero3D from "@/components/hero-3d";
import Workflow from "@/components/workflow";
import { buildEnhancedPrompt } from "@/utils/logo-3d";
import Link from "next/link";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import AuthModal from "@/components/auth-modal";

export default function Home() {
  return <IndexContent />;
}

function IndexContent() {
  const { isSignedIn } = useUser();
  const saveFromUrl = useAction(api.icons.saveFromUrl);
  const generateUploadUrl = useMutation(api.icons.generateUploadUrl);
  const insertIcon = useMutation(api.icons.insert);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generatedIcon, setGeneratedIcon] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showCustomization, setShowCustomization] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

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
    if (!isSignedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsGenerating(true);
    try {
      const prompt = buildEnhancedPrompt();
      // When a file is present, send multipart to server so OpenAI can incorporate it
      const form = new FormData();
      form.append("prompt", prompt);
      form.append("model", "gpt-image-1");
      form.append("size", "1024x1024");
      form.append("quality", "high");
      form.append("file", uploadedFile, uploadedFile.name || "logo.png");

      const res = await fetch("/api/generate-icon", { method: "POST", body: form });
      if (!res.ok) throw new Error("Failed to generate");
      const { url } = (await res.json()) as { url: string };
      setGeneratedIcon(url);
      // Save to history: data URL path uploads directly to Convex storage; http(s) uses server action
      if (isSignedIn) {
        if (url.startsWith("data:")) {
          try {
            const uploadUrl = await generateUploadUrl({});
            const dataResp = await fetch(url);
            const blob = await dataResp.blob();
            const uploadResp = await fetch(uploadUrl, {
              method: "POST",
              headers: { "Content-Type": blob.type || "image/png" },
              body: blob,
            });
            const json = (await uploadResp.json()) as { storageId: string };
            const storageId = json.storageId as Id<"_storage">;
            await insertIcon({
              prompt,
              storageId,
              model: "gpt-image-1",
              sourceName: uploadedFile?.name ?? undefined,
            });
          } catch {
            // ignore store error
          }
        } else {
          try {
            await saveFromUrl({
              prompt,
              imageUrl: url,
              model: "gpt-image-1",
              sourceName: uploadedFile?.name ?? undefined,
            });
          } catch {
            // ignore store error
          }
        }
      }
      setShowCustomization(true);
    } catch {
      // No toast layer configured; keep silent but stop loader
    } finally {
      setIsGenerating(false);
    }
  }, [uploadedFile, saveFromUrl, generateUploadUrl, insertIcon, isSignedIn]);

  return (
    <>
      <Hero3D 
      headerContent={
        <div className="flex items-center gap-4">
          <Link href="/history" className="text-sm text-gray-300 hover:text-white">History</Link>
          {isSignedIn ? (
            <UserButton />
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="text-sm cursor-pointer text-gray-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10"
            >
              Sign in
            </button>
          )}
        </div>
      } 
      workflowContent={
        <Workflow
          uploadedFile={uploadedFile}
          handleImageUpload={handleImageUpload}
          isGenerating={isGenerating}
          generatedIcon={generatedIcon}
          generateIcon={generateIcon}
        />
      }
      />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
