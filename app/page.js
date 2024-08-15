"use client";
import React, { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { collection, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
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
    return () => unsubscribe();
  }, []);

  const handleSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
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

  const handleFilterChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    if (category) {
      setFilteredListings(
        listings.filter((listing) => listing.category === category)
      );
    } else {
      setFilteredListings(listings);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      try {
        await deleteDoc(doc(firestore, "inquiries", id));
        setFilteredListings(filteredListings.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting inquiry:", error.message);
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await updateDoc(doc(firestore, "inquiries", id), {
        found: !currentStatus
      });
      setFilteredListings(
        filteredListings.map((item) =>
          item.id === id ? { ...item, found: !currentStatus } : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error.message);
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
            <h1 className="text-2xl font-semibold mb-4">Inquiries</h1>
            <Link href={"/add"}>Submit New Inquiry</Link>
            <br/><br/>
            <select
              value={selectedCategory}
              onChange={handleFilterChange}
              className="mb-4 p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Categories</option>
              {lawCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-lg">
                {filteredListings.length > 0 ? (
                  filteredListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="border-b border-gray-300 p-4 mb-4"
                    >
                      <h2 className="text-xl font-semibold">{listing.title}</h2>
                      <p className="text-gray-700">{listing.location}</p>
                      <p className="text-gray-600">{listing.problem}</p>
                      <p className="text-gray-500">Email: {listing.email}</p>
                      <p className="text-gray-500">Phone: {listing.phone}</p>
                      <p className="text-gray-500">Category: {listing.category}</p>
                      <p className={`text-sm font-semibold ${listing.found ? "text-green-600" : "text-red-600"}`}>
                        Status: {listing.found ? "Occupied" : "Not Occupied"}
                      </p>
                      <button
                        onClick={() => toggleStatus(listing.id, listing.found)}
                        className="bg-yellow-500 text-white p-2 rounded-md mr-2"
                      >
                        Toggle Status
                      </button>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="bg-red-500 text-white p-2 rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No inquiries found.</p>
                )}
              </div>
            )}
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

export default Home;
