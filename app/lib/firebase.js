import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace these with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCfj-o4h1Jp49iqREEHSdZZOE4DQRLCNjU",
  authDomain: "problems-33746.firebaseapp.com",
  projectId: "problems-33746",
  storageBucket: "problems-33746.appspot.com",
  messagingSenderId: "4637713392",
  appId: "1:4637713392:web:cb8de88019d96a132bf335",
  measurementId: "G-LCBEGTE3B2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error.message);
    throw error;
  }
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
    throw error;
  }
};

export { auth, firestore, googleProvider, signInWithGoogle, signUp, signIn, logOut };
