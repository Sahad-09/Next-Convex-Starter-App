"use client"

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Sparkles, Zap, Eye, ArrowRight } from "lucide-react";
import { FloatingOrb } from "@/components/jelly-components";

interface MousePosition {
    x: number;
    y: number;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    velocity: { x: number; y: number };
    life: number;
    maxLife: number;
}

interface Hero3DProps {
    headerContent?: React.ReactNode;
    workflowContent?: React.ReactNode;
}

const Hero3D: React.FC<Hero3DProps> = ({ headerContent, workflowContent }) => {
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
    const [isLoaded, setIsLoaded] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const [particles, setParticles] = useState<Particle[]>([]);
    const particleId = useRef(0);

    // Mouse parallax effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
                const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
                setMousePosition({ x: x * 20, y: y * 20 });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Particle system
    useEffect(() => {
        const createParticle = (): Particle => ({
            id: particleId.current++,
            x: Math.random() * 800,
            y: Math.random() * 600,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.2,
            velocity: {
                x: (Math.random() - 0.5) * 0.5,
                y: (Math.random() - 0.5) * 0.5
            },
            life: 0,
            maxLife: Math.random() * 300 + 200
        });

        const updateParticles = () => {
            setParticles(prev => {
                const updated = prev
                    .map(p => ({
                        ...p,
                        x: p.x + p.velocity.x,
                        y: p.y + p.velocity.y,
                        life: p.life + 1,
                        opacity: Math.max(0, p.opacity - 0.002)
                    }))
                    .filter(p => p.life < p.maxLife && p.opacity > 0);

                // Add new particles occasionally
                if (Math.random() < 0.1 && updated.length < 50) {
                    updated.push(createParticle());
                }

                return updated;
            });

            animationRef.current = requestAnimationFrame(updateParticles);
        };

        // Initialize with some particles
        setParticles(Array.from({ length: 20 }, createParticle));
        updateParticles();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    // Icon showcase data
    const iconShowcase = [
        { flat: '/twitter_flat.png', jelly: '/twitter_jelly.png', name: 'Twitter' },
        { flat: '/apple_flat.png', jelly: '/apple_jelly.png', name: 'Apple' },
        { flat: '/tesla_flat.png', jelly: '/tesla_jelly.png', name: 'Tesla' },
    ];

    const [currentIconIndex, setCurrentIconIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Simple, reliable icon rotation
    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);

            // Small delay for fade out, then change icon
            setTimeout(() => {
                setCurrentIconIndex(prev => (prev + 1) % iconShowcase.length);
                setIsTransitioning(false);
            }, 300);

        }, 4000); // Show each icon for 4 seconds

        return () => clearInterval(interval);
    }, [iconShowcase.length]);

    const Logo2D: React.FC<{ className?: string }> = ({ className = "" }) => {
        const currentIcon = iconShowcase[currentIconIndex];

        return (
            <div className={`relative flex flex-col items-center ${className}`}>
                <div className="w-64 h-64 flex items-center justify-center mb-4">
                    <div className="relative w-48 h-48 bg-white/5 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg border border-white/10">
                        <img
                            src={currentIcon.flat}
                            alt={`${currentIcon.name} Flat 2D Logo`}
                            className="w-32 h-32 object-contain transition-opacity duration-300 ease-in-out"
                            style={{
                                opacity: isTransitioning ? 0 : 1
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <span
                        className="text-white/70 text-sm font-medium transition-opacity duration-300"
                        style={{ opacity: isTransitioning ? 0 : 1 }}
                    >
                        {currentIcon.name} - Flat 2D Logo
                    </span>
                </div>
            </div>
        );
    };

    const Logo3D: React.FC<{ className?: string }> = ({ className = "" }) => {
        const [ripplePhase, setRipplePhase] = useState(0);
        const currentIcon = iconShowcase[currentIconIndex];

        useEffect(() => {
            const interval = setInterval(() => {
                setRipplePhase(prev => (prev + 0.1) % (Math.PI * 2));
            }, 50);
            return () => clearInterval(interval);
        }, []);

        return (
            <div className={`relative flex flex-col items-center ${className}`}>
                {/* Reflection surface */}
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-96 h-2 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-full blur-sm" />

                {/* 3D Logo container */}
                <div
                    className="relative w-64 h-64 flex items-center justify-center perspective-1000 mb-4"
                    style={{
                        transform: `rotateX(${mousePosition.y * 0.3}deg) rotateY(${mousePosition.x * 0.3}deg)`
                    }}
                >
                    {/* Particle glow around logo */}
                    <div className="absolute inset-0">
                        {particles.map(particle => (
                            <div
                                key={particle.id}
                                className="absolute w-1 h-1 bg-purple-400 rounded-full"
                                style={{
                                    left: `${(particle.x / 800) * 100}%`,
                                    top: `${(particle.y / 600) * 100}%`,
                                    opacity: particle.opacity,
                                    transform: `scale(${particle.size})`,
                                    filter: 'blur(0.5px)',
                                    boxShadow: '0 0 6px currentColor'
                                }}
                            />
                        ))}
                    </div>

                    {/* Main 3D logo */}
                    <div
                        className="relative w-48 h-48 transition-all duration-1000 ease-out"
                        style={{
                            transform: `translateZ(30px) rotateY(${Math.sin(Date.now() * 0.001) * 5}deg) rotateX(${Math.cos(Date.now() * 0.0015) * 3}deg)`,
                            filter: `hue-rotate(${ripplePhase * 10}deg)`
                        }}
                    >
                        {/* Glass/jelly effect layers */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 via-pink-500/40 to-cyan-400/30 rounded-3xl backdrop-blur-xl border-2 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
                            {/* Inner glow */}
                            <div className="absolute inset-2 bg-gradient-to-br from-white/30 via-purple-200/20 to-transparent rounded-3xl" />

                            {/* Highlight */}
                            <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-br from-white/60 to-transparent rounded-2xl blur-sm" />

                            {/* Ripple effect */}
                            <div
                                className="absolute inset-0 rounded-3xl"
                                style={{
                                    background: `radial-gradient(circle at ${50 + Math.sin(ripplePhase) * 20}% ${50 + Math.cos(ripplePhase) * 20}%, rgba(255,255,255,0.1) 0%, transparent 60%)`,
                                    transform: `scale(${1 + Math.sin(ripplePhase) * 0.05})`
                                }}
                            />
                        </div>

                        {/* Logo content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div
                                className="relative"
                                style={{
                                    transform: `translateZ(10px) scale(${1 + Math.sin(ripplePhase * 2) * 0.02})`
                                }}
                            >
                                <img
                                    src={currentIcon.jelly}
                                    alt={`${currentIcon.name} Jelly 3D Logo`}
                                    className="w-32 h-32 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)] filter brightness-110 transition-opacity duration-300 ease-in-out"
                                    style={{
                                        filter: `brightness(1.1) contrast(1.1) saturate(1.2) hue-rotate(${Math.sin(ripplePhase) * 5}deg)`,
                                        opacity: isTransitioning ? 0 : 1
                                    }}
                                />

                                {/* Internal light scattering overlay */}
                                <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent rounded-full animate-pulse" />
                            </div>
                        </div>

                        {/* Reflection */}
                        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-32 h-16 opacity-20">
                            <img
                                src={currentIcon.jelly}
                                alt="Reflection"
                                className="w-full h-full object-contain blur-sm transform scale-y-[-1] scale-75 transition-opacity duration-300 ease-in-out"
                                style={{
                                    maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                                    opacity: isTransitioning ? 0 : 1
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <span
                        className="text-white font-medium transition-opacity duration-300"
                        style={{ opacity: isTransitioning ? 0 : 1 }}
                    >
                        {currentIcon.name} - Jelly 3D Magic
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div
            ref={heroRef}
            className="relative overflow-hidden"
            style={{
                background:
                    "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2), transparent 50%), linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
            }}
        >
            {/* Floating orbs - continuous throughout */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <FloatingOrb size={200} delay={0} color="purple" />
                <FloatingOrb size={150} delay={2} color="blue" />
                <FloatingOrb size={100} delay={4} color="pink" />
            </div>

            {/* Header */}
            {headerContent && (
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
                                    JellyMagic AI
                                </h1>
                            </div>
                        </div>
                        {headerContent}
                    </div>
                </header>
            )}

            {/* Hero section - full viewport height */}
            <main className="relative z-10 h-screen flex items-center justify-center">
                <div className="container mx-auto px-6 max-w-7xl">
                    {/* New Layout: Title Left, Comparison Right */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Left side - Title and Description */}
                        <div className="space-y-8">
                            <div>
                                <h2
                                    className={`text-5xl md:text-6xl lg:text-7xl font-black mb-6 transition-all duration-2000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                        }`}
                                >
                                    <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                                        From Flat
                                    </span>
                                    <br />
                                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                                        To Magical
                                    </span>
                                </h2>
                                <p className={`text-lg md:text-xl text-gray-300 leading-relaxed transition-all duration-2000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                    }`}>
                                    Transform your ordinary logos into
                                    <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-semibold">
                                        {" "}mesmerizing 3D jelly masterpieces{" "}
                                    </span>
                                    with realistic glass physics and studio lighting
                                </p>
                            </div>

                            {/* CTA buttons */}
                            <div
                                className={`flex flex-col sm:flex-row items-start gap-4 sm:gap-6 transition-all duration-2000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                    }`}
                            >
                                <button
                                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                                    className="group relative overflow-hidden bg-gradient-to-r from-purple-500/90 via-pink-500/90 to-purple-600/90 hover:from-purple-400/95 hover:via-pink-400/95 hover:to-purple-500/95 text-white font-semibold rounded-2xl px-12 py-4 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(168,85,247,0.4)] hover:shadow-[0_12px_40px_rgba(168,85,247,0.6)] transition-all duration-500 transform hover:scale-105 active:scale-98"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    <div className="relative flex items-center space-x-2">
                                        <Zap className="w-6 h-6" />
                                        <span className="text-lg">Create Your Magic</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Right side - Before/After Comparison */}
                        <div className="space-y-8">
                            {/* Titles */}
                            <div className="grid grid-cols-2 gap-8">
                                <h3 className={`text-xl font-bold text-white/80 text-center transition-all duration-2000 delay-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                                    }`}>
                                    Before
                                </h3>
                                <h3 className={`text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-center transition-all duration-2000 delay-900 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                                    }`}>
                                    After
                                </h3>
                            </div>

                            {/* Logo containers with centered arrow */}
                            <div className="relative">
                                <div className="grid grid-cols-2 gap-8 items-center">
                                    {/* Before Logo */}
                                    <div
                                        className={`flex justify-center transition-all duration-2000 delay-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                                            }`}
                                    >
                                        <Logo2D />
                                    </div>

                                    {/* After Logo */}
                                    <div
                                        className={`flex justify-center transition-all duration-2000 delay-900 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                                            }`}
                                    >
                                        <Logo3D />
                                    </div>
                                </div>

                                {/* Center arrow - perfectly centered between logo boxes */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 z-10" style={{ top: 'calc(50% - 50px)' }}>
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-purple-400/30 rounded-full blur-lg animate-pulse" />
                                        <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3 shadow-lg">
                                            <ArrowRight className="w-6 h-6 text-white animate-bounce" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Feature lists */}
                            <div className="grid grid-cols-2 gap-8">
                                {/* Before features */}
                                <div
                                    className={`space-y-2 transition-all duration-2000 delay-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                                        }`}
                                >
                                    <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                        <span>Static & Flat</span>
                                    </div>
                                    <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                        <span>Limited Impact</span>
                                    </div>
                                    <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                        <span>Forgettable</span>
                                    </div>
                                </div>

                                {/* After features */}
                                <div
                                    className={`space-y-2 transition-all duration-2000 delay-900 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                                        }`}
                                >
                                    <div className="flex items-center justify-center space-x-2 text-purple-300 text-sm">
                                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                                        <span>Interactive & Alive</span>
                                    </div>
                                    <div className="flex items-center justify-center space-x-2 text-pink-300 text-sm">
                                        <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" />
                                        <span>Stunning Depth</span>
                                    </div>
                                    <div className="flex items-center justify-center space-x-2 text-cyan-300 text-sm">
                                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                                        <span>Unforgettable</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Workflow Section - NO BREAK, same container */}
            {workflowContent && (
                <section className="relative z-10 py-16">
                    <div className="container mx-auto px-6 max-w-7xl">
                        {workflowContent}
                    </div>
                </section>
            )}

            {/* Footer - Seamlessly integrated */}
            <footer className="relative z-10 border-t border-white/10 py-16">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid md:grid-cols-4 gap-12">

                        {/* Brand Section */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="absolute -inset-1 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl blur opacity-30" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                                        JellyMagic AI
                                    </h3>
                                    <p className="text-sm text-gray-400">Transform logos into 3D jelly masterpieces</p>
                                </div>
                            </div>
                            <p className="text-gray-300 leading-relaxed max-w-md">
                                Create stunning 3D jelly icons with realistic glass physics and studio lighting.
                                Transform your ordinary logos into mesmerizing works of art.
                            </p>
                            <div className="flex space-x-4">
                                <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110">
                                    <span className="text-white text-lg">𝕏</span>
                                </div>
                                <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110">
                                    <span className="text-white text-lg">📱</span>
                                </div>
                                <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110">
                                    <span className="text-white text-lg">💼</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Links */}
                        <div className="space-y-6">
                            <h4 className="text-lg font-semibold text-white">Product</h4>
                            <ul className="space-y-3">
                                {[
                                    'Features',
                                    'Pricing',
                                    'Gallery',
                                    'API Access',
                                    'Tutorials'
                                ].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-gray-400 hover:text-purple-300 transition-colors duration-300 hover:translate-x-1 inline-block">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company Links */}
                        <div className="space-y-6">
                            <h4 className="text-lg font-semibold text-white">Company</h4>
                            <ul className="space-y-3">
                                {[
                                    'About Us',
                                    'Blog',
                                    'Careers',
                                    'Contact',
                                    'Support'
                                ].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-gray-400 hover:text-purple-300 transition-colors duration-300 hover:translate-x-1 inline-block">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-gray-400 text-sm">
                            © 2024 JellyMagic AI. All rights reserved.
                        </div>
                        <div className="flex space-x-6 text-sm">
                            <a href="#" className="text-gray-400 hover:text-purple-300 transition-colors duration-300">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-gray-400 hover:text-purple-300 transition-colors duration-300">
                                Terms of Service
                            </a>
                            <a href="#" className="text-gray-400 hover:text-purple-300 transition-colors duration-300">
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </footer>

            <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(-5px) rotate(240deg); }
        }

      `}</style>
        </div>
    );
};

export default Hero3D;
