"use client";
import React, { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { auth, firestore } from "./lib/firebase";
import Link from "next/link";
import Image from 'next/image';

const lawCategories = [
  "Criminal Law",
  "Family Law",
  "Personal Injury",
  "Real Estate Law",
  "Business Law",
  "Intellectual Property Law",
  "Employment Law",
  "Immigration Law",
  "Other",
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
      localStorage.setItem("user", JSON.stringify(user)); // Store user in localStorage
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("user"); // Remove user from localStorage
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const handleMarkAsOccupied = async (listingId) => {
    try {
      const listingDoc = doc(firestore, "inquiries", listingId);
      await updateDoc(listingDoc, { found: true });
      // Refresh the listings list
      setListings(
        listings.map((listing) =>
          listing.id === listingId ? { ...listing, found: true } : listing
        )
      );
      setFilteredListings(
        filteredListings.map((listing) =>
          listing.id === listingId ? { ...listing, found: true } : listing
        )
      );
    } catch (error) {
      console.error("Error marking listing as occupied:", error.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Law Listings ⚖️</h1>
      <Link
        href={"/how"}
        className="bg-green-500 text-white py-2 px-4 rounded shadow hover:bg-green-600 transition"
      >
        How it works
      </Link>
      <br /> <br />
      <div className="text-center mb-4">
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

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="space-y-4">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white p-4 rounded-lg shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
              <p className="text-gray-700 mb-2">{listing.description}</p>
              <p className="text-gray-700 mb-2">Category: {listing.category}</p>
              <p className="text-gray-700 mb-2">
                Status:{" "}
                {listing.found ? (
                  <span className="text-green-600">Occupied</span>
                ) : (
                  <span className="text-yellow-600">Open</span>
                )}
              </p>
              {!listing.found && user && (
                <button
                  onClick={() => handleMarkAsOccupied(listing.id)}
                  className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 transition"
                >
                  Mark as Occupied
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
