"use client";
import React, { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { auth, firestore } from "../lib/firebase";
import Link from "next/link";

const lawCategories = [
  "Criminal Law",
  "Family Law",
  "Personal Injury",
  "Real Estate Law",
  "Business Law",
  "Intellectual Property Law",
  "Employment Law",
  "Immigration Law",
  "Other"
];

const AddInquiry = () => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [problem, setProblem] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // New state for status messages

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user)); // Store user in localStorage
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('user'); // Remove user from localStorage
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to submit an inquiry.");
      return;
    }
    setLoading(true); // Start loading
    try {
      const inquiriesCollection = collection(firestore, "inquiries");
      await addDoc(inquiriesCollection, {
        title,
        location,
        problem,
        email,
        phone,
        category,
        userId: user.uid,
        userName: user.displayName,
        createdAt: new Date(),
        found: false // Initialize status
      });
      setTitle("");
      setLocation("");
      setProblem("");
      setEmail("");
      setPhone("");
      setCategory("");
      setStatus("Inquiry submitted successfully!"); // Set success message
    } catch (error) {
      console.error("Error adding inquiry:", error.message);
      setStatus("Failed to submit inquiry. Please try again."); // Set error message
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="container mx-auto">
        {user ? (
          <div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white p-2 rounded-md mb-4"
            >
              Sign Out
            </button>
            <h1 className="text-2xl font-semibold mb-4">Submit Inquiry</h1>
            <Link href={"/"}>Back to homepage!</Link>
            <br/><br/>
            {status && (
              <div
                className={`p-4 mb-4 text-white rounded-md ${
                  status.includes("success") ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {status}
              </div>
            )}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location (Ex: Colombo)"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Describe your problem"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email (Optional)"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your Phone"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select Law Category</option>
                  {lawCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full p-2 rounded-md text-white ${
                    loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {loading ? "Submitting..." : "Submit Inquiry"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={handleSignInWithGoogle}
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              Sign In with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddInquiry;
