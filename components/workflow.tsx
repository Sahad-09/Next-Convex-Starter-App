"use client"

import React from "react";
import { Sparkles, Wand2, Eye, Star, Download, Heart } from "lucide-react";
import { JellyCard, JellyButton, Jelly3DIcon } from "@/components/jelly-components";

type WorkflowProps = {
  uploadedFile: File | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isGenerating: boolean;
  generatedIcon: string;
  generateIcon: () => void;
  showCustomization: boolean;
};

const Workflow: React.FC<WorkflowProps> = ({
  uploadedFile,
  handleImageUpload,
  isGenerating,
  generatedIcon,
  generateIcon,
  showCustomization,
}) => {
  const handleDownload = async () => {
    if (!generatedIcon) return;
    try {
      const response = await fetch(generatedIcon, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "jelly-icon.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      // Fallback: open in a new tab if direct download fails (e.g., CORS)
      window.open(generatedIcon, "_blank");
    }
  };
  return (
    <div className="grid lg:grid-cols-3 gap-8 mb-20">
      {/* 1. Upload Section */}
      <JellyCard glow>
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-[0_4px_20px_rgba(168,85,247,0.4)]">
              <span className="text-white font-bold">1</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Upload Logo</h3>
              <p className="text-sm text-gray-300">Drop your flat logo here</p>
            </div>
          </div>
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="h-48 border-2 border-dashed border-white/30 rounded-2xl flex flex-col items-center justify-center space-y-4 bg-white/5 backdrop-blur-xl transition-all duration-300 group-hover:border-purple-400/50 group-hover:bg-white/10">
              {uploadedFile ? (
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-[0_8px_32px_rgba(34,197,94,0.4)]">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white font-medium">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-400">Ready for transformation!</p>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto border border-white/20">
                    <Sparkles className="w-8 h-8 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Drop your logo here</p>
                    <p className="text-xs text-gray-400">PNG, JPG, SVG supported</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {uploadedFile && !isGenerating && !generatedIcon && (
            <JellyButton onClick={generateIcon} className="w-full">
              <Wand2 className="w-5 h-5" />
              <span>Create Jelly Magic</span>
            </JellyButton>
          )}
        </div>
      </JellyCard>

      {/* 2. Preview Section */}
      <JellyCard>
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-[0_4px_20px_rgba(59,130,246,0.4)]">
              <span className="text-white font-bold">2</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Preview Magic</h3>
              <p className="text-sm text-gray-300">Watch the transformation happen</p>
            </div>
          </div>
          <div className="h-48 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center relative overflow-hidden">
            {isGenerating ? (
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
                  <div className="absolute inset-0 bg-purple-400 rounded-full blur-xl opacity-30 animate-pulse" />
                </div>
                <div>
                  <p className="text-white font-medium">Creating magic...</p>
                  <p className="text-xs text-purple-300">AI is sculpting your jelly icon</p>
                </div>
              </div>
            ) : generatedIcon ? (
              <div className="relative group">
                <img
                  src={generatedIcon}
                  alt="Generated icon preview"
                  className="w-36 h-36 rounded-2xl object-cover shadow-[0_8px_32px_rgba(168,85,247,0.35)]"
                />
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-cyan-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ) : (
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto border border-white/20">
                  <Eye className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Preview will appear here</p>
                  <p className="text-xs text-gray-400">Upload a logo to begin</p>
                </div>
              </div>
            )}
          </div>
          {generatedIcon && (
            <div className="flex space-x-3">
              <JellyButton variant="glass" className="flex-1" onClick={handleDownload}>
                <Download className="w-4 h-4" />
                <span>Download</span>
              </JellyButton>
              <JellyButton variant="jelly" className="flex-1" onClick={() => {}}>
                <Heart className="w-4 h-4" />
                <span>Love it!</span>
              </JellyButton>
            </div>
          )}
        </div>
      </JellyCard>

      {/* 3. Customization Section */}
      <JellyCard>
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-[0_4px_20px_rgba(236,72,153,0.4)]">
              <span className="text-white font-bold">3</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Perfect Your Style</h3>
              <p className="text-sm text-gray-300">Fine-tune every detail</p>
            </div>
          </div>
          {showCustomization ? (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Jelly Transparency</label>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="70"
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider-thumb-purple"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Inner Glow</label>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="85"
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider-thumb-pink"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Glass Reflection</label>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="60"
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider-thumb-cyan"
                  />
                </div>
              </div>
              <JellyButton variant="primary" className="w-full mt-6" onClick={() => {}}>
                <span>Apply Changes</span>
              </JellyButton>
            </div>
          ) : (
            <div className="h-48 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-2xl flex items-center justify-center mx-auto border border-white/20">
                  <Eye className="w-8 h-8 text-pink-300" />
                </div>
                <div>
                  <p className="text-white font-medium">Customization awaits</p>
                  <p className="text-xs text-gray-400">Generate an icon to unlock options</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </JellyCard>
    </div>
  );
};

export default Workflow;



