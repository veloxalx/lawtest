"use client";
import React, { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
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
  const [popupSelectedCategory, setPopupSelectedCategory] = useState("");

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
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const handleMarkAsOccupied = async (listingId) => {
    try {
      const listingDoc = doc(firestore, "inquiries", listingId);
      await updateDoc(listingDoc, { found: true });
      setListings(listings.map((listing) =>
        listing.id === listingId ? { ...listing, found: true } : listing
      ));
      setFilteredListings(filteredListings.map((listing) =>
        listing.id === listingId ? { ...listing, found: true } : listing
      ));
    } catch (error) {
      console.error("Error marking listing as occupied:", error.message);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const listingDoc = doc(firestore, "inquiries", listingId);
      await deleteDoc(listingDoc);
      setListings(listings.filter((listing) => listing.id !== listingId));
      setFilteredListings(filteredListings.filter((listing) => listing.id !== listingId));
    } catch (error) {
      console.error("Error deleting listing:", error.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
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
          style={{marginBottom:"40px"}}
        >
          How to (Guide)
        </Link>
        <br/><br/>
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
        {loading ? <h1>Loading...</h1> : filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <div
              key={listing.id}
              className={`border border-gray-200 rounded-lg p-4 shadow-sm ${
                listing.found ? "bg-green-100" : lawCategories.includes(listing.category) ? "bg-yellow-100" : "bg-white"
              }`}
            >
              <h4 className="text-xl font-semibold">{listing.title}</h4>
              <p><strong>Location:</strong> {listing.location}</p>
              <p><strong>Description:</strong> {listing.problem}</p>
              <p><strong>Email:</strong> {listing.email || "Not provided"}</p>
              <p><strong>Phone:</strong> {listing.phone || "Not provided"}</p>
              <p><strong>Category:</strong> {listing.category}</p>
              <p><strong></strong> <b>{listing.found && "Occupied"}</b></p>
              {user && user.uid === listing.userId && (
                <div className="mt-2 space-x-2">
                  {!listing.found && (
                    <button
                      onClick={() => handleMarkAsOccupied(listing.id)}
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
                    >
                      Mark as Occupied
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteListing(listing.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <h2>No Listings Found</h2>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b">
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition"
              >
                ✖
              </button>
              <h3 className="text-xl font-semibold">Your Listings</h3>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label htmlFor="popup-category-filter" className="block text-sm font-medium text-gray-700">
                  Filter by Category
                </label>
                <select
                  id="popup-category-filter"
                  value={popupSelectedCategory}
                  onChange={(e) => setPopupSelectedCategory(e.target.value)}
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
              <div className="space-y-4">
                {listings
                  .filter(listing => listing.userId === user.uid)
                  .filter(listing => popupSelectedCategory ? listing.category === popupSelectedCategory : true)
                  .length > 0 ? (
                  listings
                    .filter(listing => listing.userId === user.uid)
                    .filter(listing => popupSelectedCategory ? listing.category === popupSelectedCategory : true)
                    .map((listing) => (
                      <div
                        key={listing.id}
                        className={`border border-gray-200 rounded-lg p-4 shadow-sm ${
                          listing.found ? "bg-green-100" : "bg-white"
                        }`}
                      >
                        <h4 className="text-xl font-semibold">{listing.title}</h4>
                        <p><strong>Location:</strong> {listing.location}</p>
                        <p><strong>Description:</strong> {listing.problem}</p>
                        <p><strong>Email:</strong> {listing.email || "Not provided"}</p>
                        <p><strong>Phone:</strong> {listing.phone || "Not provided"}</p>
                        <p><strong>Category:</strong> {listing.category}</p>
                        <p><strong></strong> <b>{listing.found && "Occupied"}</b></p>
                        <div className="mt-2 space-x-2">
                          {!listing.found && (
                            <button
                              onClick={() => handleMarkAsOccupied(listing.id)}
                              className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
                            >
                              Mark as Occupied
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteListing(listing.id)}
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                ) : (
                  <h2>You haven't added any listings yet.</h2>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;