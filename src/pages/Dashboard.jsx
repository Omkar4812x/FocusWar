import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useAuth, disableGuestMode } from '../utils/useAuth';
import { awardSessionXP } from '../services/xpService';
import { calculateLevel } from '../utils/xp';
import Spinner from '../components/Spinner';
import PomodoroTimer from '../components/PomodoroTimer';
import PlayerStatsCard from '../components/PlayerStatsCard';
import LevelUpModal from '../components/LevelUpModal';
import Leaderboard from '../components/Leaderboard';
import FocusQuests from '../components/FocusQuests';
import StudyAnalytics from '../components/StudyAnalytics';
import FocusTaskList from '../components/FocusTaskList';

const GUEST_DATA_KEY = 'focuswar_guest_userdata';

function getLocalGuestData() {
  try {
    const saved = localStorage.getItem(GUEST_DATA_KEY);
    return saved
      ? JSON.parse(saved)
      : { name: 'Focus Warrior', xp: 120, level: 2, streak: 3, sessionsCompleted: 4 };
  } catch {
    return { name: 'Focus Warrior', xp: 120, level: 2, streak: 3, sessionsCompleted: 4 };
  }
}

function saveLocalGuestData(data) {
  try {
    localStorage.setItem(GUEST_DATA_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to save guest data:', err);
  }
}

export default function Dashboard() {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('timer'); // 'timer' | 'quests' | 'leaderboard' | 'analytics'
  const [userData, setUserData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  // XP award state
  const [xpToast, setXpToast] = useState(null);
  const [levelUpData, setLevelUpData] = useState(null);
  const [awardingXP, setAwardingXP] = useState(false);
  const xpToastTimer = useRef(null);

  // ── Real-time Firestore listener or Guest Fallback ────────────────────────
  useEffect(() => {
    if (!user) return;

    if (isGuest) {
      setUserData(getLocalGuestData());
      setDataLoading(false);
      return;
    }

    const ref = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setUserData(snap.data());
        } else {
          setUserData(getLocalGuestData());
        }
        setDataLoading(false);
      },
      (err) => {
        console.warn('Firestore listener fallback to guest mode:', err);
        setUserData(getLocalGuestData());
        setDataLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, isGuest]);

  // ── Show XP toast ────────────────────────────────────────────────────────
  const showXPToast = useCallback((amount, message) => {
    setXpToast({ amount, message });
    clearTimeout(xpToastTimer.current);
    xpToastTimer.current = setTimeout(() => setXpToast(null), 3000);
  }, []);

  // ── Helper to update XP across Guest & Firebase ───────────────────────────
  const addXP = useCallback(
    async (amount, toastMessage) => {
      const oldXP = userData?.xp ?? 0;
      const oldLevel = userData?.level ?? 1;
      const newXP = oldXP + amount;
      const newLevel = calculateLevel(newXP);

      if (isGuest || !user?.uid) {
        const updated = {
          ...userData,
          xp: newXP,
          level: newLevel,
          sessionsCompleted: (userData?.sessionsCompleted ?? 0) + (amount === 50 ? 1 : 0),
        };
        setUserData(updated);
        saveLocalGuestData(updated);
        showXPToast(amount, toastMessage);
        if (newLevel > oldLevel) {
          setLevelUpData({ level: newLevel });
        }
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          xp: increment(amount),
          level: newLevel,
        });

        showXPToast(amount, toastMessage);
        if (newLevel > oldLevel) {
          setLevelUpData({ level: newLevel });
        }
      } catch (err) {
        console.warn('Firestore update fallback to local:', err);
        const updated = {
          ...userData,
          xp: newXP,
          level: newLevel,
        };
        setUserData(updated);
        saveLocalGuestData(updated);
        showXPToast(amount, toastMessage);
        if (newLevel > oldLevel) {
          setLevelUpData({ level: newLevel });
        }
      }
    },
    [user, isGuest, userData, showXPToast]
  );

  // ── Session completion XP ────────────────────────────────────────────────
  const handleSessionComplete = useCallback(async () => {
    if (!user || awardingXP) return;
    setAwardingXP(true);
    try {
      if (isGuest) {
        await addXP(50, 'Focus Session Complete!');
      } else {
        const result = await awardSessionXP(user.uid);
        showXPToast(50, 'Focus Session Complete!');
        if (result.didLevelUp) {
          setLevelUpData({ level: result.newLevel });
        }
      }
    } catch (err) {
      console.warn('Failed to award XP, fallback to local:', err);
      await addXP(50, 'Focus Session Complete!');
    } finally {
      setAwardingXP(false);
    }
  }, [user, isGuest, awardingXP, showXPToast, addXP]);

  // ── Claim Quest Bonus XP ──────────────────────────────────────────────────
  const handleClaimQuestXP = useCallback(
    async (amount) => {
      await addXP(amount, 'Quest Milestone Claimed!');
    },
    [addXP]
  );

  // ── Claim Task Completion XP ──────────────────────────────────────────────
  const handleCompleteTask = useCallback(
    async (amount, title) => {
      await addXP(amount, `Task Done: "${title}"`);
    },
    [addXP]
  );

  // ── Sign out ─────────────────────────────────────────────────────────────
  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      if (isGuest) {
        disableGuestMode();
      } else {
        await signOut(auth);
      }
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Sign out error:', err);
      disableGuestMode();
      navigate('/login', { replace: true });
    } finally {
      setSigningOut(false);
    }
  };

  const displayName = userData?.name || user?.displayName || user?.email?.split('@')[0] || 'Warrior';
  const initials = displayName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <div className="bg-mesh" />

      {/* Level Up Modal */}
      {levelUpData && (
        <LevelUpModal
          level={levelUpData.level}
          onClose={() => setLevelUpData(null)}
        />
      )}

      {/* XP Toast */}
      {xpToast && (
        <div className="xp-toast" role="status" aria-live="polite">
          ✨ +{xpToast.amount} XP earned! {xpToast.message && `(${xpToast.message})`}
        </div>
      )}

      <div className="dashboard-layout animate-fade">
        {/* ── Header ── */}
        <header className="dashboard-header">
          <div className="dashboard-logo">
            ⚡ FocusWar {isGuest && <span className="badge badge-purple" style={{ fontSize: '0.7rem', marginLeft: 8 }}>DEMO</span>}
          </div>

          {/* Navigation Tabs */}
          <nav className="dashboard-nav">
            <button
              className={`nav-tab-btn ${activeTab === 'timer' ? 'active' : ''}`}
              onClick={() => setActiveTab('timer')}
            >
              ⏱️ Focus
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'quests' ? 'active' : ''}`}
              onClick={() => setActiveTab('quests')}
            >
              🎯 Quests
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('leaderboard')}
            >
              🏅 Leaderboard
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              📊 Analytics
            </button>
          </nav>

          <div className="dashboard-user">
            <div className="user-avatar" title={displayName}>{initials}</div>
            <button
              className="btn btn-ghost"
              onClick={handleSignOut}
              disabled={signingOut}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              {signingOut ? <Spinner /> : isGuest ? 'Exit Demo' : 'Sign Out'}
            </button>
          </div>
        </header>

        {/* ── Main Content ── */}
        <main className="dashboard-content">
          {activeTab === 'timer' && (
            <>
              {/* Welcome */}
              <section className="welcome-section">
                <h2 className="welcome-title">
                  Welcome back, {dataLoading ? '…' : displayName} 👋
                </h2>
                <p className="welcome-subtitle">
                  You&apos;re on the path to mastery. Select a mode and start focusing.
                </p>
              </section>

              {/* Player Stats Card */}
              <section>
                <h3 className="section-title"><span>🎮</span> Player Profile</h3>
                <PlayerStatsCard userData={userData} loading={dataLoading} />
              </section>

              {/* Pomodoro Timer */}
              <section className="timer-section">
                <h3 className="section-title">
                  <span>⏱️</span> Focus Timer
                  {awardingXP && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      &nbsp;· Saving XP…
                    </span>
                  )}
                </h3>
                <div className="glass-card" style={{ overflow: 'hidden' }}>
                  <PomodoroTimer onSessionComplete={handleSessionComplete} />
                </div>
              </section>

              {/* Focus Task Checklist */}
              <section className="task-section">
                <FocusTaskList onCompleteTask={handleCompleteTask} />
              </section>

              {/* Quick Stats Grid */}
              <section>
                <h3 className="section-title"><span>📈</span> Your Overview</h3>
                <div className="stats-grid">
                  <div className="glass-card stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-label">Total XP</div>
                    {dataLoading ? (
                      <div className="spinner" style={{ marginTop: 4 }} />
                    ) : (
                      <div className="stat-value">
                        {userData?.xp ?? 0} <span style={{ fontSize: '1rem', fontWeight: 600 }}>XP</span>
                      </div>
                    )}
                    <div className="stat-sub">Experience points earned</div>
                  </div>

                  <div className="glass-card stat-card">
                    <div className="stat-icon blue">⚡</div>
                    <div className="stat-label">Level</div>
                    {dataLoading ? (
                      <div className="spinner" style={{ marginTop: 4 }} />
                    ) : (
                      <div className="stat-value">{userData?.level ?? 1}</div>
                    )}
                    <div className="stat-sub">Current rank level</div>
                  </div>

                  <div className="glass-card stat-card">
                    <div className="stat-icon pink">🔥</div>
                    <div className="stat-label">Streak</div>
                    {dataLoading ? (
                      <div className="spinner" style={{ marginTop: 4 }} />
                    ) : (
                      <div className="stat-value">
                        {userData?.streak ?? 0} <span style={{ fontSize: '1rem', fontWeight: 600 }}>days</span>
                      </div>
                    )}
                    <div className="stat-sub">Consecutive study days</div>
                  </div>

                  <div className="glass-card stat-card" onClick={() => setActiveTab('leaderboard')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon green">🌍</div>
                    <div className="stat-label">Global Arena</div>
                    <div className="stat-value">View</div>
                    <div className="stat-sub">Click to open rankings</div>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === 'quests' && (
            <FocusQuests userData={userData} onClaimXP={handleClaimQuestXP} />
          )}

          {activeTab === 'leaderboard' && (
            <Leaderboard currentUserData={userData} />
          )}

          {activeTab === 'analytics' && (
            <StudyAnalytics userData={userData} />
          )}
        </main>
      </div>
    </>
  );
}

