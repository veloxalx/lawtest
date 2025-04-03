"use client";
import React, { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, firestore } from "../lib/firebase";
import Link from "next/link";

// Define a list of valid locations in Sri Lanka
const sriLankaLocations = [
  "Colombo",
  "Galle",
  "Kandy",
  "Jaffna",
  "Nuwara Eliya",
  "Trincomalee",
  "Batticaloa",
  "Anuradhapura",
  "Polonnaruwa",
  "Ratnapura",
  "Matara",
  "Kurunegala",
  "Badulla",
  "Hambantota",
  "Ampara",
  "Puttalam",
  "Mannar",
  "Vavuniya",
  "Kalutara",
  "Monaragala",
  "Kegalle",
  "Remote", // Optional: For remote work opportunities
];

const projectCategories = [
  "Web Development",
  "Mobile App Development",
  "Graphic Design",
  "Content Writing",
  "Digital Marketing",
  "Video Production",
  "Translation",
  "Data Entry",
  "Accounting",
  "Other",
];

const AddProject = () => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState(""); // Location will now be selected from a dropdown
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setTimeout(() => setStatus(""), 6000);
  }, [status]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

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

  const handleAddProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      // Parse budget to number if it's provided
      const budgetValue = budget ? parseInt(budget, 10) : null;
      await addDoc(collection(firestore, "projects"), {
        title,
        location,
        description,
        budget: budgetValue,
        category,
        userId: user.uid,
        completed: false,
        createdAt: new Date().toISOString(),
      });
      setTitle("");
      setLocation("");
      setDescription("");
      setBudget("");
      setCategory("");
      setStatus("Project added successfully!");
    } catch (error) {
      console.error("Error adding project:", error.message);
      setStatus("Failed to add project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-8">
            <h1 className="text-2xl font-bold text-center text-white">
              Post a New Project
            </h1>
          </div>
          <div className="p-6">
            {!user ? (
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold mb-6">
                  Sign in to Post a Project
                </h2>
                <button
                  onClick={handleSignInWithGoogle}
                  className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Sign in with Google
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    {user.photoURL && (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="h-12 w-12 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.displayName}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
                {status && (
                  <div className={`p-4 rounded-md ${
                    status.startsWith("Failed")
                      ? "bg-red-50 text-red-700"
                      : "bg-green-50 text-green-700"
                  }`}>
                    <p className="text-sm font-medium">{status}</p>
                  </div>
                )}
                <form onSubmit={handleAddProject} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      >
                        <option value="">Select a Category</option>
                        {projectCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Give your project a clear title"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      >
                        <option value="">Select a Location</option>
                        {sriLankaLocations.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Description
                      </label>
                      <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Describe the project requirements in detail (With Contact Details)"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Budget (in Rs.)
                      </label>
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="Enter your budget in Rupees"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Posting Project...
                        </>
                      ) : (
                        "Post Project"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProject;