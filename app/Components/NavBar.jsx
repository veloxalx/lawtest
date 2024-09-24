"use client";
import React, { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { auth, firestore } from "../lib/firebase";
import Link from "next/link";

const problemCategories = [
  "Medical",
  "Technical",
  "Financial",
  "Educational",
  "Home & Repair",
  "Legal",
  "Career",
  "Relationship",
  "Other",
];
const NavBar = () => {

  const [user, setUser] = useState(null);
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userProblems, setUserProblems] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);

    const fetchProblems = async () => {
      setLoading(true);
      try {
        const problemsCollection = collection(firestore, "problems");
        const snapshot = await getDocs(problemsCollection);
        const problemsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProblems(problemsList);
        setFilteredProblems(problemsList);
      } catch (error) {
        console.error("Error fetching problems:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let updatedProblems = problems;

    if (selectedCategory) {
      updatedProblems = updatedProblems.filter(
        (problem) => problem.category === selectedCategory
      );
    }

    if (searchTerm) {
      updatedProblems = updatedProblems.filter((problem) =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProblems(updatedProblems);
  }, [selectedCategory, searchTerm, problems]);

  useEffect(() => {
    if (user && showPopup) {
      fetchUserProblems();
    }
  }, [user, showPopup]);

  const fetchUserProblems = async () => {
    if (user) {
      setLoading(true);
      try {
        const problemsCollection = collection(firestore, "problems");
        const q = query(problemsCollection, where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        const userProblemsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserProblems(userProblemsList);
      } catch (error) {
        console.error("Error fetching user problems:", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div>      <nav className="bg-white shadow-md">
    <div className="container mx-auto px-6 py-3 flex items-center justify-between">
    <Link href="/" className="text-gray-700 hover:text-blue-600">

      <div className="text-2xl font-bold text-blue-600">Problem Solver</div>
      </Link>

      <div className="flex items-center space-x-4">
        <Link href="/" className="text-gray-700 hover:text-blue-600">
          Home
        </Link>
        <Link href="/how" className="text-gray-700 hover:text-blue-600">
          How to (Guide)
        </Link>
        {user ? (
          <div className="flex items-center space-x-4">
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-10 h-10 rounded-full"
            />
            <span className="font-medium text-gray-700">
              {user.displayName}
            </span>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700"
            >
              Logout
            </button>
            <Link
              href="/add"
              className="bg-green-500 text-white py-2 px-4 rounded shadow hover:bg-green-600 transition"
            >
              Add Problem
            </Link>
          </div>
        ) : (
          <button
            onClick={handleSignInWithGoogle}
            className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 transition"
          >
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  </nav></div>
  )
}

export default NavBar