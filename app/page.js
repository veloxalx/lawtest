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
import { auth, firestore } from "./lib/firebase";
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

const Home = () => {
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

  const handleToggleSolved = async (problemId) => {
    try {
      const problemDoc = doc(firestore, "problems", problemId);
      const problemToUpdate = problems.find(
        (problem) => problem.id === problemId
      );
      const newFoundStatus = !problemToUpdate.found;

      await updateDoc(problemDoc, { found: newFoundStatus });

      const updateProblem = (list) =>
        list.map((problem) =>
          problem.id === problemId
            ? { ...problem, found: newFoundStatus }
            : problem
        );

      setProblems(updateProblem(problems));
      setFilteredProblems(updateProblem(filteredProblems));
      setUserProblems(updateProblem(userProblems));
    } catch (error) {
      console.error("Error toggling problem solved status:", error.message);
    }
  };

  const handleDeleteProblem = async (problemId) => {
    try {
      const problemDoc = doc(firestore, "problems", problemId);
      await deleteDoc(problemDoc);
      setProblems(problems.filter((problem) => problem.id !== problemId));
      setFilteredProblems(
        filteredProblems.filter((problem) => problem.id !== problemId)
      );
      setUserProblems(
        userProblems.filter((problem) => problem.id !== problemId)
      );
    } catch (error) {
      console.error("Error deleting problem:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">I Have A Problem 🔔🆘</h1>
          {user && (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
            >
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {/* Filters */}
        <div className="mb-6 border-yellow-400">
          <h2 className="text-xl font-semibold mb-4">Filter by Category</h2>
          <br />
          <Link href={"/how"}>
            <button>How To Use The App</button>
          </Link>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-1/3 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {problemCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title..."
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* User Actions */}
        <div className="mb-6">
          {!user ? (
            <div className="text-center">
              <p className="text-lg mb-4">Login to Add Your Problems 👇</p>
              <button
                onClick={handleSignInWithGoogle}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md shadow-md transition"
              >
                Sign in with Google
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg mb-4">
                Welcome back {user?.displayName} 👋
              </p>
              <button
                onClick={() => setShowPopup(true)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md shadow-md transition mr-4"
              >
                Manage Your Problems
              </button>
              <Link href="/add-problem">
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md shadow-md transition">
                  Add Problem
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Problem List */}
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : filteredProblems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map((problem) => (
              <div
                key={problem.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                <p className="text-gray-600 mb-4">{problem.problem}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-500">
                      Category: {problem.category}
                    </span>
                    <br />
                    <span className="text-sm text-gray-500">
                      Status:{" "}
                      <span
                        className={`font-bold ${
                          problem.found ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {problem.found ? "Solved" : "Unsolved"}
                      </span>
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {user && user.uid === problem.userId && (
                      <>
                        <button
                          onClick={() => handleToggleSolved(problem.id)}
                          className={`px-3 py-1 rounded-md text-white transition ${
                            problem.found
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-blue-500 hover:bg-blue-600"
                          }`}
                        >
                          {problem.found
                            ? "Mark as Unsolved"
                            : "Mark as Solved"}
                        </button>
                        <button
                          onClick={() => handleDeleteProblem(problem.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {!user ||
                      (user.uid !== problem.userId && (
                        <a
                          href={`mailto:${problem.email}`}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition"
                        >
                          Contact to Help
                        </a>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No problems found</p>
        )}
      </main>

      {/* Popup for User Problems */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Your Problems</h2>
            {userProblems.length > 0 ? (
              <div className="space-y-4">
                {userProblems.map((problem) => (
                  <div
                    key={problem.id}
                    className="bg-gray-100 p-4 rounded-lg shadow-sm"
                  >
                    <h3 className="text-lg font-semibold">{problem.title}</h3>
                    <p className="text-gray-600">{problem.problem}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">
                        Status:{" "}
                        <span
                          className={`font-bold ${
                            problem.found ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {problem.found ? "Solved" : "Unsolved"}
                        </span>
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleSolved(problem.id)}
                          className={`px-3 py-1 rounded-md text-white transition ${
                            problem.found
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-blue-500 hover:bg-blue-600"
                          }`}
                        >
                          {problem.found
                            ? "Mark as Unsolved"
                            : "Mark as Solved"}
                        </button>
                        <button
                          onClick={() => handleDeleteProblem(problem.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">
                You have no problems added yet.
              </p>
            )}
            <button
              onClick={() => setShowPopup(false)}
              className="mt-6 w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
