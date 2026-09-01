import { useState, useEffect } from 'react';

const INITIAL_TASKS = [
  { id: '1', title: 'Complete 1 Pomodoro Session', difficulty: 'easy', xp: 15, completed: false },
  { id: '2', title: 'Review algorithm notes & code solution', difficulty: 'medium', xp: 30, completed: false },
  { id: '3', title: 'Ship feature & run integration tests', difficulty: 'hard', xp: 50, completed: false },
];

export default function FocusTaskList({ onCompleteTask }) {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('focuswar_user_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDiff, setNewTaskDiff] = useState('medium'); // 'easy' | 'medium' | 'hard'

  useEffect(() => {
    try {
      localStorage.setItem('focuswar_user_tasks', JSON.stringify(tasks));
    } catch (err) {
      console.warn('Failed to save tasks:', err);
    }
  }, [tasks]);

  const getXPForDiff = (diff) => {
    if (diff === 'easy') return 15;
    if (diff === 'hard') return 50;
    return 30; // medium
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      difficulty: newTaskDiff,
      xp: getXPForDiff(newTaskDiff),
      completed: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
  };

  const handleToggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newlyCompleted = !t.completed;
          if (newlyCompleted) {
            onCompleteTask?.(t.xp, t.title);
          }
          return { ...t, completed: newlyCompleted };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="focus-task-list-wrap animate-fade">
      <div className="glass-card task-list-card">
        <div className="task-list-header">
          <div>
            <h3 className="section-title" style={{ margin: 0 }}>
              <span>⚔️</span> Focus Quests & Action Items
            </h3>
            <p className="task-list-sub">
              Earn immediate XP and level progress as you check off your study goals.
            </p>
          </div>
          <span className="badge badge-blue">
            {completedCount} / {tasks.length} Completed
          </span>
        </div>

        {/* Task Input Form */}
        <form onSubmit={handleAddTask} className="task-add-form">
          <input
            type="text"
            className="input task-input"
            placeholder="➕ Add a new focus task or study milestone…"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <select
            className="input diff-select"
            value={newTaskDiff}
            onChange={(e) => setNewTaskDiff(e.target.value)}
          >
            <option value="easy">🟢 Easy (+15 XP)</option>
            <option value="medium">🟡 Medium (+30 XP)</option>
            <option value="hard">🔴 Hard (+50 XP)</option>
          </select>
          <button type="submit" className="btn btn-primary add-task-btn">
            Add Task
          </button>
        </form>

        {/* Tasks List */}
        <div className="tasks-scroll-area">
          {tasks.length === 0 ? (
            <div className="empty-tasks-state">
              🎉 All tasks completed! Add a new goal above to earn more XP.
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`task-item ${task.completed ? 'task-done' : ''}`}
              >
                <label className="task-checkbox-label">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    className="task-checkbox"
                  />
                  <span className="task-title-text">{task.title}</span>
                </label>

                <div className="task-meta">
                  <span className={`diff-badge diff-${task.difficulty}`}>
                    {task.difficulty.toUpperCase()}
                  </span>
                  <span className="task-xp-reward">+{task.xp} XP</span>
                  <button
                    className="btn-icon delete-task-btn"
                    onClick={() => handleDeleteTask(task.id)}
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
