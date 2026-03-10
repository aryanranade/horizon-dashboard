"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { WeatherData, TripPlan, GenerateItineraryInput } from "./lib/types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log("Server Action Loaded.");
console.log("API Key Status:", GEMINI_API_KEY ? "Present" : "Missing");
console.log("API Key First 4 Chars:", GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 4) : "N/A");

// Open-Meteo Logic
async function getCoordinates(city: string) {
    const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            city
        )}&count=1&language=en&format=json`
    );
    const data = await res.json();
    if (!data.results || data.results.length === 0) {
        throw new Error(`City "${city}" not found.`);
    }
    return {
        lat: data.results[0].latitude,
        lon: data.results[0].longitude,
        name: data.results[0].name,
        country: data.results[0].country,
    };
}

export async function getWeather(city: string): Promise<WeatherData & { cityName: string }> {
    console.log(`Fetching weather for: ${city}`);
    try {
        const coords = await getCoordinates(city);

        const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,is_day,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
        );

        if (!res.ok) throw new Error("Weather API failed");

        const data = await res.json();
        const current = data.current;

        const getWeatherDescription = (code: number, isDay: number) => {
            const codes: Record<number, string> = {
                0: "Clear sky",
                1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
                45: "Fog", 48: "Depositing rime fog",
                51: "Drizzle: Light", 53: "Drizzle: Moderate", 55: "Drizzle: Dense intensity",
                61: "Rain: Slight", 63: "Rain: Moderate", 65: "Rain: Heavy intensity",
                71: "Snow fall: Slight", 73: "Snow fall: Moderate", 75: "Snow fall: Heavy intensity",
                95: "Thunderstorm: Slight or moderate",
                99: "Thunderstorm with slight and heavy hail"
            };
            return codes[code] || "Unknown";
        };

        const description = getWeatherDescription(current.weather_code, current.is_day);

        return {
            cityName: `${coords.name}, ${coords.country}`,
            temperature: current.temperature_2m,
            condition: description,
            description: description,
            isDay: current.is_day === 1
        };
    } catch (error) {
        console.error("Error fetching weather FULL DETAILS:", error);
        throw new Error("Satellite Offline: Could not fetch weather data.");
    }
}

// Gemini Logic
export async function generateItinerary({ city, vibes, days }: GenerateItineraryInput): Promise<TripPlan> {
    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    try {
        // 1. Get real weather data
        const weather = await getWeather(city);

        // 2. Construct Prompt with rich detail requirements
        const prompt = `
      Act as an expert local travel guide who has lived in ${weather.cityName} for 20 years.
      Plan a detailed ${days}-day trip to ${weather.cityName}.
      
      Context:
      - Current Weather: ${weather.temperature}°C, ${weather.description}.
      - Travel Vibes: ${vibes.join(", ")}.
      - Number of Days: ${days}
      
      Requirements:
      1. Create a detailed ${days}-day itinerary with 3 time slots per day (Morning, Afternoon, Evening).
      2. For EACH activity, provide:
         - A clear activity title (the place or experience name)
         - A short one-line description summarizing what this activity is about
         - A "details" array with 3-5 SPECIFIC bullet points including:
           * What exactly to do/see at this location
           * Recommended duration to spend there
           * A local insider tip or must-try item
           * Entry fees or costs if applicable
           * Best photo spots or highlights
         - A "travel_tip" string explaining how to get from the previous activity to this one (e.g., "Take the subway Line 3 from Shinjuku Station, 15 min ride" or "Walk 10 minutes south along the river promenade"). For the FIRST activity of each day, suggest how to get there from a typical hotel in the city center.
       3. Suggest a Smart Packing List (5-7 items) specifically for ${weather.description} weather and the chosen vibes.
      4. Estimate a daily budget for a solo traveler based on standard costs in that city. Also provide a DETAILED breakdown of costs by category. Include 6-8 categories such as: Accommodation, Food & Dining, Local Transport, Activities & Entry Fees, Shopping, Nightlife, Miscellaneous. For each category, provide the estimated daily cost and a brief note explaining what that covers.
      
      Return ONLY valid JSON in this EXACT structure:
      {
        "destination": "${weather.cityName}",
        "itinerary": [
          {
            "day": 1,
            "activities": [
              {
                "time": "Morning",
                "activity": "Place or Experience Name",
                "description": "One-line summary of this activity",
                "details": [
                  "Specific thing to do or see here",
                  "Recommended duration: about X hours",
                  "Local tip: try the specialty dish / visit the hidden garden",
                  "Entry fee: $X or Free",
                  "Best photo spot: the viewpoint near the entrance"
                ],
                "travel_tip": "How to get here from previous location or hotel"
              }
            ]
          }
        ],
        "packing_list": [{ "item": "Name", "reason": "Why" }],
        "budget_estimate": "$XXX/day",
        "budget_breakdown": [
          { "category": "Accommodation", "amount": "$XX", "note": "Mid-range hotel or guesthouse" },
          { "category": "Food & Dining", "amount": "$XX", "note": "3 meals including one restaurant dinner" },
          { "category": "Local Transport", "amount": "$XX", "note": "Metro/bus day pass or taxi rides" },
          { "category": "Activities & Entry Fees", "amount": "$XX", "note": "Museum entries and tours" },
          { "category": "Shopping", "amount": "$XX", "note": "Souvenirs and local goods" },
          { "category": "Nightlife", "amount": "$XX", "note": "Drinks and entertainment if applicable" },
          { "category": "Miscellaneous", "amount": "$XX", "note": "Tips, snacks, SIM card etc." }
        ]
      }

      IMPORTANT: 
      - Each activity MUST have a "details" array with 3-5 bullet points as strings.
      - Each activity MUST have a "travel_tip" string.
      - The "budget_breakdown" MUST have 6-8 categories with realistic amounts that roughly add up to the "budget_estimate".
      - Make the details highly specific and actionable, not generic.
      - Include real place names, real transit lines, real costs where possible.
    `;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const response = result.response;
        const text = response.text();

        return JSON.parse(text) as TripPlan;

    } catch (error) {
        console.error("Gemini Error:", error);
        throw new Error("AI Engine malfunction. Please try again.");
    }
}
