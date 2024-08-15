"use client";
import React, { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, firestore } from "./lib/firebase";
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

const Home = () => {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);

    const fetchListings = async () => {
      setLoading(true);
      try {
        const listingsCollection = collection(firestore, "inquiries");
        const snapshot = await getDocs(listingsCollection);
        const listingsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setListings(listingsList);
        setFilteredListings(listingsList);
      } catch (error) {
        console.error("Error fetching listings:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredListings(
        listings.filter((listing) => listing.category === selectedCategory)
      );
    } else {
      setFilteredListings(listings);
    }
  }, [selectedCategory, listings]);

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

  const handleDelete = async (listingId) => {
    try {
      const listingDoc = doc(firestore, "inquiries", listingId);
      await deleteDoc(listingDoc);
      // Refresh the listings list
      setListings(listings.filter((listing) => listing.id !== listingId));
      setFilteredListings(filteredListings.filter((listing) => listing.id !== listingId));
    } catch (error) {
      console.error("Error deleting listing:", error.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Law Listings ⚖️</h1>

      <div className="text-center mb-4">
        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700">
          Filter by Category
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        >
          <option value="">All Categories</option>
          {lawCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="text-center mb-4">
        {!user ? (
          <div>
            <h2 className="text-xl mb-4">Login to Add Your Listings 👇</h2>
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
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded shadow hover:bg-red-600 transition mb-4"
            >
              Logout
            </button>
            <div className="mb-4">
              <Link
                href={"/add"}
                className="bg-green-500 text-white py-2 px-4 rounded shadow hover:bg-green-600 transition"
              >
                Add Listing
              </Link>
            </div>
            <button
              onClick={() => setShowPopup(!showPopup)}
              className="bg-gray-500 text-white py-2 px-4 rounded shadow hover:bg-gray-600 transition"
            >
              Manage Your Listings
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <div
              key={listing.id}
              className={`border border-gray-200 rounded-lg p-4 shadow-sm ${
                lawCategories.includes(listing.category) ? "bg-yellow-100" : "bg-white"
              }`}
            >
              <h4 className="text-xl font-semibold">{listing.title}</h4>
              <p><strong>Location:</strong> {listing.location}</p>
              <p><strong>Description:</strong> {listing.problem}</p>
              <p><strong>Email:</strong> {listing.email || "Not provided"}</p>
              <p><strong>Phone:</strong> {listing.phone || "Not provided"}</p>
              <p><strong>Category:</strong> {listing.category}</p>
              {user && user.uid === listing.userId && (
                <button
                  onClick={() => handleDelete(listing.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded mt-2 hover:bg-red-600 transition"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <h2>No Listings Found</h2>
        )}
      </div>

      {showPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-4 relative w-full sm:w-96">
      <button
        onClick={() => setShowPopup(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition"
      >
        ✖
      </button>
      <h3 className="text-xl font-semibold mb-4">Your Listings</h3>
      <div className="mb-4">
        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700">
          Filter by Category
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        >
          <option value="">All Categories</option>
          {lawCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <ul className="space-y-4">
        {user && filteredListings.length > 0 ? (
          filteredListings
            .filter((listing) => listing.userId === user.uid)
            .map((listing) => (
              <li key={listing.id} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
                <h4 className="text-xl font-semibold">{listing.title}</h4>
                <p><strong>Location:</strong> {listing.location}</p>
                <p><strong>Description:</strong> {listing.problem}</p>
                <p><strong>Email:</strong> {listing.email || "Not provided"}</p>
                <p><strong>Phone:</strong> {listing.phone || "Not provided"}</p>
                <p><strong>Category:</strong> {listing.category}</p>
                <button
                  onClick={() => handleDelete(listing.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded mt-2 hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </li>
            ))
        ) : (
          <p>You have no listings</p>
        )}
      </ul>
    </div>
  </div>
)}

    </div>
  );
};

export default Home;
