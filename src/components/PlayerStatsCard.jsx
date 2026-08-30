import { calculateLevel, calculateProgress, levelXP, XP_PER_LEVEL } from '../utils/xp';

function getWarriorTitle(level) {
  if (level >= 10) return '⚡ Grandmaster Titan';
  if (level >= 7)  return '⚔️ Time Master';
  if (level >= 5)  return '🔮 Mind Sorcerer';
  if (level >= 3)  return '🛡️ Cyber Warrior';
  if (level >= 2)  return '🎯 Focus Initiate';
  return '🌱 Novice Scholar';
}

const BADGES = [
  { id: 'b1', name: 'First Focus', icon: '🎯', desc: 'Completed 1st session', reqLevel: 1 },
  { id: 'b2', name: 'Streak Initiate', icon: '🔥', desc: 'Active 3+ day streak', reqLevel: 2 },
  { id: 'b3', name: 'Cyber Scholar', icon: '💻', desc: 'Reached Level 3', reqLevel: 3 },
  { id: 'b4', name: 'Time Master', icon: '⌛', desc: 'Reached Level 5', reqLevel: 5 },
];

export default function PlayerStatsCard({ userData, loading }) {
  const xp = userData?.xp ?? 0;
  const level = calculateLevel(xp);
  const progress = calculateProgress(xp);
  const currentLevelXP = levelXP(xp);
  const progressPercent = Math.round(progress * 100);
  const warriorTitle = getWarriorTitle(level);

  return (
    <div className="player-stats-card glass-card">
      {/* Top row: avatar + name + level badge + warrior title */}
      <div className="psc-header">
        <div className="psc-avatar">
          {userData?.name?.[0]?.toUpperCase() ?? '⚡'}
        </div>
        <div className="psc-identity">
          <div className="psc-name-row">
            <span className="psc-name">{userData?.name ?? 'Warrior'}</span>
            <span className="warrior-title-tag">{warriorTitle}</span>
          </div>
          <div className="psc-level-badge">Level {level}</div>
        </div>
        <div className="psc-xp-total">
          <span className="psc-xp-value">{loading ? '…' : xp}</span>
          <span className="psc-xp-label">Total XP</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="psc-progress-section">
        <div className="psc-progress-meta">
          <span className="psc-progress-text">
            Progress to Level {level + 1}
          </span>
          <span className="psc-progress-numbers">
            {loading ? '…' : `${currentLevelXP} / ${XP_PER_LEVEL} XP`}
          </span>
        </div>

        <div
          className="psc-progress-track"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="psc-progress-fill"
            style={{ width: loading ? '0%' : `${progressPercent}%` }}
          />
          {!loading && progressPercent > 0 && (
            <div
              className="psc-progress-glow"
              style={{ left: `${progressPercent}%` }}
            />
          )}
        </div>

        <div className="psc-progress-percent">
          {loading ? '' : `${progressPercent}% complete`}
        </div>
      </div>

      {/* Achievement Badges Row */}
      <div className="psc-badges-section">
        <span className="badges-title">🎖️ Warrior Badges</span>
        <div className="badges-grid">
          {BADGES.map((b) => {
            const isUnlocked = level >= b.reqLevel;
            return (
              <div
                key={b.id}
                className={`badge-item ${isUnlocked ? 'unlocked' : 'locked'}`}
                title={isUnlocked ? `${b.name}: ${b.desc}` : `Requires Level ${b.reqLevel}`}
              >
                <span className="badge-item-icon">{b.icon}</span>
                <span className="badge-item-name">{b.name}</span>
                {!isUnlocked && <span className="badge-item-lock">🔒 Lvl {b.reqLevel}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
