"use client";
import React, { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, firestore } from "../lib/firebase";
import Link from "next/link";
import Image from "next/image";

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

const AddProblem = () => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [problem, setProblem] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setTimeout(() => setStatus(""), 6000);
  }, [status]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
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

  const handleAddProblem = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      await addDoc(collection(firestore, "problems"), {
        title,
        location,
        problem,
        email,
        phone,
        category,
        userId: user.uid,
        found: false,
        urgent,
        createdAt: new Date().toISOString(),
      });
      setTitle("");
      setLocation("");
      setProblem("");
      setEmail("");
      setPhone("");
      setCategory("");
      setUrgent(false);
      setStatus("Problem added successfully!");
    } catch (error) {
      console.error("Error adding problem:", error.message);
      setStatus("Failed to add problem. Please try again.");
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
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
            <h1 className="text-2xl font-bold text-center text-white">
              Submit a New Problem
            </h1>
          </div>

          <div className="p-6">
            {!user ? (
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold mb-6">
                  Sign in to Submit a Problem
                </h2>
                <button
                  onClick={handleSignInWithGoogle}
                  className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Image
                    src="/google-logo.png"
                    alt="Google"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Sign in with Google
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={user?.photoURL || "/default-avatar.png"}
                      alt="Profile"
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
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

                <form onSubmit={handleAddProblem} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Select a Category</option>
                        {problemCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Brief title for your problem"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Where is this problem located?"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Problem Description
                      </label>
                      <textarea
                        rows={4}
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Describe your problem in detail"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter Your Email"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        placeholder="Enter Your Phone Number"
                        onChange={(e) => setPhone(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={urgent}
                          onChange={(e) => setUrgent(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                          Mark as urgent
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Adding Problem...
                        </>
                      ) : (
                        "Submit Problem"
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

export default AddProblem;