"use client";

import { TravelVibe } from "@/app/lib/types";

const VIBES: { label: string; value: TravelVibe; icon: string; color: string }[] = [
    { label: "Foodie", value: "Foodie 🍜", icon: "🍜", color: "from-orange-500/20 to-amber-500/20" },
    { label: "Nature", value: "Nature 🌲", icon: "🌲", color: "from-emerald-500/20 to-green-500/20" },
    { label: "History", value: "History 🏛️", icon: "🏛️", color: "from-amber-500/20 to-yellow-500/20" },
    { label: "Budget", value: "Budget 🎒", icon: "🎒", color: "from-sky-500/20 to-blue-500/20" },
    { label: "Luxury", value: "Luxury 💎", icon: "💎", color: "from-violet-500/20 to-purple-500/20" },
    { label: "Relaxation", value: "Relaxation 🧘", icon: "🧘", color: "from-teal-500/20 to-cyan-500/20" },
    { label: "Nightlife", value: "Nightlife 🎉", icon: "🎉", color: "from-pink-500/20 to-rose-500/20" },
];

interface VibeSelectorProps {
    selected: TravelVibe[];
    onChange: (vibes: TravelVibe[]) => void;
}

export function VibeSelector({ selected, onChange }: VibeSelectorProps) {
    const toggleVibe = (vibe: TravelVibe) => {
        if (selected.includes(vibe)) {
            onChange(selected.filter((v) => v !== vibe));
        } else {
            onChange([...selected, vibe]);
        }
    };

    return (
        <div className="flex flex-wrap gap-2.5 justify-center max-w-3xl mx-auto">
            {VIBES.map((vibe, i) => {
                const isSelected = selected.includes(vibe.value);
                return (
                    <button
                        key={vibe.value}
                        onClick={() => toggleVibe(vibe.value)}
                        className={`
                          group relative flex flex-col items-center justify-center gap-1.5 rounded-2xl px-4 py-3 min-w-[80px]
                          font-semibold transition-all duration-300 ease-out
                          ${isSelected
                                ? "bg-gradient-to-br " + vibe.color + " border-cyan-400/50 shadow-[0_0_24px_rgba(34,211,238,0.2)] scale-105 ring-1 ring-cyan-400/30"
                                : "glass-card hover:scale-[1.04] hover:border-white/15"
                            }
                        `}
                        style={{ animationDelay: `${i * 50}ms` }}
                    >
                        {/* Glow dot when selected */}
                        {isSelected && (
                            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-glow-pulse" />
                        )}

                        <span className={`text-2xl transition-transform duration-300 ${isSelected ? "scale-110" : "group-hover:scale-110"}`}>
                            {vibe.icon}
                        </span>
                        <span className={`text-xs tracking-wide ${isSelected ? "text-cyan-300 font-bold" : "text-slate-400 group-hover:text-white"}`}>
                            {vibe.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
