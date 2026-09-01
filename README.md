# ⚡ FocusWar

> **Turn your study sessions into a battle for mastery.**  
> FocusWar is a high-performance, gamified Pomodoro productivity application built with React, Vite, Firebase, and the Web Audio API. Earn XP, complete daily focus quests, complete task action items, climb global warrior rank leaderboards, and track your study analytics in real time.

---

## ✨ Features

- ⚡ **Instant Live Demo / Guest Mode**
  - Instant one-click access without needing active backend or Firebase setup.
  - Full local progress persistence (XP, Level, Streaks, Quests, and Tasks) saved seamlessly in `localStorage`.

- ⏱️ **Multi-Mode Pomodoro Focus Engine**
  - **25m Focus Work**, **5m Short Break**, **15m Long Break**, and **1m Quick Demo Mode** for fast testing.
  - Interactive Goal Tracker to declare what topic you're focusing on.

- ⚔️ **Gamified Focus Task Checklist**
  - Define custom study tasks and action items with difficulty ratings (**Easy +15 XP**, **Medium +30 XP**, **Hard +50 XP**).
  - Checking off items grants instant XP, level ascension triggers, and visual toast notifications.

- 🎵 **Web Audio Soundscapes & Master Volume Synthesizer**
  - Zero-latency Web Audio API sound generator for end-of-session completion chimes.
  - 7 Ambient soundscapes: **Rain 🌧️**, **White Noise 📻**, **Binaural Beats 🧘**, **Forest Wind 🌲**, **Cozy Cafe ☕**, and **Deep Synth 🌌**.
  - Integrated master volume control slider and mute toggle.

- 🏅 **Global Arena & Leaderboards**
  - Real-time global rankings showcasing top Warriors with levels, total XP, streaks, and rank badges.
  - Filterable by **Global Top**, **Weekly Sprint**, and **Squad**.
  - Highlights your current rank dynamically.

- 🎯 **Daily Focus Quests**
  - Interactive objective tasks (*First Blood*, *Deep Work Mastery*, *Streak Warrior*, *Level Ascension*).
  - Claimable bonus XP rewards with celebratory toast notifications saved directly to Firestore / Guest storage.

- 📊 **Study & Productivity Analytics**
  - Dynamic **SVG Bar Chart** rendering your study duration breakdown across the week (Mon–Sun).
  - Key metric cards for total focus minutes, completed Pomodoro sessions, daily average, and cognitive stamina score.

- ⚡ **Warrior Rank Titles & Badges**
  - Dynamic rank titles based on player level (*Novice Scholar*, *Focus Initiate*, *Cyber Warrior*, *Time Master*, *Grandmaster Titan*).
  - Achievement badge collection showing unlocked and locked trophies.

- 🔒 **Firebase Authentication & Firestore Sync**
  - Secure authentication (Email/Password) with real-time Firestore database sync for instant level and XP progression.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router v7, Vite 8
- **Backend & Auth**: Firebase Auth, Cloud Firestore, LocalStorage Guest Adapter
- **Audio Synthesizer**: Web Audio API (Pink noise rain filter, white noise, forest wind modulation, binaural beats, sine wave chime arpeggio)
- **Styling**: Modern Vanilla CSS with dark mode, HSL color tokens, glassmorphism, dynamic glow accents, and responsive layout

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your system.

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Omkar4812x/FocusWar.git
   cd FocusWar
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` and click **"⚡ Explore Live Demo Mode"** for instant access!

4. **Build for Production**:
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
│   │   ├── FocusTaskList.jsx    # Action items checklist with difficulty XP rewards
│   │   ├── Leaderboard.jsx       # Global & squad rankings table
│   │   ├── LevelUpModal.jsx      # Celebratory level-up modal overlay
│   │   ├── PlayerStatsCard.jsx   # Player profile, XP progress & rank badges
│   │   ├── PomodoroTimer.jsx     # Timer arc, ambient soundscapes & volume slider
│   │   ├── ProtectedRoute.jsx    # Auth route guard wrapper (Firebase + Guest mode)
│   │   ├── Spinner.jsx           # Loading spinner component
│   │   └── StudyAnalytics.jsx    # Weekly SVG bar chart & metric cards
│   ├── pages/
│   │   ├── Dashboard.jsx         # Main dashboard layout with tab navigation & guest state
│   │   ├── Login.jsx             # Authentication login screen with Demo button
│   │   └── Signup.jsx            # Account creation screen
│   ├── services/
│   │   ├── firebase.js           # Firebase app initialization & Firestore export
│   │   └── xpService.js          # Atomic XP calculation & Firestore updater
│   ├── styles/
│   │   └── global.css            # Complete design system & glassmorphism styles
│   ├── utils/
│   │   ├── soundscape.js         # Web Audio API ambient sound generator & chime synth
│   │   ├── useAuth.js            # React auth context hook supporting guest mode
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

