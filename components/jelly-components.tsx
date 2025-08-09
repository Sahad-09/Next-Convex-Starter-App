"use client"

import React, { useState } from "react";

type JellyButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "glass" | "jelly";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export const JellyButton: React.FC<JellyButtonProps> = ({
  children,
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
}) => {
  const baseClasses =
    "relative overflow-hidden transition-all duration-500 transform hover:scale-105 active:scale-98 font-semibold rounded-2xl backdrop-blur-xl border";

  const variants: Record<NonNullable<JellyButtonProps["variant"]>, string> = {
    primary:
      "bg-gradient-to-r from-purple-500/90 via-pink-500/90 to-purple-600/90 hover:from-purple-400/95 hover:via-pink-400/95 hover:to-purple-500/95 text-white border-white/20 shadow-[0_8px_32px_rgba(168,85,247,0.4)] hover:shadow-[0_12px_40px_rgba(168,85,247,0.6)]",
    glass:
      "bg-white/10 hover:bg-white/20 text-white border-white/30 shadow-[0_8px_32px_rgba(255,255,255,0.1)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.2)]",
    jelly:
      "bg-gradient-to-br from-cyan-400/80 via-blue-500/80 to-purple-600/80 hover:from-cyan-300/90 hover:via-blue-400/90 hover:to-purple-500/90 text-white border-white/25 shadow-[0_8px_32px_rgba(59,130,246,0.4)] hover:shadow-[0_16px_48px_rgba(59,130,246,0.6)]",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000" />
      <div className="relative px-8 py-4 flex items-center justify-center space-x-2">
        {children}
      </div>
    </button>
  );
};

export const JellyCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}> = ({ children, className = "", glow = false }) => (
  <div
    className={`relative backdrop-blur-2xl bg-white/5 border border-white/20 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_48px_rgba(255,255,255,0.1)] transition-all duration-500 hover:border-white/30 ${
      glow ? "hover:shadow-[0_20px_60px_rgba(168,85,247,0.3)]" : ""
    } ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-purple-500/10 rounded-3xl" />
    <div className="relative z-10">{children}</div>
  </div>
);

export const FloatingOrb: React.FC<{ size?: number; delay?: number; color?: "purple" | "blue" | "pink" }> = ({
  size = 60,
  delay = 0,
  color = "purple",
}) => {
  const colors: Record<string, string> = {
    purple: "from-purple-400 to-pink-600",
    blue: "from-cyan-400 to-blue-600",
    pink: "from-pink-400 to-rose-600",
  };

  return (
    <div
      className={`absolute bg-gradient-to-br ${colors[color]} rounded-full blur-xl opacity-20 animate-float`}
      style={{ width: size, height: size, animationDelay: `${delay}s` }}
    />
  );
};

export const Jelly3DIcon: React.FC<{ logoText: string; size?: number; interactive?: boolean }> = ({
  logoText,
  size = 120,
  interactive = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative mx-auto transition-all duration-700 ${
        interactive ? "hover:scale-110 cursor-pointer" : ""
      }`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br from-purple-400/40 via-pink-500/40 to-cyan-400/40 rounded-3xl blur-2xl transition-all duration-700 ${
          isHovered ? "scale-125 opacity-80" : "scale-100 opacity-60"
        }`}
      />
      <div
        className={`relative w-full h-full bg-gradient-to-br from-white/20 via-purple-500/30 to-pink-500/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] transition-all duration-700 ${
          isHovered ? "rotate-y-12 rotate-x-6" : ""
        }`}
      >
        <div className="absolute inset-2 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`filter drop-shadow-lg transition-all duration-500 ${
              isHovered ? "scale-110" : ""
            }`}
            style={{ fontSize: `${size / 4}px` }}
          >
            {logoText}
          </span>
        </div>
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-white/40 to-transparent rounded-tl-3xl opacity-60" />
      </div>
    </div>
  );
};



