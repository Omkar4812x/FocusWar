import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useAuth } from '../utils/useAuth';
import { awardSessionXP } from '../services/xpService';
import { calculateLevel } from '../utils/xp';
import Spinner from '../components/Spinner';
import PomodoroTimer from '../components/PomodoroTimer';
import PlayerStatsCard from '../components/PlayerStatsCard';
import LevelUpModal from '../components/LevelUpModal';
import Leaderboard from '../components/Leaderboard';
import FocusQuests from '../components/FocusQuests';
import StudyAnalytics from '../components/StudyAnalytics';

export default function Dashboard() {
  const { user } = useAuth();
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

  // ── Real-time Firestore listener ─────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const ref = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) setUserData(snap.data());
        setDataLoading(false);
      },
      (err) => {
        console.error('Firestore listener error:', err);
        setDataLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // ── Show XP toast ────────────────────────────────────────────────────────
  const showXPToast = useCallback((amount) => {
    setXpToast({ amount });
    clearTimeout(xpToastTimer.current);
    xpToastTimer.current = setTimeout(() => setXpToast(null), 3000);
  }, []);

  // ── Session completion XP ────────────────────────────────────────────────
  const handleSessionComplete = useCallback(async () => {
    if (!user || awardingXP) return;

    setAwardingXP(true);
    try {
      const result = await awardSessionXP(user.uid);
      showXPToast(50);

      if (result.didLevelUp) {
        setLevelUpData({ level: result.newLevel });
      }
    } catch (err) {
      console.error('Failed to award XP:', err);
    } finally {
      setAwardingXP(false);
    }
  }, [user, awardingXP, showXPToast]);

  // ── Claim Quest Bonus XP ──────────────────────────────────────────────────
  const handleClaimQuestXP = useCallback(async (amount) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      const newXP = (userData?.xp ?? 0) + amount;
      const newLevel = calculateLevel(newXP);
      const oldLevel = userData?.level ?? 1;

      await updateDoc(userRef, {
        xp: increment(amount),
        level: newLevel,
      });

      showXPToast(amount);
      if (newLevel > oldLevel) {
        setLevelUpData({ level: newLevel });
      }
    } catch (err) {
      console.error('Failed to claim quest XP:', err);
    }
  }, [user, userData, showXPToast]);

  // ── Sign out ─────────────────────────────────────────────────────────────
  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Sign out error:', err);
      setSigningOut(false);
    }
  };

  const displayName = userData?.name || user?.email?.split('@')[0] || 'Warrior';
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
          ✨ +{xpToast.amount} XP earned!
        </div>
      )}

      <div className="dashboard-layout animate-fade">
        {/* ── Header ── */}
        <header className="dashboard-header">
          <div className="dashboard-logo">⚡ FocusWar</div>

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
              {signingOut ? <Spinner /> : 'Sign Out'}
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
