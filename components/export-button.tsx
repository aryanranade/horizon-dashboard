"use client";

import { TripPlan } from "@/app/lib/types";
import { Calendar, Download } from "lucide-react";

export function ExportButton({ plan }: { plan: TripPlan }) {
    const handleExport = () => {
        let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Horizon Travel//EN\n";

        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 1);

        plan.itinerary.forEach((day) => {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + (day.day - 1));
            const dateStr = currentDate.toISOString().split("T")[0].replace(/-/g, "");

            day.activities.forEach((act) => {
                let hour = 9;
                if (act.time === "Afternoon") hour = 14;
                if (act.time === "Evening") hour = 19;

                const start = `${dateStr}T${hour.toString().padStart(2, "0")}0000`;
                const end = `${dateStr}T${(hour + 2).toString().padStart(2, "0")}0000`;

                icsContent += `BEGIN:VEVENT\n`;
                icsContent += `SUMMARY:Horizon: ${act.activity}\n`;
                icsContent += `DESCRIPTION:${act.description}\n`;
                icsContent += `DTSTART:${start}\n`;
                icsContent += `DTEND:${end}\n`;
                icsContent += `LOCATION:${plan.destination}\n`;
                icsContent += `END:VEVENT\n`;
            });
        });

        icsContent += "END:VCALENDAR";

        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", `horizon_${plan.destination.toLowerCase().replace(/\s/g, "_")}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button
            onClick={handleExport}
            className="
                group relative flex items-center justify-center gap-3
                rounded-2xl px-8 py-4 font-semibold text-sm
                bg-gradient-to-r from-cyan-500/15 to-blue-500/15
                border border-cyan-400/25
                text-cyan-300 hover:text-white
                hover:border-cyan-400/50 hover:shadow-[0_0_24px_rgba(34,211,238,0.2)]
                active:scale-95
                transition-all duration-300
            "
        >
            <Calendar className="h-4.5 w-4.5 group-hover:rotate-6 transition-transform duration-300" />
            <span>Export to Calendar</span>
            <Download className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>
    );
}
