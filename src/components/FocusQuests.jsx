import { useState, useEffect } from 'react';

const INITIAL_QUESTS = [
  {
    id: 'first_session',
    icon: '🎯',
    title: 'First Blood',
    desc: 'Complete your first Pomodoro focus session today.',
    reward: 50,
    target: 1,
    currentKey: 'sessionsToday',
  },
  {
    id: 'deep_focus',
    icon: '⏱️',
    title: 'Deep Work Mastery',
    desc: 'Log at least 50 minutes of focused study time.',
    reward: 100,
    target: 50,
    currentKey: 'minsToday',
  },
  {
    id: 'streak_warrior',
    icon: '🔥',
    title: 'Streak Warrior',
    desc: 'Maintain a study streak of at least 3 days.',
    reward: 150,
    target: 3,
    currentKey: 'streak',
  },
  {
    id: 'level_ascension',
    icon: '⚡',
    title: 'Level Ascension',
    desc: 'Reach Rank Level 2 or higher.',
    reward: 200,
    target: 2,
    currentKey: 'level',
  },
];

export default function FocusQuests({ userData, onClaimXP }) {
  const [claimed, setClaimed] = useState(() => {
    try {
      const saved = localStorage.getItem('focuswar_claimed_quests');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('focuswar_claimed_quests', JSON.stringify(claimed));
    } catch {
      // ignore storage errors
    }
  }, [claimed]);

  const userLevel = userData?.level ?? 1;
  const userStreak = userData?.streak ?? 0;
  // Estimate sessions & mins from total XP if not explicitly present
  const userXP = userData?.xp ?? 0;
  const sessionsToday = Math.max(1, Math.floor(userXP / 50));
  const minsToday = sessionsToday * 25;

  const getQuestProgress = (quest) => {
    let curr = 0;
    if (quest.currentKey === 'level') curr = userLevel;
    else if (quest.currentKey === 'streak') curr = userStreak;
    else if (quest.currentKey === 'sessionsToday') curr = sessionsToday;
    else if (quest.currentKey === 'minsToday') curr = minsToday;

    const percent = Math.min(100, Math.round((curr / quest.target) * 100));
    const isCompleted = curr >= quest.target;

    return { curr, percent, isCompleted };
  };

  const handleClaim = (questId, reward) => {
    if (claimed[questId]) return;
    setClaimed((prev) => ({ ...prev, [questId]: true }));
    onClaimXP?.(reward);
  };

  return (
    <div className="quests-container animate-fade">
      {/* Banner */}
      <div className="glass-card quests-banner">
        <div className="quests-banner-content">
          <span className="badge badge-blue">🎯 Daily Quests</span>
          <h2 className="quests-title">Focus Objectives & Rewards</h2>
          <p className="quests-subtitle">
            Complete daily study milestones to earn extra XP and accelerate your level progression.
          </p>
        </div>
      </div>

      {/* Quests List */}
      <div className="quests-grid">
        {INITIAL_QUESTS.map((quest) => {
          const { curr, percent, isCompleted } = getQuestProgress(quest);
          const isClaimed = !!claimed[quest.id];

          return (
            <div
              key={quest.id}
              className={`glass-card quest-card ${isClaimed ? 'quest-claimed' : ''}`}
            >
              <div className="quest-header">
                <div className="quest-icon">{quest.icon}</div>
                <div className="quest-info">
                  <h4 className="quest-card-title">{quest.title}</h4>
                  <p className="quest-card-desc">{quest.desc}</p>
                </div>
                <div className="quest-reward-tag">
                  +{quest.reward} XP
                </div>
              </div>

              {/* Progress bar */}
              <div className="quest-progress-section">
                <div className="quest-progress-meta">
                  <span>Progress</span>
                  <span>{curr} / {quest.target}</span>
                </div>
                <div className="quest-progress-track">
                  <div
                    className="quest-progress-fill"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="quest-action">
                {isClaimed ? (
                  <button className="btn btn-ghost quest-btn claimed" disabled>
                    ✓ Claimed
                  </button>
                ) : isCompleted ? (
                  <button
                    className="btn btn-primary quest-btn claim-active"
                    onClick={() => handleClaim(quest.id, quest.reward)}
                  >
                    ✨ Claim +{quest.reward} XP
                  </button>
                ) : (
                  <button className="btn btn-ghost quest-btn" disabled>
                    In Progress ({percent}%)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
