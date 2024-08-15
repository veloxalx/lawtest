"use client";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { auth, firestore } from "../lib/firebase";
import { useRouter } from "next/router";

import Link from "next/link";

const AddInquiry = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [problem, setProblem] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = auth.currentUser;

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to submit an inquiry.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const inquiriesCollection = collection(firestore, "inquiries");
      await addDoc(inquiriesCollection, {
        title,
        location,
        problem,
        email,
        phone,
        userId: user.uid,
        userName: user.displayName,
        createdAt: new Date(),
      });
      setTitle("");
      setLocation("");
      setProblem("");
      setEmail("");
      setPhone("");
      router.push("/"); // Redirect to the home page after submission
    } catch (error) {
      console.error("Error adding inquiry:", error.message);
      setError("Error adding inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <b>If it says "Error , couldn't add" , don't panick it's a temporary bug! (Check the homepage , your inquiry will be there!)</b>
      <Link href={"/"} className="text-blue-500 hover:underline mb-4">
        &larr; Go back home
      </Link>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-semibold mb-4">Add Inquiry</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
  );
};

export default AddInquiry;
