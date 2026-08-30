import { useState, useEffect, useRef, useCallback } from 'react';
import { playCompletionChime, setAmbientSound } from '../utils/soundscape';

const SESSIONS = [
  { id: 'work', label: '🧠 Focus (25m)', duration: 25 * 60 },
  { id: 'short', label: '☕ Short Break (5m)', duration: 5 * 60 },
  { id: 'long', label: '🌴 Long Break (15m)', duration: 15 * 60 },
  { id: 'demo', label: '⚡ Demo Mode (1m)', duration: 60 },
];

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function PomodoroTimer({ onSessionComplete }) {
  const [selectedMode, setSelectedMode] = useState(SESSIONS[0]);
  const [timeRemaining, setTimeRemaining] = useState(SESSIONS[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Focus Task Goal input
  const [taskGoal, setTaskGoal] = useState('');

  // Ambient Sound State
  const [ambientType, setAmbientType] = useState('none');

  const intervalRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Switch session mode
  const handleModeChange = (mode) => {
    clearTimer();
    setSelectedMode(mode);
    setTimeRemaining(mode.duration);
    setIsRunning(false);
    setIsDone(false);
  };

  // Change ambient sound
  const handleAmbientChange = (type) => {
    setAmbientType(type);
    setAmbientSound(type);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            setIsDone(true);
            playCompletionChime();
            onSessionComplete?.(selectedMode.duration);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [isRunning, clearTimer, onSessionComplete, selectedMode]);

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
    setTimeRemaining(selectedMode.duration);
  };

  // SVG Progress calculation
  const SIZE = 240;
  const STROKE = 12;
  const RADIUS = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const progress = timeRemaining / selectedMode.duration;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const hue = Math.round(270 - (1 - progress) * 50);
  const arcColor = `hsl(${hue}, 85%, 65%)`;

  return (
    <div className="pomodoro-wrapper">
      {/* Mode Selector Buttons */}
      <div className="pomodoro-mode-selector">
        {SESSIONS.map((mode) => (
          <button
            key={mode.id}
            className={`mode-btn ${selectedMode.id === mode.id ? 'active' : ''}`}
            onClick={() => handleModeChange(mode)}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Goal Input Field */}
      <div className="pomodoro-task-input-wrap">
        <input
          type="text"
          className="input pomodoro-task-input"
          placeholder="🎯 What are you focusing on right now?"
          value={taskGoal}
          onChange={(e) => setTaskGoal(e.target.value)}
        />
      </div>

      {/* Done Banner */}
      {isDone && (
        <div className="pomodoro-done-banner" role="status">
          🎉 {selectedMode.id === 'work' || selectedMode.id === 'demo' ? 'Focus Session Complete! +50 XP Earned!' : 'Break Time Complete!'}
        </div>
      )}

      {/* SVG Timer */}
      <div className="pomodoro-circle-wrap">
        <svg
          className="pomodoro-svg"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={SIZE}
          height={SIZE}
          aria-label={`Timer: ${formatTime(timeRemaining)} remaining`}
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={STROKE}
          />
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

        <div className="pomodoro-time-label">
          <span className="pomodoro-time">{formatTime(timeRemaining)}</span>
          <span className="pomodoro-label">
            {isDone ? 'Done!' : isRunning ? 'Focusing…' : selectedMode.label.split(' ')[1]}
          </span>
          {taskGoal && isRunning && (
            <span className="pomodoro-task-active-tag">
              📌 {taskGoal}
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="pomodoro-controls">
        {!isRunning ? (
          <button
            className="btn btn-primary pomodoro-btn"
            onClick={handleStart}
            disabled={isDone}
            id="timer-start"
          >
            ▶ Start Session
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

      {/* Ambient Sound Generators */}
      <div className="pomodoro-ambient-bar">
        <span className="ambient-label">🎵 Ambient Sound:</span>
        <div className="ambient-options">
          {[
            { id: 'none', label: 'Off' },
            { id: 'rain', label: '🌧️ Rain' },
            { id: 'whitenoise', label: '📻 White Noise' },
            { id: 'binaural', label: '🧘 Binaural' },
          ].map((item) => (
            <button
              key={item.id}
              className={`ambient-btn ${ambientType === item.id ? 'active' : ''}`}
              onClick={() => handleAmbientChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Session info */}
      <div className="pomodoro-info">
        <span className="pomodoro-info-item">
          <span className="pomodoro-info-dot" style={{ background: arcColor }} />
          {Math.round((1 - progress) * 100)}% complete
        </span>
        <span className="pomodoro-info-item">{Math.round(selectedMode.duration / 60)} min target</span>
      </div>
    </div>
  );
}
