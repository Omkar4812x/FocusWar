import { calculateLevel, calculateProgress, levelXP, XP_PER_LEVEL } from '../utils/xp';

/**
 * PlayerStatsCard
 * Shows user XP, level, and an animated progress bar toward next level.
 *
 * Props:
 *   userData: Firestore user object { name, xp, level, streak, ... }
 *   loading: boolean
 */
export default function PlayerStatsCard({ userData, loading }) {
  const xp = userData?.xp ?? 0;
  const level = calculateLevel(xp);
  const progress = calculateProgress(xp);      // 0–1
  const currentLevelXP = levelXP(xp);          // XP within this level
  const progressPercent = Math.round(progress * 100);

  return (
    <div className="player-stats-card glass-card">
      {/* ── Top row: avatar + name + level badge ── */}
      <div className="psc-header">
        <div className="psc-avatar">
          {userData?.name?.[0]?.toUpperCase() ?? '⚡'}
        </div>
        <div className="psc-identity">
          <div className="psc-name">{userData?.name ?? 'Warrior'}</div>
          <div className="psc-level-badge">Level {level}</div>
        </div>
        <div className="psc-xp-total">
          <span className="psc-xp-value">{loading ? '…' : xp}</span>
          <span className="psc-xp-label">Total XP</span>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="psc-progress-section">
        <div className="psc-progress-meta">
          <span className="psc-progress-text">
            Progress to Level {level + 1}
          </span>
          <span className="psc-progress-numbers">
            {loading ? '…' : `${currentLevelXP} / ${XP_PER_LEVEL} XP`}
          </span>
        </div>

        <div className="psc-progress-track" role="progressbar"
          aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="psc-progress-fill"
            style={{ width: loading ? '0%' : `${progressPercent}%` }}
          />
          {/* Glow pulse at the tip */}
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
    </div>
  );
}
