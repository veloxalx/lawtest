"use client";
import React, { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
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
  "Other",
];

const Home = () => {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupSelectedCategory, setPopupSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let updatedListings = listings;

    if (selectedCategory) {
      updatedListings = updatedListings.filter(
        (listing) => listing.category === selectedCategory
      );
    }

    if (searchTerm) {
      updatedListings = updatedListings.filter((listing) =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredListings(updatedListings);
  }, [selectedCategory, searchTerm, listings]);

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

  const handleMarkAsOccupied = async (listingId) => {
    try {
      const listingDoc = doc(firestore, "inquiries", listingId);
      await updateDoc(listingDoc, { found: true });
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

  const handleDeleteListing = async (listingId) => {
    try {
      const listingDoc = doc(firestore, "inquiries", listingId);
      await deleteDoc(listingDoc);
      setListings(listings.filter((listing) => listing.id !== listingId));
      setFilteredListings(
        filteredListings.filter((listing) => listing.id !== listingId)
      );
    } catch (error) {
      console.error("Error deleting listing:", error.message);
    }
  };

  return (
    <div className="p-3 max-w-8xl  mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Law Listings ⚖️</h1>
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
          className="mt-4 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 "
          style={{height:"40px",margin:"20px",width:"80vw",boxShadow:"inherit"}}
        >
          <option value="">All Categories</option>
          {lawCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <label
          htmlFor="search-input"
          className="block text-sm font-medium text-gray-700 mt-4"
        >
          Search
        </label>
        <input
          id="search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title..."
          className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          style={{height:"40px",margin:"20px",width:"80vw",boxShadow:"inherit"}}
        />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <h1>Loading...</h1>
        ) : filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <div
              key={listing.id}
              className={`border border-gray-200 rounded-lg p-6 h-400 shadow-lg ${
                listing.found
                  ? "bg-green-100"
                  : lawCategories.includes(listing.category)
                  ? "bg-yellow-100"
                  : "bg-white"
              }`}
            >
              <h4 className="text-xl font-semibold">{listing.title}</h4>
              <p>
                <strong>Location:</strong> {listing.location}
              </p>
              <p>
                <strong>Description:</strong> {listing.problem}
              </p>
              <p>
                <strong>Email:</strong> {listing.email || "Not provided"}
              </p>
              <p>
                <strong>Phone:</strong> {listing.phone || "Not provided"}
              </p>
              {user && (
                <div className="mt-4">
                  <button
                    onClick={() => handleMarkAsOccupied(listing.id)}
                    className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 transition mr-2"
                    disabled={listing.found}
                  >
                    Mark as Occupied
                  </button>
                  <button
                    onClick={() => handleDeleteListing(listing.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded shadow hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <h1>No listings found</h1>
        )}
      </div>
    </div>
  );
};

export default Home;
