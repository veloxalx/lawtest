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
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-20">
        <div className="container mx-auto text-center text-white">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to LawTest Problem Solver 🆘
          </h1>
          <p className="text-xl mb-6">
            Your one-stop solution for legal assistance and problem-solving.
          </p>
          <Link href="/addLawyer">
            <button className="bg-white text-blue-500 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-200 transition duration-300">
              Register as Lawyer
            </button>
          </Link>
          <Link href="/community">
            <button className="bg-green-500 text-white-500 font-bold py-3 ml-5 px-6 rounded-full shadow-lg hover:bg-blue-600 transition duration-300">
              Get Lawyer Assistance
            </button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto p-6">
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
            className="mt-2 block w-full max-w-md mx-auto h-9 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
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
                    className={`py-2 px-4 rounded-lg shadow transition ${
                      problem.found
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                  >
                    {problem.found ? "Mark as Unsolved" : "Mark as Solved"}
                  </button>
                  <button
                    onClick={() => handleDeleteProblem(problem.id)}
                    className="py-2 px-4 rounded-lg shadow bg-red-500 hover:bg-red-600 text-white"
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
                className="bg-blue-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-600 transition"
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
                            className={`py-2 px-4 rounded-lg shadow transition ${
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
                            className="py-2 px-4 rounded-lg shadow bg-red-500 hover:bg-red-600 text-white"
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
                  className="mt-4 py-2 px-4 rounded-lg shadow bg-gray-500 hover:bg-gray-600 text-white"
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
