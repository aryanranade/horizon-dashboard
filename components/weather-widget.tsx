import { CloudRain, Sun, Cloud, Snowflake, CloudLightning, Wind } from "lucide-react";
import { WeatherData } from "@/app/lib/types";

interface WeatherWidgetProps {
    data: WeatherData | null;
    cityName?: string;
    loading: boolean;
}

export function WeatherWidget({ data, cityName, loading }: WeatherWidgetProps) {
    if (loading) {
        return (
            <div className="rounded-xl glass-card animate-pulse h-[56px]" />
        );
    }

    if (!data) return null;

    const getIcon = (condition: string) => {
        const lower = condition.toLowerCase();
        if (lower.includes("rain") || lower.includes("drizzle")) return <CloudRain className="h-5 w-5 text-blue-400" />;
        if (lower.includes("sun") || lower.includes("clear")) return <Sun className="h-5 w-5 text-amber-400" />;
        if (lower.includes("cloud") || lower.includes("overcast")) return <Cloud className="h-5 w-5 text-slate-400" />;
        if (lower.includes("snow")) return <Snowflake className="h-5 w-5 text-sky-300" />;
        if (lower.includes("thunder")) return <CloudLightning className="h-5 w-5 text-purple-400" />;
        return <Wind className="h-5 w-5 text-teal-400" />;
    };

    return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl glass-card">
            {getIcon(data.condition)}
            <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm text-slate-400 truncate">{cityName || "Destination"}</span>
                <span className="text-slate-600">·</span>
                <span className="text-sm font-bold text-white">{Math.round(data.temperature)}°C</span>
                <span className="text-slate-600">·</span>
                <span className="text-sm text-slate-400">{data.condition}</span>
            </div>
        </div>
    );
}
