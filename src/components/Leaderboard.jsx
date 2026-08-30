import { useState } from 'react';

// Sample top warriors data for competitive leaderboard
const INITIAL_LEADERBOARD = [
  { rank: 1, name: 'Aria FocusMaster', level: 14, xp: 2850, streak: 18, isUser: false, avatarBg: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  { rank: 2, name: 'CyberSamurai', level: 12, xp: 2420, streak: 14, isUser: false, avatarBg: 'linear-gradient(135deg, #8b5cf6, #ec4899)' },
  { rank: 3, name: 'ZenMonk_99', level: 10, xp: 2050, streak: 12, isUser: false, avatarBg: 'linear-gradient(135deg, #10b981, #3b82f6)' },
  { rank: 4, name: 'CodeNinja', level: 8, xp: 1680, streak: 9, isUser: false, avatarBg: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' },
  { rank: 5, name: 'FocusTitans', level: 7, xp: 1420, streak: 7, isUser: false, avatarBg: 'linear-gradient(135deg, #ec4899, #f59e0b)' },
  { rank: 6, name: 'ChronoScholar', level: 6, xp: 1210, streak: 5, isUser: false, avatarBg: 'linear-gradient(135deg, #6366f1, #10b981)' },
];

export default function Leaderboard({ currentUserData }) {
  const [filter, setFilter] = useState('global'); // 'global' | 'weekly' | 'friends'

  const userXP = currentUserData?.xp ?? 0;
  const userLevel = currentUserData?.level ?? 1;
  const userName = currentUserData?.name || 'You (Warrior)';
  const userStreak = currentUserData?.streak ?? 0;

  // Insert current user into ranking dynamically based on XP
  let combinedList = [...INITIAL_LEADERBOARD];

  // Check if current user is already in top 6, else insert
  const currentUserEntry = {
    rank: 0,
    name: `${userName} (You)`,
    level: userLevel,
    xp: userXP,
    streak: userStreak,
    isUser: true,
    avatarBg: 'linear-gradient(135deg, #8b5cf6, #3b82f6)'
  };

  // Sort descending by XP
  combinedList.push(currentUserEntry);
  combinedList.sort((a, b) => b.xp - a.xp);

  // Assign ranks
  combinedList = combinedList.map((item, index) => ({
    ...item,
    rank: index + 1
  }));

  const userRank = combinedList.find((i) => i.isUser)?.rank || 1;

  return (
    <div className="leaderboard-container animate-fade">
      {/* Header Banner */}
      <div className="glass-card leaderboard-banner">
        <div className="lb-banner-info">
          <span className="lb-badge">🏆 Global Arena</span>
          <h2 className="lb-title">Focus War Rankings</h2>
          <p className="lb-subtitle">Compete daily with warriors worldwide by earning Focus XP.</p>
        </div>
        <div className="lb-user-rank-box">
          <div className="lb-rank-num">#{userRank}</div>
          <div className="lb-rank-label">Your Global Rank</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="lb-tabs">
        <button
          className={`lb-tab ${filter === 'global' ? 'active' : ''}`}
          onClick={() => setFilter('global')}
        >
          🌍 Global Top
        </button>
        <button
          className={`lb-tab ${filter === 'weekly' ? 'active' : ''}`}
          onClick={() => setFilter('weekly')}
        >
          ⚡ Weekly Sprint
        </button>
        <button
          className={`lb-tab ${filter === 'friends' ? 'active' : ''}`}
          onClick={() => setFilter('friends')}
        >
          👥 Squad
        </button>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="glass-card lb-table-card">
        <div className="lb-table-header">
          <span>Rank</span>
          <span>Warrior</span>
          <span>Level</span>
          <span>Streak</span>
          <span style={{ textAlign: 'right' }}>Total XP</span>
        </div>

        <div className="lb-list">
          {combinedList.map((warrior) => {
            let rankBadge = `#${warrior.rank}`;
            let rankClass = '';
            if (warrior.rank === 1) { rankBadge = '🥇'; rankClass = 'rank-gold'; }
            else if (warrior.rank === 2) { rankBadge = '🥈'; rankClass = 'rank-silver'; }
            else if (warrior.rank === 3) { rankBadge = '🥉'; rankClass = 'rank-bronze'; }

            return (
              <div
                key={warrior.name + warrior.rank}
                className={`lb-row ${warrior.isUser ? 'lb-row-user' : ''}`}
              >
                <div className={`lb-col-rank ${rankClass}`}>{rankBadge}</div>

                <div className="lb-col-user">
                  <div className="lb-avatar" style={{ background: warrior.avatarBg }}>
                    {warrior.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="lb-user-details">
                    <span className="lb-user-name">
                      {warrior.name}
                      {warrior.isUser && <span className="lb-you-tag">YOU</span>}
                    </span>
                  </div>
                </div>

                <div className="lb-col-level">
                  <span className="badge badge-purple">Lvl {warrior.level}</span>
                </div>

                <div className="lb-col-streak">
                  🔥 {warrior.streak}d
                </div>

                <div className="lb-col-xp">
                  {warrior.xp} <span className="xp-suffix">XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
