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
    <div className="p-3 max-w-8xl mx-auto">
      <h1
        className="text-3xl font-bold mb-4 text-center"
        style={{ margin: "40px" }}
      >
        Problem Solver 🆘
      </h1>
      {user && (
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded shadow hover:bg-red-600 transition mb-4"
        >
          Logout
        </button>
      )}
      <div className="text-center mb-4">
        <Link
          href={"/how"}
          className="bg-gray-500 text-white py-2 px-4 rounded shadow hover:bg-gray-600 transition"
          color="green"
          style={{ marginBottom: "40px" }}
        >
          How to (Guide)
        </Link>
        <br />
        <br />
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
          className="mt-4 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          style={{
            height: "40px",
            margin: "20px",
            width: "20rem",
            boxShadow: "inherit",
          }}
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
          className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          style={{
            height: "40px",
            margin: "30px",
            width: "80vw",
            boxShadow: "inherit",
            padding: "10px",
          }}
        />
      </div>
      <div className="text-center mb-4">
        {!user ? (
          <div>
            <h2 className="text-xl mb-4">Login to Add Your Problems 👇</h2>
            <button
              onClick={handleSignInWithGoogle}
              className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 transition"
            >
              Sign in with Google
            </button>
          </div>
        ) : (
          <div>
            <img
              src={user?.photoURL || "/default-avatar.png"}
              alt="User Profile"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h1 className="text-2xl font-semibold mb-4">
              Welcome back {user?.displayName} 👋
            </h1>
            <div className="mb-4">
              <Link
                href={"/add"}
                className="bg-green-500 text-white py-2 px-4 rounded shadow hover:bg-green-600 transition"
              >
                Add Problem
              </Link>
            </div>
            <button
              onClick={() => setShowPopup(true)}
              className="bg-gray-500 text-white py-2 px-4 rounded shadow hover:bg-gray-600 transition"
            >
              Manage Your Problems
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-18" >
        {loading ? (
          <h1>Loading...</h1>
        ) : filteredProblems.length > 0 ? (
          filteredProblems.map((problem) => (
            <div
              key={problem.id}
              className={`border border-gray-200 rounded-lg p-6 h-400 shadow-lg ${
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
              <p style={{ margin: "20px 0" }}>
                <strong>Description:</strong><br />
                {problem.problem}
              </p>
              <p><strong>Category:</strong> {problem.category}</p>
              <p><strong>Location:</strong> {problem.location}</p>
              <p><strong>Status:</strong> {problem.found ? "Solved" : "Unsolved"}</p>
              {user && user.uid === problem.userId && (
                <div className="mt-4">
                  <button
                    onClick={() => handleToggleSolved(problem.id)}
                    className={`py-2 px-4 rounded shadow transition mr-2 ${
                      problem.found
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {problem.found ? "Mark as Unsolved" : "Mark as Solved"}
                  </button>
                  <button
                    onClick={() => handleDeleteProblem(problem.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded shadow hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
              {!user || user.uid !== problem.userId && (
                <div className="mt-4">
                  <button
                    onClick={() => window.location.href = `mailto:${problem.email}`}
                    className="bg-green-500 text-white py-2 px-4 rounded shadow hover:bg-green-600 transition"
                  >
                    Contact to Help
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <h1 style={{margin:"40px"}}><strong>No problems found</strong></h1>
        )}
      </div>
      {showPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Your Problems</h2>
      {userProblems.length > 0 ? (
        userProblems.map((problem) => (
          <div 
            key={problem.id} 
            style={{marginTop:"40px"}}
            className={`mb-4 p-4 border rounded ${
              problem.found ? 'bg-green-100' : 'bg-yellow-100'
            }`}
          >
            <h3 className="text-xl font-semibold">{problem.title}</h3>
            <p>{problem.problem}</p>
            <p>
              <strong>Category:</strong> {problem.category}
            </p>
            <p>
              <strong>Status: {problem.found ? "Solved" : "Unsolved"}</strong>{" "}
            </p>
            <div className="mt-2">
              <button
                onClick={() => handleToggleSolved(problem.id)}
                className={`py-1 px-2 rounded mr-2 ${
                  problem.found
                    ? "bg-yellow-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {problem.found ? "Mark as Unsolved" : "Mark as Solved"}
              </button>
              <button
                onClick={() => handleDeleteProblem(problem.id)}
                className="bg-red-500 text-white py-1 px-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>You have no problems added yet.</p>
      )}
      <button
        onClick={() => setShowPopup(false)}
        className="mt-4 bg-gray-500 text-white py-2 px-4 rounded"
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