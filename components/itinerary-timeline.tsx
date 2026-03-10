"use client";

import { useState } from "react";
import { DayItinerary } from "@/app/lib/types";
import { Sunrise, Sun, Moon, Navigation, ChevronRight } from "lucide-react";

function getTimeIcon(time: string) {
    const t = time.toLowerCase();
    if (t.includes("morning")) return <Sunrise className="w-4 h-4" />;
    if (t.includes("afternoon")) return <Sun className="w-4 h-4" />;
    return <Moon className="w-4 h-4" />;
}

function getTimeColor(time: string) {
    const t = time.toLowerCase();
    if (t.includes("morning")) return "text-amber-400 bg-amber-500/15 border-amber-500/25";
    if (t.includes("afternoon")) return "text-sky-400 bg-sky-500/15 border-sky-500/25";
    return "text-indigo-400 bg-indigo-500/15 border-indigo-500/25";
}

function getAccentGradient(time: string) {
    const t = time.toLowerCase();
    if (t.includes("morning")) return "from-amber-400 to-orange-500";
    if (t.includes("afternoon")) return "from-sky-400 to-blue-500";
    return "from-indigo-400 to-purple-500";
}

function getCardBg(time: string) {
    const t = time.toLowerCase();
    if (t.includes("morning")) return "from-amber-500/8 to-orange-500/4 border-amber-500/15 hover:border-amber-500/30";
    if (t.includes("afternoon")) return "from-sky-500/8 to-blue-500/4 border-sky-500/15 hover:border-sky-500/30";
    return "from-indigo-500/8 to-purple-500/4 border-indigo-500/15 hover:border-indigo-500/30";
}

export function ItineraryTimeline({ days }: { days: DayItinerary[] }) {
    const [activeDay, setActiveDay] = useState(0);

    return (
        <div className="space-y-6">
            {/* Day Tabs — side by side */}
            <div className="flex items-center gap-2 flex-wrap">
                {days.map((day, idx) => (
                    <button
                        key={day.day}
                        onClick={() => setActiveDay(idx)}
                        className={`
                            relative flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm
                            transition-all duration-300 ease-out cursor-pointer
                            ${activeDay === idx
                                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/15 text-white border border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.15)] scale-[1.02]"
                                : "glass-card text-slate-400 hover:text-white hover:scale-[1.02]"
                            }
                        `}
                    >
                        {activeDay === idx && (
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                        )}

                        <div className={`
                            flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold
                            ${activeDay === idx
                                ? "bg-cyan-400/20 text-cyan-300 ring-1 ring-cyan-400/30"
                                : "bg-white/5 text-slate-500"
                            }
                        `}>
                            {day.day}
                        </div>
                        <span>Day {day.day}</span>
                    </button>
                ))}
            </div>

            {/* Active Day Activities — vertical stack for maximum content space */}
            <div className="space-y-4 animate-fade-in-up" key={activeDay}>
                {days[activeDay]?.activities.map((act, i) => (
                    <div
                        key={i}
                        className={`
                            group relative rounded-2xl overflow-hidden
                            bg-gradient-to-br ${getCardBg(act.time)}
                            border backdrop-blur-md
                            transition-all duration-300 ease-out
                        `}
                    >
                        {/* Top accent line */}
                        <div className={`h-0.5 w-full bg-gradient-to-r ${getAccentGradient(act.time)}`} />

                        <div className="p-6 space-y-4">
                            {/* Header: Time badge + Activity title */}
                            <div className="flex items-start gap-4">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border shrink-0 ${getTimeColor(act.time)}`}>
                                    {getTimeIcon(act.time)}
                                    {act.time}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-white text-lg leading-snug">
                                        {act.activity}
                                    </h4>
                                    {act.description && (
                                        <p className="text-sm text-slate-400 mt-1">{act.description}</p>
                                    )}
                                </div>
                            </div>

                            {/* Travel Tip */}
                            {act.travel_tip && (
                                <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-cyan-500/8 border border-cyan-500/15">
                                    <Navigation className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                                    <p className="text-xs text-cyan-300/80 leading-relaxed">{act.travel_tip}</p>
                                </div>
                            )}

                            {/* Bullet-point Details */}
                            {act.details && act.details.length > 0 && (
                                <ul className="space-y-2 pl-1">
                                    {act.details.map((detail, j) => (
                                        <li key={j} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                                            <ChevronRight className="w-3.5 h-3.5 text-slate-500 mt-1 shrink-0" />
                                            <span>{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Fallback: if no details array, show description as single bullet */}
                            {(!act.details || act.details.length === 0) && act.description && (
                                <ul className="space-y-2 pl-1">
                                    <li className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 mt-1 shrink-0" />
                                        <span>{act.description}</span>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
