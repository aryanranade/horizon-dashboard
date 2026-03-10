export interface WeatherData {
  temperature: number;
  condition: string; // "Sunny", "Rainy", etc.
  description: string;
  isDay: boolean;
}

export interface Activity {
  time: "Morning" | "Afternoon" | "Evening";
  activity: string;
  description: string; // kept for backwards compat
  details: string[]; // bullet-point details
  travel_tip?: string; // how to get there from previous location
}

export interface DayItinerary {
  day: number;
  activities: Activity[];
}

export interface PackingItem {
  item: string;
  reason: string;
}

export interface BudgetItem {
  category: string;
  amount: string;
  note?: string;
}

export interface TripPlan {
  destination: string;
  itinerary: DayItinerary[];
  packing_list: PackingItem[];
  budget_estimate: string;
  budget_breakdown?: BudgetItem[];
}

export type TravelVibe = "Foodie 🍜" | "Nature 🌲" | "History 🏛️" | "Budget 🎒" | "Luxury 💎" | "Relaxation 🧘" | "Nightlife 🎉";

export interface GenerateItineraryInput {
  city: string;
  vibes: TravelVibe[];
  days: number;
}
