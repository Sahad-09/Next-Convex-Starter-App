"use client";

import React from "react";
import { X } from "lucide-react";
import { SignIn } from "@clerk/nextjs";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
};

export default function AuthModal({
  isOpen,
  onClose,
  title = "Sign in to continue",
  description = "Create an account or sign in to generate and save your 3D icons.",
}: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Glow accents */}
      <div className="pointer-events-none absolute -inset-20 opacity-50">
        <div className="absolute left-20 top-10 w-72 h-72 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute right-16 bottom-10 w-72 h-72 rounded-full bg-cyan-400/30 blur-3xl" />
      </div>

      {/* Modal */}
      <div className="relative z-[101] w-full max-w-xl">
        <div className="relative rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
          {/* Top glow */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-cyan-400/20 blur-2xl" />

          <div className="relative p-6 md:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                  {title}
                </h2>
                <p className="mt-1 text-sm text-gray-300">{description}</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="inline-flex cursor-pointer h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white/80 hover:text-white hover:bg-white/15"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 p-4 md:p-6">
              {/* Embedded Clerk SignIn */}
              <div className="flex justify-center">
                <SignIn routing="hash" appearance={{ elements: { card: "bg-transparent shadow-none", headerTitle: "text-white", socialButtonsBlockButton: "bg-white/10 hover:bg-white/20 text-white border-white/20", formFieldInput: "bg-white/10 border-white/20 text-white placeholder:text-gray-400", formButtonPrimary: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600", footerActionText: "text-gray-300", footerActionLink: "text-purple-300 hover:text-purple-200" } }} />
              </div>
          </div>
        </div>
      </div>
    </div>
</div>
  );
}
