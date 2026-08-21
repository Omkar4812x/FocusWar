import { useState, useEffect, useRef, useCallback } from 'react';

const WORK_DURATION = 25 * 60; // 1500 seconds

// Format seconds → MM:SS
function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/**
 * PomodoroTimer
 * Props:
 *   onSessionComplete(duration): called when timer reaches 0
 */
export default function PomodoroTimer({ onSessionComplete }) {
  const [timeRemaining, setTimeRemaining] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef(null);

  // ── Clear interval helper ────────────────────────────────────────────────
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ── Tick every second ────────────────────────────────────────────────────
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            setIsDone(true);
            onSessionComplete?.(WORK_DURATION);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return clearTimer; // cleanup on unmount / dep change
  }, [isRunning, clearTimer, onSessionComplete]);

  // ── Controls ─────────────────────────────────────────────────────────────
  const handleStart = () => {
    if (isDone) return;
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    clearTimer();
    setIsRunning(false);
    setIsDone(false);
    setTimeRemaining(WORK_DURATION);
  };

  // ── SVG Circle progress ──────────────────────────────────────────────────
  const SIZE = 240;          // SVG viewport
  const STROKE = 12;
  const RADIUS = (SIZE - STROKE) / 2;   // 114
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const progress = timeRemaining / WORK_DURATION;     // 1 → 0
  const dashOffset = CIRCUMFERENCE * (1 - progress);  // grows as time passes

  // Color shifts from purple → blue as time decreases
  const hue = Math.round(270 - (1 - progress) * 50);  // 270 (purple) → 220 (blue)
  const arcColor = `hsl(${hue}, 85%, 65%)`;

  return (
    <div className="pomodoro-wrapper">
      {/* ── Session complete banner ── */}
      {isDone && (
        <div className="pomodoro-done-banner" role="status">
          🎉 Session Complete! Great focus!
        </div>
      )}

      {/* ── Circular timer ── */}
      <div className="pomodoro-circle-wrap">
        <svg
          className="pomodoro-svg"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={SIZE}
          height={SIZE}
          aria-label={`Timer: ${formatTime(timeRemaining)} remaining`}
        >
          {/* Background track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={STROKE}
          />
          {/* Progress arc */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={arcColor}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            style={{
              transition: isRunning ? 'stroke-dashoffset 1s linear, stroke 1s linear' : 'none',
              filter: `drop-shadow(0 0 10px ${arcColor}) drop-shadow(0 0 20px ${arcColor}55)`,
            }}
          />
        </svg>

        {/* Time label inside circle */}
        <div className="pomodoro-time-label">
          <span className="pomodoro-time">{formatTime(timeRemaining)}</span>
          <span className="pomodoro-label">
            {isDone ? 'Done!' : isRunning ? 'Focusing…' : 'Focus Session'}
          </span>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="pomodoro-controls">
        {!isRunning ? (
          <button
            className="btn btn-primary pomodoro-btn"
            onClick={handleStart}
            disabled={isDone}
            id="timer-start"
          >
            ▶ Start
          </button>
        ) : (
          <button
            className="btn btn-ghost pomodoro-btn"
            onClick={handlePause}
            id="timer-pause"
          >
            ⏸ Pause
          </button>
        )}
        <button
          className="btn btn-ghost pomodoro-btn"
          onClick={handleReset}
          id="timer-reset"
        >
          ↺ Reset
        </button>
      </div>

      {/* ── Session info ── */}
      <div className="pomodoro-info">
        <span className="pomodoro-info-item">
          <span className="pomodoro-info-dot" style={{ background: arcColor }} />
          {Math.round((1 - progress) * 100)}% complete
        </span>
        <span className="pomodoro-info-item">25 min session</span>
      </div>
    </div>
  );
}
