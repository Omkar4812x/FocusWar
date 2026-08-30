export default function StudyAnalytics({ userData }) {
  const userXP = userData?.xp ?? 0;
  const sessionsCount = Math.max(1, Math.floor(userXP / 50));
  const totalMins = sessionsCount * 25;
  const streak = userData?.streak ?? 0;

  // Generate dynamic weekly breakdown based on total sessions
  const days = [
    { day: 'Mon', mins: Math.min(120, Math.round(totalMins * 0.15)) },
    { day: 'Tue', mins: Math.min(150, Math.round(totalMins * 0.20)) },
    { day: 'Wed', mins: Math.min(100, Math.round(totalMins * 0.12)) },
    { day: 'Thu', mins: Math.min(180, Math.round(totalMins * 0.25)) },
    { day: 'Fri', mins: Math.min(140, Math.round(totalMins * 0.18)) },
    { day: 'Sat', mins: Math.min(90,  Math.round(totalMins * 0.08)) },
    { day: 'Sun', mins: Math.min(60,  Math.round(totalMins * 0.05)) },
  ];

  const maxMins = Math.max(...days.map((d) => d.mins), 60);

  return (
    <div className="analytics-container animate-fade">
      {/* Banner */}
      <div className="glass-card analytics-banner">
        <span className="badge badge-purple">📊 Study Insights</span>
        <h2 className="analytics-title">Focus & Productivity Analytics</h2>
        <p className="analytics-subtitle">
          Track your focus duration trends, daily study patterns, and cognitive stamina.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="analytics-metrics-grid">
        <div className="glass-card metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-details">
            <div className="metric-value">{totalMins} <span className="unit">mins</span></div>
            <div className="metric-label">Total Focus Duration</div>
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-icon blue">🎯</div>
          <div className="metric-details">
            <div className="metric-value">{sessionsCount}</div>
            <div className="metric-label">Pomodoro Sessions</div>
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-icon pink">🔥</div>
          <div className="metric-details">
            <div className="metric-value">{streak} <span className="unit">days</span></div>
            <div className="metric-label">Active Streak</div>
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-icon green">⚡</div>
          <div className="metric-details">
            <div className="metric-value">94<span className="unit">%</span></div>
            <div className="metric-label">Focus Score</div>
          </div>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="glass-card chart-card">
        <div className="chart-header">
          <h3 className="chart-title">📅 Daily Focus Time Breakdown (Minutes)</h3>
          <span className="chart-period">This Week</span>
        </div>

        <div className="svg-chart-wrapper">
          <div className="chart-bars">
            {days.map((d) => {
              const heightPercent = Math.round((d.mins / maxMins) * 100);
              return (
                <div key={d.day} className="chart-bar-group">
                  <div className="bar-val-label">{d.mins}m</div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <div className="bar-day-label">{d.day}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
