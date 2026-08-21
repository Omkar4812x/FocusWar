import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_GEMINI_API_KEY",
  authDomain: "focuswar-f39e2.firebaseapp.com",
  projectId: "focuswar-f39e2",
  storageBucket: "focuswar-f39e2.firebasestorage.app",
  messagingSenderId: "608295447973",
  appId: "1:608295447973:web:8199d734b87f739a480c4c",
  measurementId: "G-8KNYT21Y1D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
