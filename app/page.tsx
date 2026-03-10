"use client";

import { useState } from "react";
import { Search, Loader2, Sparkles, MapPin, Calendar } from "lucide-react";
import { generateItinerary, getWeather } from "@/app/actions";
import { TripPlan, WeatherData, TravelVibe } from "@/app/lib/types";
import { WeatherWidget } from "@/components/weather-widget";
import { VibeSelector } from "@/components/vibe-selector";
import { ItineraryTimeline } from "@/components/itinerary-timeline";
import { SidebarInfo } from "@/components/sidebar-info";
import { ExportButton } from "@/components/export-button";

export default function Home() {
  const [city, setCity] = useState("");
  const [days, setDays] = useState(3);
  const [vibes, setVibes] = useState<TravelVibe[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const handleSearch = async () => {
    if (!city || vibes.length === 0) {
      setError("Please enter a city and select at least one vibe.");
      return;
    }

    setLoading(true);
    setError(null);
    setPlan(null);
    setWeather(null);
    setWeatherLoading(true);

    try {
      const weatherData = await getWeather(city);
      setWeather(weatherData);
      setWeatherLoading(false);

      const result = await generateItinerary({ city, vibes, days });
      setPlan(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setWeatherLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 selection:bg-cyan-500/30">

      <div className={`mx-auto max-w-6xl flex flex-col transition-all duration-700 ease-in-out ${plan || loading ? "justify-start mt-4" : "justify-center min-h-[85vh]"}`}>

        {/* ═══════════════════════════════════════════
            Hero / Header
            ═══════════════════════════════════════════ */}
        <header className={`mb-10 text-center transition-all duration-700 ${plan ? "mb-6" : ""}`}>
          {!plan && (
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-8 w-[500px] h-[200px] bg-cyan-500/8 rounded-full blur-[100px] pointer-events-none" />
          )}

          <h1 className={`relative ${plan ? 'text-2xl' : 'text-5xl md:text-7xl mb-3'} font-extrabold tracking-tight text-white transition-all duration-700`}>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              Horizon
            </span>
          </h1>
          <p className={`relative ${plan ? 'text-xs' : 'text-base md:text-lg'} text-slate-500 font-medium transition-all duration-700 mt-2 tracking-wide`}>
            {plan ? "Travel Intelligence Engine" : "Discover your next adventure with AI-powered intelligence"}
          </p>
        </header>

        {/* ═══════════════════════════════════════════
            Search, Days, & Vibes
            ═══════════════════════════════════════════ */}
        <div className={`space-y-8 w-full max-w-3xl mx-auto transition-all duration-500 ${plan ? "max-w-2xl scale-[0.92] opacity-80" : "scale-100 opacity-100"}`}>

          {/* Search Bar + Days Input Row */}
          <div className="w-full px-2 md:px-8">
            <div className="flex gap-3 items-stretch">
              {/* Search */}
              <div className="glass-input flex items-center rounded-2xl overflow-hidden h-14 md:h-16 flex-1">
                <div className="flex items-center justify-center w-12 h-full">
                  <Search className="h-5 w-5 text-cyan-400/70" />
                </div>
                <input
                  type="text"
                  placeholder="Where do you want to explore?"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-full bg-transparent text-white px-2 text-base md:text-lg font-medium outline-none placeholder:text-slate-500 placeholder:font-normal"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                {city && (
                  <div className="flex items-center pr-4">
                    <MapPin className="h-4 w-4 text-cyan-400/50" />
                  </div>
                )}
              </div>

              {/* Days Selector */}
              <div className="glass-input flex items-center rounded-2xl overflow-hidden h-14 md:h-16 px-4 gap-2.5 shrink-0">
                <Calendar className="h-4 w-4 text-cyan-400/70" />
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="bg-transparent text-white text-sm md:text-base font-semibold outline-none cursor-pointer appearance-none pr-1"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
                    <option key={d} value={d} className="bg-slate-900 text-white">
                      {d} {d === 1 ? "Day" : "Days"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Vibe Selector */}
          <div className="flex flex-col items-center gap-5 w-full">
            <span className="text-slate-500 font-medium tracking-widest uppercase text-xs">
              Choose your vibe
            </span>
            <VibeSelector selected={vibes} onChange={setVibes} />
          </div>

          {/* CTA Button */}
          <div className="w-full flex justify-center pt-4 pb-4">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="
                group relative flex items-center justify-center gap-3
                px-10 md:px-14 py-4 md:py-5
                bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500
                text-white font-bold text-base md:text-lg
                rounded-2xl
                transition-all duration-300
                shadow-[0_4px_24px_rgba(34,211,238,0.3)]
                hover:shadow-[0_8px_40px_rgba(34,211,238,0.45)]
                hover:scale-[1.03]
                active:scale-95
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                overflow-hidden
              "
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />

              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Generating {days}-day plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  <span>Generate Itinerary</span>
                </>
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="text-center rounded-2xl bg-red-500/10 p-4 text-red-400 border border-red-500/15 text-sm font-medium animate-fade-in-up mx-2 md:mx-8">
              {error}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════
            Results Dashboard — Itinerary FIRST
            ═══════════════════════════════════════════ */}
        {plan && (
          <div className="animate-fade-in-up pt-10 mt-8 border-t border-white/5 space-y-6">

            {/* Compact top bar: Weather + Export */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <WeatherWidget data={weather} cityName={plan.destination} loading={weatherLoading} />
              <ExportButton plan={plan} />
            </div>

            {/* ITINERARY — the main attraction, at the TOP */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pl-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Your {days}-Day {plan.destination} Itinerary
                </h2>
              </div>

              <ItineraryTimeline days={plan.itinerary} />
            </div>

            {/* Packing Checklist + Budget Breakdown — side by side */}
            <div className="pt-4">
              <SidebarInfo packingList={plan.packing_list} budget={plan.budget_estimate} budgetBreakdown={plan.budget_breakdown} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
