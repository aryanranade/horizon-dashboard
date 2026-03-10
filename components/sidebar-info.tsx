"use client";

import { useState } from "react";
import { PackingItem, BudgetItem } from "@/app/lib/types";
import { Check, DollarSign, Backpack } from "lucide-react";

interface SidebarInfoProps {
    packingList: PackingItem[];
    budget: string;
    budgetBreakdown?: BudgetItem[];
}

export function SidebarInfo({ packingList, budget, budgetBreakdown }: SidebarInfoProps) {
    const [checked, setChecked] = useState<Set<number>>(new Set());

    const toggleItem = (index: number) => {
        setChecked((prev) => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

    // Split items into unchecked and checked, preserving original indices
    const uncheckedItems = packingList
        .map((item, i) => ({ ...item, originalIndex: i }))
        .filter((_, i) => !checked.has(i));

    const checkedItems = packingList
        .map((item, i) => ({ ...item, originalIndex: i }))
        .filter((_, i) => checked.has(i));

    const sortedItems = [...uncheckedItems, ...checkedItems];

    // Emoji map for budget categories
    const getCategoryIcon = (category: string) => {
        const lower = category.toLowerCase();
        if (lower.includes("accommodation") || lower.includes("hotel")) return "🏨";
        if (lower.includes("food") || lower.includes("dining")) return "🍽️";
        if (lower.includes("transport")) return "🚇";
        if (lower.includes("activit") || lower.includes("entry")) return "🎟️";
        if (lower.includes("shopping")) return "🛍️";
        if (lower.includes("nightlife") || lower.includes("entertainment")) return "🎶";
        if (lower.includes("misc")) return "📦";
        return "💰";
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ═══════ Packing Checklist ═══════ */}
            <div className="rounded-2xl glass-panel p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400">
                        <Backpack className="w-4 h-4" />
                    </div>
                    <h3 className="text-white font-semibold text-sm">Packing Checklist</h3>
                    <span className="ml-auto text-xs text-slate-500">
                        {checked.size}/{packingList.length}
                    </span>
                </div>
                <div className="space-y-1.5">
                    {sortedItems.map((item) => {
                        const isChecked = checked.has(item.originalIndex);
                        return (
                            <button
                                key={item.originalIndex}
                                onClick={() => toggleItem(item.originalIndex)}
                                className={`
                                    flex items-center gap-3 w-full text-left p-2.5 -mx-1 rounded-xl
                                    transition-all duration-300 ease-out cursor-pointer
                                    ${isChecked
                                        ? "bg-emerald-500/8 opacity-60"
                                        : "hover:bg-white/5"
                                    }
                                `}
                            >
                                <div className={`
                                    flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
                                    transition-all duration-200
                                    ${isChecked
                                        ? "border-emerald-400 bg-emerald-500/25"
                                        : "border-slate-600 hover:border-cyan-400"
                                    }
                                `}>
                                    {isChecked && (
                                        <Check className="w-3 h-3 text-emerald-400" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className={`
                                        text-sm block truncate transition-all duration-200
                                        ${isChecked
                                            ? "text-slate-500 line-through"
                                            : "text-slate-300"
                                        }
                                    `}>
                                        {item.item}
                                    </span>
                                    {!isChecked && item.reason && (
                                        <span className="text-xs text-slate-500 block truncate mt-0.5">
                                            {item.reason}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ═══════ Budget Breakdown ═══════ */}
            <div className="rounded-2xl overflow-hidden glass-panel flex flex-col">
                <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
                <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                            <DollarSign className="w-4 h-4" />
                        </div>
                        <h3 className="text-white font-semibold text-sm">Daily Budget</h3>
                    </div>
                    <div className="text-2xl font-extrabold text-white tracking-tight mb-4">
                        {budget}
                    </div>

                    {/* Breakdown List */}
                    {budgetBreakdown && budgetBreakdown.length > 0 ? (
                        <div className="space-y-2.5 flex-1">
                            {budgetBreakdown.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-3 p-2 -mx-1 rounded-lg hover:bg-white/3 transition-colors"
                                >
                                    <span className="text-base mt-0.5 shrink-0">{getCategoryIcon(item.category)}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-sm text-slate-300 font-medium truncate">
                                                {item.category}
                                            </span>
                                            <span className="text-sm font-bold text-white shrink-0">
                                                {item.amount}
                                            </span>
                                        </div>
                                        {item.note && (
                                            <p className="text-xs text-slate-500 mt-0.5 truncate">{item.note}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500 mt-1">Per day, solo traveler</p>
                    )}
                </div>
            </div>
        </div>
    );
}
