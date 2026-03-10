# 🌅 Horizon

---

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-%238E75B2.svg?style=for-the-badge&logo=google&logoColor=white)

🟢 [**View Live Deployment**](#)

A highly dynamic, single-page travel dashboard application designed for intelligent itinerary planning. This project parses user input to generate detailed multi-day travel plans, smart packing checklists, and comprehensive budget breakdowns. It was built to demonstrate proficiency in modern web development, emphasizing a premium glassmorphic UI, API integrations, and practical AI application through prompt engineering.

---

## 📸 Screenshots

<details open>
<summary><b>Landing Page</b></summary>
<br/>
<img src="screenshots/landing-page.png" alt="Horizon Landing Page" width="100%">
</details>

<details open>
<summary><b>Itinerary Dashboard</b></summary>
<br/>
<img src="screenshots/itinerary-view.png" alt="AI Generated Itinerary" width="100%">
</details>

<details open>
<summary><b>Budget & Packing List</b></summary>
<br/>
<img src="screenshots/budget-view.png" alt="Budget Breakdown and Packing List" width="100%">
</details>

---

## ✨ Features

- **Dynamic Itinerary Generation:** Get highly detailed 1-10 day travel plans complete with morning, afternoon, and evening activities, photo spots, and entry fees.
- **Smart Budget Breakdown:** Provides a detailed 6-8 category cost breakdown for your trip (Accommodation, Dining, Transport, etc.).
- **Interactive Packing List:** Weather-aware packing recommendations with an interactive checklist to mark items as you pack.
- **Live Weather Integration:** Fetches real-time weather data for your destination via the Open-Meteo API.
- **Premium Glassmorphic UI:** A stunning, modern interface with interactive elements, animated gradients, and seamless transitions.
- **Downloadable Plans:** Export your complete travel itinerary and budget to a downloadable text file for offline use.

---

## 🚀 Getting Started

### Prerequisites

You'll need a Google Gemini API key to power the travel intelligence engine. Get one at [Google AI Studio](https://aistudio.google.com/).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aryanranade/horizon-dashboard.git
   cd horizon
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎨 Design System

Horizon features a custom design system built with vanilla CSS variables and Tailwind utility classes:
- **`glass-card` & `glass-panel`**: Reusable semi-transparent surface components.
- **Micro-animations**: Hover states include soft scaling, glows (`glow-pulse`), and gradient shimmers to keep the interface feeling alive.
- **Color Palette**: Deep space background with cyan-to-indigo accent gradients.

---

## 🏗️ System Architecture

Horizon uses a modern, serverless architecture built on Next.js 15, separating the client-side presentation layer from the secure server-side AI processing.

```mermaid
graph TD
    %% Styling
    classDef client fill:#1E293B,stroke:#38BDF8,stroke-width:2px,color:#fff;
    classDef server fill:#0F172A,stroke:#8B5CF6,stroke-width:2px,color:#fff;
    classDef external fill:#020617,stroke:#10B981,stroke-width:2px,color:#fff;

    %% Nodes
    subgraph Client
        UI[Glassmorphic Dashboard]:::client
        State[React State & Hooks]:::client
    end

    subgraph Server
        Action[actions.ts]:::server
        Prompt[AI Prompt Engineering]:::server
    end

    subgraph External
        Meteo[Open-Meteo API]:::external
        Gemini[Google Gemini 2.5]:::external
    end

    %% Connections
    UI -- "User Input (City, Days, Vibes)" --> State
    State -- "Server Action Invocation" --> Action
    
    Action -- "1. Fetch Weather Data" --> Meteo
    Meteo -- "Weather Context" --> Action
    
    Action -- "2. Compile Prompt" --> Prompt
    Prompt -- "Generate Structured JSON" --> Gemini
    Gemini -- "Raw JSON Response" --> Action
    
    Action -- "3. Parse & Validate" --> UI
```

### Data Flow Overview

1. **Client Interaction:** The user inputs their desired destination, trip duration (1-10 days), and preferred travel vibes via the responsive Next.js frontend.
2. **Server Action:** The request is securely passed to a Next.js Server Action (`actions.ts`), ensuring API keys are never exposed to the client.
3. **Context Gathering:** The server queries the Open-Meteo API for real-time weather conditions at the destination to provide context.
4. **AI Generation:** A highly engineered prompt—incorporating the user's inputs and current weather—is sent to the Google Gemini 2.5 Flash model. The prompt enforces a strict JSON schema output.
5. **Rendering:** The server parses the returned JSON into strictly typed TypeScript interfaces (`TripPlan`) and sends the structured data back to the client for immediate rendering.
