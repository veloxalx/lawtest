import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace these with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyAGoRJrlWD-b9gLHV79u6Dzhr8tz5SlG8M",
  authDomain: "startup-97f6f.firebaseapp.com",
  projectId: "startup-97f6f",
  storageBucket: "startup-97f6f.appspot.com",
  messagingSenderId: "604798753344",
  appId: "1:604798753344:web:7d0c93cb51d7f305c35da5",
  measurementId: "G-ZHDZL9VT68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, firestore, googleProvider };
