import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';

const GUEST_KEY = 'focuswar_guest_user';

export function getGuestUser() {
  try {
    const saved = localStorage.getItem(GUEST_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function enableGuestMode(name = 'Focus Warrior') {
  const guestUser = {
    uid: 'guest_warrior',
    email: 'warrior@focuswar.app',
    displayName: name,
    isGuest: true,
  };
  localStorage.setItem(GUEST_KEY, JSON.stringify(guestUser));
  window.dispatchEvent(new Event('focuswar_auth_change'));
  return guestUser;
}

export function disableGuestMode() {
  localStorage.removeItem(GUEST_KEY);
  window.dispatchEvent(new Event('focuswar_auth_change'));
}

/**
 * Custom hook that subscribes to Firebase auth state & local guest user state.
 */
export function useAuth() {
  const [user, setUser] = useState(() => getGuestUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCheck = () => {
      const guest = getGuestUser();
      if (guest) {
        setUser(guest);
        setLoading(false);
      }
    };

    window.addEventListener('focuswar_auth_change', handleAuthCheck);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const guest = getGuestUser();
      if (guest) {
        setUser(guest);
      } else {
        setUser(firebaseUser);
      }
      setLoading(false);
    });

    // Initial check
    handleAuthCheck();

    return () => {
      window.removeEventListener('focuswar_auth_change', handleAuthCheck);
      unsubscribe();
    };
  }, []);

  return { user, loading, isGuest: !!user?.isGuest };
}

