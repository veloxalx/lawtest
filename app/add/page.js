"use client";
import React, { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, firestore } from "../lib/firebase";
import Link from "next/link";

// Define Sri Lankan locations
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
  "Nationwide", // For issues affecting the entire country
];

// Infrastructure categories
const infrastructureCategories = [
  "Transportation & Roads",
  "Public Transport",
  "Water Supply & Sanitation",
  "Electricity & Power",
  "Internet & Telecommunications",
  "Healthcare Facilities",
  "Education & Schools",
  "Waste Management",
  "Parks & Recreation",
  "Housing & Urban Planning",
  "Agriculture & Irrigation",
  "Environmental Protection",
  "Digital Government Services",
  "Emergency Services",
  "Other",
];

// SME Challenge categories
const smeCategories = [
  "Access to Finance",
  "Digital Infrastructure",
  "Export & Trade",
  "Skills & Training",
  "Regulatory Compliance",
  "Technology Adoption",
  "Market Access",
  "Supply Chain",
  "Energy & Utilities",
  "Workspace & Facilities",
  "Innovation Support",
  "Other",
];

const CivicPlatform = () => {
  const [user, setUser] = useState(null);
  const [submissionType, setSubmissionType] = useState("infrastructure"); // infrastructure or sme
  const [title, setTitle] = useState("");
  const [contact, setContact] = useState(""); 
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [proposedSolution, setProposedSolution] = useState("");
  const [category, setCategory] = useState("");
  const [urgency, setUrgency] = useState("");
  const [affectedPeople, setAffectedPeople] = useState("");
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
      // Note: localStorage is not used in this version as per artifact guidelines
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const handleSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const collectionName = submissionType === "infrastructure" ? "infrastructure_suggestions" : "sme_challenges";
      
      await addDoc(collection(firestore, collectionName), {
        title,
        location,
        description,
        proposedSolution,
        category,
        urgency,
        affectedPeople: affectedPeople ? parseInt(affectedPeople, 10) : null,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        status: "pending_review",
        contact,
        submissionType,
        createdAt: new Date().toISOString(),
        votes: 0,
        comments: [],
      });
      
      // Reset form
      setTitle("");
      setLocation("");
      setDescription("");
      setProposedSolution("");
      setCategory("");
      setUrgency("");
      setAffectedPeople("");
      setContact("");
      
      setStatus(submissionType === "infrastructure" 
        ? "Infrastructure suggestion submitted successfully! 🏗️" 
        : "SME challenge submitted successfully! 💼");
    } catch (error) {
      console.error("Error submitting:", error.message);
      setStatus("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentCategories = submissionType === "infrastructure" ? infrastructureCategories : smeCategories;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🇱🇰 Sri Lanka Development Platform
          </h1>
          <p className="text-lg text-gray-600">
            Your voice matters! Share ideas to improve Sri Lanka's infrastructure and support SMEs
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setSubmissionType("infrastructure")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  submissionType === "infrastructure"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                🏗️ Infrastructure Suggestions
              </button>
              <button
                onClick={() => setSubmissionType("sme")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  submissionType === "sme"
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                💼 SME Challenges
              </button>
            </nav>
          </div>

          <div className="p-6">
            {!user ? (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="text-6xl mb-4">🚀</div>
                  <h2 className="text-2xl font-semibold mb-2">
                    Join the Movement for Change
                  </h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Sign in to share your ideas and help build a better Sri Lanka for everyone
                  </p>
                </div>
                <button
                  onClick={handleSignInWithGoogle}
                  className="inline-flex items-center px-8 py-3 bg-white border-2 border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* User Profile */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    {user.photoURL && (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="h-12 w-12 rounded-full border-2 border-blue-200"
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

                {/* Status Message */}
                {status && (
                  <div className={`p-4 rounded-lg border ${
                    status.startsWith("Failed")
                      ? "bg-red-50 border-red-200 text-red-700"
                      : "bg-green-50 border-green-200 text-green-700"
                  }`}>
                    <p className="font-medium">{status}</p>
                  </div>
                )}

                {/* Form Header */}
                <div className="text-center py-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {submissionType === "infrastructure" 
                      ? "🏗️ Suggest Infrastructure Improvements" 
                      : "💼 Report SME Challenges"}
                  </h3>
                  <p className="text-gray-600">
                    {submissionType === "infrastructure"
                      ? "Help identify and solve infrastructure problems in Sri Lanka"
                      : "Share challenges faced by Small & Medium Enterprises"}
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Category */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a Category</option>
                        {currentCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Title */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={submissionType === "infrastructure" 
                          ? "e.g., Poor road conditions in Kurunegala city center"
                          : "e.g., Difficulty accessing business loans for tech startups"}
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Location</option>
                        {sriLankaLocations.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Urgency */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Urgency Level <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value)}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Urgency</option>
                        <option value="low">Low - Long-term improvement</option>
                        <option value="medium">Medium - Needs attention</option>
                        <option value="high">High - Urgent issue</option>
                        <option value="critical">Critical - Immediate action needed</option>
                      </select>
                    </div>

                    {/* Affected People */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Number of People Affected
                      </label>
                      <input
                        type="number"
                        value={affectedPeople}
                        onChange={(e) => setAffectedPeople(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 5000"
                      />
                    </div>

                    {/* Description */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Detailed Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={submissionType === "infrastructure"
                          ? "Describe the infrastructure problem in detail - what's wrong, when it happens, how it affects people..."
                          : "Describe the challenge SMEs face - what barriers exist, how it impacts business growth..."}
                      />
                    </div>

                    {/* Proposed Solution */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Proposed Solution <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        value={proposedSolution}
                        onChange={(e) => setProposedSolution(e.target.value)}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={submissionType === "infrastructure"
                          ? "What's your suggested solution? Be specific about implementation steps, timeline, and resources needed..."
                          : "How do you think the government or relevant authorities can help solve this challenge?"}
                      />
                    </div>

                    {/* Contact */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Information (Optional)
                      </label>
                      <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Phone number or additional contact info"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-6">
                    <button
                      type="button"
                      onClick={handleSubmission}
                      disabled={loading}
                      className={`inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                        submissionType === "infrastructure"
                          ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                          : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                      }`}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          {submissionType === "infrastructure" ? "🏗️ Submit Infrastructure Suggestion" : "💼 Submit SME Challenge"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-3">🏗️ Infrastructure Suggestions</h3>
            <p className="text-gray-600 text-sm mb-4">
              Help identify infrastructure problems and propose solutions for roads, utilities, public transport, and more.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Transportation & road improvements</li>
              <li>• Digital infrastructure needs</li>
              <li>• Public facility upgrades</li>
              <li>• Environmental solutions</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-green-600 mb-3">💼 SME Challenges</h3>
            <p className="text-gray-600 text-sm mb-4">
              Report challenges faced by Small & Medium Enterprises so the government can provide targeted support.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Access to finance & loans</li>
              <li>• Technology & digital barriers</li>
              <li>• Regulatory compliance issues</li>
              <li>• Market access challenges</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CivicPlatform;