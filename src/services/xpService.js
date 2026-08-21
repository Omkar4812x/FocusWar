import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { calculateLevel, XP_PER_SESSION } from '../utils/xp';

/**
 * Awards XP to a user for completing a focus session.
 * Uses atomic increment to prevent race conditions.
 *
 * @param {string} userId - Firebase Auth UID
 * @returns {{ newXP: number, newLevel: number, didLevelUp: boolean }}
 */
export async function awardSessionXP(userId) {
  const userRef = doc(db, 'users', userId);

  // 1. Read current data to calculate old level
  const snap = await getDoc(userRef);
  if (!snap.exists()) throw new Error('User document not found');

  const currentData = snap.data();
  const oldXP = currentData.xp ?? 0;
  const oldLevel = calculateLevel(oldXP);

  // 2. Atomically increment XP
  const newXP = oldXP + XP_PER_SESSION;
  const newLevel = calculateLevel(newXP);

  await updateDoc(userRef, {
    xp: increment(XP_PER_SESSION),
    level: newLevel,
  });

  return {
    newXP,
    newLevel,
    didLevelUp: newLevel > oldLevel,
  };
}
