/**
 * XP & Level utility functions.
 * Level formula: level = floor(xp / 200) + 1
 * Level 1 = 0–199 XP, Level 2 = 200–399 XP, etc.
 */

export const XP_PER_SESSION = 50;
export const XP_PER_LEVEL = 200;

/**
 * Returns the current level given total XP.
 * Minimum level is 1.
 */
export function calculateLevel(xp) {
  return Math.floor((xp || 0) / XP_PER_LEVEL) + 1;
}

/**
 * Returns the XP progress toward the next level (0–1).
 * e.g., 350 XP → level 2 (200–399), progress = 150/200 = 0.75
 */
export function calculateProgress(xp) {
  const progressXP = (xp || 0) % XP_PER_LEVEL;
  return progressXP / XP_PER_LEVEL;
}

/**
 * Returns the XP within the current level (e.g., 150 out of 200).
 */
export function levelXP(xp) {
  return (xp || 0) % XP_PER_LEVEL;
}
