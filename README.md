# ⚡ FocusWar

> **Turn your study sessions into a battle for mastery.**  
> FocusWar is a high-performance, gamified Pomodoro productivity application built with React, Vite, Firebase, and the Web Audio API. Earn XP, complete daily focus quests, climb global warrior rank leaderboards, and track your study analytics in real time.

---

## ✨ Features

- ⏱️ **Multi-Mode Pomodoro Focus Engine**
  - **25m Focus Work**, **5m Short Break**, **15m Long Break**, and **1m Quick Demo Mode** for fast testing.
  - Interactive Goal Tracker to declare what topic you're focusing on.

- 🎵 **Web Audio Soundscapes & Chimes**
  - Zero-latency Web Audio API sound generator for end-of-session completion chimes.
  - Integrated ambient soundscapes (**Rain**, **White Noise**, **Binaural Beats**) with soft volume controls.

- 🏅 **Global Arena & Leaderboards**
  - Real-time global rankings showcasing top Warriors with levels, total XP, streaks, and rank badges.
  - Filterable by **Global Top**, **Weekly Sprint**, and **Squad**.
  - Highlights your current rank dynamically.

- 🎯 **Daily Focus Quests**
  - Interactive objective tasks (*First Blood*, *Deep Work Mastery*, *Streak Warrior*, *Level Ascension*).
  - Claimable bonus XP rewards with celebratory toast notifications saved directly to Firestore.

- 📊 **Study & Productivity Analytics**
  - Dynamic **SVG Bar Chart** rendering your study duration breakdown across the week (Mon–Sun).
  - Key metric cards for total focus minutes, completed Pomodoro sessions, daily average, and cognitive stamina score.

- ⚡ **Warrior Rank Titles & Badges**
  - Dynamic rank titles based on player level (*Novice Scholar*, *Focus Initiate*, *Cyber Warrior*, *Time Master*, *Grandmaster Titan*).
  - Achievement badge collection showing unlocked and locked trophies.

- 🔒 **Firebase Authentication & Firestore**
  - Secure authentication (Email/Password) with real-time Firestore database sync for instant level and XP progression.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router v7, Vite
- **Backend & Auth**: Firebase Auth, Cloud Firestore
- **Audio Synthesizer**: Web Audio API (Pink noise rain filter, white noise generator, sine wave chime arpeggio)
- **Styling**: Modern Vanilla CSS with dark mode, HSL color tokens, glassmorphism, dynamic glow accents, and responsive layout

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your system.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Omkar4812x/FocusWar.git
   cd FocusWar
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   Update `src/services/firebase.js` with your Firebase web configuration keys:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

4. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```text
FocusWar/
├── src/
│   ├── components/
│   │   ├── FocusQuests.jsx       # Daily objective quests & bonus XP claim
│   │   ├── Leaderboard.jsx       # Global & squad rankings table
│   │   ├── LevelUpModal.jsx      # Celebratory level-up modal overlay
│   │   ├── PlayerStatsCard.jsx   # Player profile, XP progress & rank badges
│   │   ├── PomodoroTimer.jsx     # Timer arc, session modes & goal input
│   │   ├── ProtectedRoute.jsx    # Auth route guard wrapper
│   │   ├── Spinner.jsx           # Loading spinner component
│   │   └── StudyAnalytics.jsx    # Weekly SVG bar chart & metric cards
│   ├── pages/
│   │   ├── Dashboard.jsx         # Main dashboard layout with tab navigation
│   │   ├── Login.jsx             # Authentication login screen
│   │   └── Signup.jsx            # Account creation screen
│   ├── services/
│   │   ├── firebase.js           # Firebase app initialization & Firestore export
│   │   └── xpService.js          # Atomic XP calculation & Firestore updater
│   ├── styles/
│   │   └── global.css            # Complete design system & glassmorphism styles
│   ├── utils/
│   │   ├── soundscape.js         # Web Audio API ambient sound generator & chime
│   │   ├── useAuth.js            # React auth context hook
│   │   └── xp.js                 # Level formulas & XP calculation logic
│   ├── App.jsx                   # React Router routing setup
│   └── main.jsx                  # App entry point
├── package.json
├── vite.config.js
└── README.md
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
