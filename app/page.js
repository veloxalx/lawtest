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
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">Problem Solver</div>
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
      </nav>

      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-6">
          Problem Solver 🆘
        </h1>
        <div className=" flex-col items-center justify-center bg-gray-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Law Assistant
          </h1>
          <div className="space-y-4">
            <Link href="/addLawyer">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Register as Lawyer
              </button>
            </Link>
            <Link href="/community">
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Get Lawyer Assistance
            </button>
            </Link>
          </div>
              
        </div>
        <div className="text-center mb-6">
          <label
            htmlFor="category-filter"
            className="block text-sm font-medium text-gray-700"
          >
            Filter by Category
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-2 block w-full max-w-md mx-auto h-8 border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            <option value="">All Categories</option>
            {problemCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title..."
            className="mt-4 block w-full max-w-md h-9 mx-auto border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="text-center text-xl">Loading...</div>
          ) : filteredProblems.length > 0 ? (
            filteredProblems.map((problem) => (
              <div
                key={problem.id}
                className={`border rounded-lg p-6 shadow-lg ${
                  problem.found
                    ? "bg-green-50 border-green-300"
                    : "bg-yellow-50 border-yellow-300"
                } ${problem.urgent ? "border-red-500 bg-red-50" : ""}`}
              >
                <h4 className="text-xl font-semibold mb-2">{problem.title}</h4>
                <p className="mb-2">
                  <strong>Description:</strong> {problem.problem}
                </p>
                <p className="mb-2">
                  <strong>Category:</strong> {problem.category}
                </p>
                <p className="mb-2">
                  <strong>Location:</strong> {problem.location}
                </p>
                <p className="mb-2">
                  <strong>Status:</strong>{" "}
                  {problem.found ? "Solved" : "Unsolved"}
                </p>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleToggleSolved(problem.id)}
                    className={`py-2 px-4 rounded shadow transition ${
                      problem.found
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                  >
                    {problem.found ? "Mark as Unsolved" : "Mark as Solved"}
                  </button>
                  <button
                    onClick={() => handleDeleteProblem(problem.id)}
                    className="py-2 px-4 rounded shadow bg-red-500 hover:bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-xl">No problems found.</div>
          )}
        </div>

        {user && (
          <>
            <div className="fixed bottom-6 right-6">
              <button
                onClick={() => setShowPopup(!showPopup)}
                className="bg-blue-500 text-white py-2 px-4 rounded shadow-lg hover:bg-blue-600 transition"
              >
                {showPopup ? "Close My Problems" : "View My Problems"}
              </button>
            </div>
            {showPopup && (
              <div className="fixed bottom-6 right-6 bg-white shadow-lg rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2">My Problems</h3>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center text-xl">Loading...</div>
                  ) : userProblems.length > 0 ? (
                    userProblems.map((problem) => (
                      <div
                        key={problem.id}
                        className="border rounded-lg p-4 shadow-sm"
                      >
                        <h4 className="text-lg font-semibold mb-2">
                          {problem.title}
                        </h4>
                        <p className="mb-2">
                          <strong>Description:</strong> {problem.problem}
                        </p>
                        <p className="mb-2">
                          <strong>Category:</strong> {problem.category}
                        </p>
                        <p className="mb-2">
                          <strong>Location:</strong> {problem.location}
                        </p>
                        <p className="mb-2">
                          <strong>Status:</strong>{" "}
                          {problem.found ? "Solved" : "Unsolved"}
                        </p>
                        <div className="mt-4 flex space-x-2">
                          <button
                            onClick={() => handleToggleSolved(problem.id)}
                            className={`py-2 px-4 rounded shadow transition ${
                              problem.found
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-blue-500 hover:bg-blue-600"
                            } text-white`}
                          >
                            {problem.found
                              ? "Mark as Unsolved"
                              : "Mark as Solved"}
                          </button>
                          <button
                            onClick={() => handleDeleteProblem(problem.id)}
                            className="py-2 px-4 rounded shadow bg-red-500 hover:bg-red-600 text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-xl">
                      No problems found.
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowPopup(false)}
                  className="mt-4 py-2 px-4 rounded shadow bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Close
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
