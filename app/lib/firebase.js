import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", error.message);
    throw error;
  }
};

const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error.message);
    throw error;
  }
};

const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error.message);
  }
};

export { auth, db as firestore, googleProvider, signInWithGoogle, signUp, signIn, logOut };
