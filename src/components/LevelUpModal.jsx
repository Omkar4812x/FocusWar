import { useEffect } from 'react';

/**
 * LevelUpModal
 * Full-screen animated overlay shown when user levels up.
 *
 * Props:
 *   level: number — the new level reached
 *   onClose: () => void — called when user dismisses
 */
export default function LevelUpModal({ level, onClose }) {
  // Auto-dismiss after 4 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="levelup-overlay" onClick={onClose} role="dialog" aria-modal="true"
      aria-label={`Level Up! You reached level ${level}`}>
      <div className="levelup-card" onClick={(e) => e.stopPropagation()}>
        {/* Animated burst rings */}
        <div className="levelup-ring levelup-ring-1" />
        <div className="levelup-ring levelup-ring-2" />
        <div className="levelup-ring levelup-ring-3" />

        <div className="levelup-emoji">🎉</div>
        <h2 className="levelup-title">Level Up!</h2>
        <p className="levelup-level">You reached Level {level}</p>
        <p className="levelup-sub">Keep grinding, warrior. The leaderboard awaits.</p>

        <button className="btn btn-primary levelup-btn" onClick={onClose}>
          Let&apos;s Go! 🚀
        </button>
      </div>
    </div>
  );
}
