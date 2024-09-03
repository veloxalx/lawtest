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
  "Other"
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
      const problemToUpdate = problems.find((problem) => problem.id === problemId);
      const newFoundStatus = !problemToUpdate.found;
      
      await updateDoc(problemDoc, { found: newFoundStatus });
      
      const updateProblem = (list) =>
        list.map((problem) =>
          problem.id === problemId ? { ...problem, found: newFoundStatus } : problem
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
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Problem Solver 🆘</h1>
        <nav className="flex items-center space-x-4">
          <Link
            href={"/how"}
            className="bg-gray-700 text-white py-2 px-4 rounded shadow hover:bg-gray-800 transition"
          >
            How to (Guide)
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold">{user.displayName}</span>
              <img
                src={user.photoURL || "/default-avatar.png"}
                alt="User Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <Link
                href={"/profile"}
                className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-800 transition"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignInWithGoogle}
              className="bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-600 transition"
            >
              Sign In with Google
            </button>
          )}
        </nav>
      </header>
      
      <div className="text-center mb-4">
        <div className="mt-6 flex justify-center space-x-4">
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-64 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
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
            className="block w-96 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <h1>Loading...</h1>
        ) : filteredProblems.length > 0 ? (
          filteredProblems.map((problem) => (
            <div
              key={problem.id}
              className={`border border-gray-200 rounded-lg p-6 shadow-lg ${
                problem.found ? "bg-green-100" : "bg-yellow-100"
              }`}
              style={problem.urgent ? {
                borderColor: "red",
                borderRadius: "12px",
                borderWidth: "2px",
                boxShadow: "0 0 15px red",
              } : {}}
            >
              <h4 className="text-xl font-semibold">{problem.title}</h4>
              <p className="mt-4 mb-2">
                <strong>Description:</strong><br />
                {problem.problem}
              </p>
              <p><strong>Category:</strong> {problem.category}</p>
              <p><strong>Location:</strong> {problem.location}</p>
              <p><strong>Status:</strong> {problem.found ? "Solved" : "Unsolved"}</p>
              {user && user.uid === problem.userId && (
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleToggleSolved(problem.id)}
                    className={`py-2 px-4 rounded transition ${
                      problem.found
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {problem.found ? "Mark as Unsolved" : "Mark as Solved"}
                  </button>
                  <button
                    onClick={() => handleDeleteProblem(problem.id)}
                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
              {user && user.uid !== problem.userId && (
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => alert(`Contact ${problem.email}`)}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                  >
                    Contact User
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <h1>No problems found.</h1>
        )}
      </div>

      {!user && (
        <div className="flex justify-center mt-12">
          <button
            onClick={handleSignInWithGoogle}
            className="bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-600 transition"
          >
            Sign In with Google
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
