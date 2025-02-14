"use client"
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
  const [showScamWarning, setShowScamWarning] = useState(false); // New state for scam warning

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

    // Check if the scam warning has been shown before
    const hasSeenScamWarning = localStorage.getItem("hasSeenScamWarning");
    if (!hasSeenScamWarning) {
      setShowScamWarning(true); // Show the scam warning
      localStorage.setItem("hasSeenScamWarning", "true"); // Mark as seen
    }

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
    <div className="min-h-screen bg-gray-50">
      {/* Scam Warning Alert */}
      {showScamWarning && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-50 border-b border-yellow-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="ml-2 text-yellow-800">Beware of scams! This application takes no responsibility for who contacts you. Be mindful when using it.</span>
              </div>
              <button onClick={() => setShowScamWarning(false)} className="text-yellow-600 hover:text-yellow-800">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h1 className="text-3xl font-bold">Problem Solver 🆘</h1>
              <p className="mt-2 text-blue-100">Connect, Share, Solve Together</p>
            </div>
            {user && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search problems..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {problemCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Link  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors m-4" href={"/how"}> How To Use The App</Link>
        {/* User Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {!user ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Get Started</h2>
              <button
                onClick={handleSignInWithGoogle}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign in with Google
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Welcome back, {user?.displayName} 👋</h2>
              <div className="space-x-4">
                <button
                  onClick={() => setShowPopup(true)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors m-4"
                >
                  Manage Problems
                </button>
                <Link href="/add">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Problem
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Problems Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProblems.map((problem) => (
              <div key={problem.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{problem.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      problem.found
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {problem.found ? "Solved" : "Unsolved"}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{problem.problem}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {problem.category}
                    </span>
                  </div>
                  {user && user.uid === problem.userId ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleSolved(problem.id)}
                        className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
                          problem.found
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {problem.found ? "Mark Unsolved" : "Mark Solved"}
                      </button>
                      <button
                        onClick={() => handleDeleteProblem(problem.id)}
                        className="p-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Contact to Help
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProblems.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">No Problems Found</h3>
            <p className="text-gray-600">Try adjusting your filters or add a new problem.</p>
          </div>
        )}
      </main>

      {/* User Problems Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Your Problems</h2>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                {userProblems.length > 0 ? (
                  userProblems.map((problem) => (
                    <div key={problem.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold">{problem.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          problem.found
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {problem.found ? "Solved" : "Unsolved"}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{problem.problem}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleSolved(problem.id)}
                          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                            problem.found
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {problem.found ? "Mark Unsolved" : "Mark Solved"}
                        </button>
                        <button
                          onClick={() => handleDeleteProblem(problem.id)}
                          className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">You haven't added any problems yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;