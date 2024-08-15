"use client";
import React, { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, firestore } from "../lib/firebase";
import Link from "next/link";
import Image from "next/image";

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

  const handleAddInquiry = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(""); // Clear status message

    try {
      await addDoc(collection(firestore, "inquiries"), {
        title,
        location,
        problem,
        email,
        phone,
        category,
        userId:user.uid,
        found: false,
      });
      setTitle("");
      setLocation("");
      setProblem("");
      setEmail("");
      setPhone("");
      setCategory("");
      setStatus("Inquiry added successfully!"); // Success message
    } catch (error) {
      console.error("Error adding inquiry:", error.message);
      setStatus("Failed to add inquiry. Please try again."); // Error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Add a New Inquiry</h1>
      <Link
        href={"/"}
        className="bg-gray-500 text-white py-2 px-4 rounded shadow hover:bg-gray-600 transition"
      >
        Back to Home
      </Link>
      <br /> <br />
      <div className="text-center mb-4">
        {!user ? (
          <div>
            <h2 className="text-xl mb-4">Login to Add Your Inquiry 👇</h2>
            <button
              onClick={handleSignInWithGoogle}
              className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 transition"
            >
              Sign in with Google
            </button>
          </div>
        ) : (
          <div>
            <Image
              src={user?.photoURL || "/default-avatar.png"}
              alt="User Profile"
              width={128}
              height={128}
              className="rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl mb-4">Welcome, {user.displayName}!</h2>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded shadow hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleAddInquiry} className="space-y-4">
        

        <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" style={{marginBottom:"40px",marginTop:"20px"}}
          >
            <option value="">Select a Category</option>
            {lawCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
                placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            id="location"
            type="text"
                placeholder="Enter Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="problem" className="block text-sm font-medium text-gray-700">
            Problem Description
          </label>
          <textarea
            id="problem"
            rows="4"
            value={problem}
                placeholder="Enter Problem Description"
            onChange={(e) => setProblem(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
                placeholder="Enter Email Address (Optional)"
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="Enter Phone Number"
            minLength={10}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>

        <div>

        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 transition"
        >
          {loading ? "Adding..." : "Add Inquiry"}
        </button>

        {status && (
          <div className="text-center mt-4">
            <p className={`font-semibold ${status.startsWith("Failed") ? "text-red-500" : "text-green-500"}`}>
              {status}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddInquiry;
