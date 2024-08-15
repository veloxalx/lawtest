"use client";
import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
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
  "Other"
];

const Home = () => {
  const [user, setUser] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [problem, setProblem] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);

    const fetchInquiries = async () => {
      setLoading(true);
      try {
        const inquiriesCollection = collection(firestore, "inquiries");
        const snapshot = await getDocs(inquiriesCollection);
        const inquiriesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInquiries(inquiriesList);
      } catch (error) {
        console.error("Error fetching inquiries:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
    return () => unsubscribe();
  }, []);

  const handleSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to submit an inquiry.");
      return;
    }
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
        found: false // New field to manage inquiry status
      });
      setTitle("");
      setLocation("");
      setProblem("");
      setEmail("");
      setPhone("");
      setCategory("");
      setFilterCategory(""); // Reset filter
      const snapshot = await getDocs(inquiriesCollection);
      const inquiriesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInquiries(inquiriesList);
    } catch (error) {
      console.error("Error adding inquiry:", error.message);
    }
  };

  const handleDelete = async (inquiryId) => {
    try {
      const inquiryDoc = doc(firestore, "inquiries", inquiryId);
      await deleteDoc(inquiryDoc);
      setInquiries((prevInquiries) =>
        prevInquiries.filter((inquiry) => inquiry.id !== inquiryId)
      );
    } catch (error) {
      console.error("Error deleting inquiry:", error.message);
    }
  };

  const handleToggleFound = async (inquiryId, currentStatus) => {
    try {
      const inquiryDoc = doc(firestore, "inquiries", inquiryId);
      await updateDoc(inquiryDoc, { found: !currentStatus });
      setInquiries((prevInquiries) =>
        prevInquiries.map((inquiry) =>
          inquiry.id === inquiryId ? { ...inquiry, found: !currentStatus } : inquiry
        )
      );
    } catch (error) {
      console.error("Error updating inquiry:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        {user ? (
          <div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white p-2 rounded-md mb-4"
            >
              Sign Out
            </button>
            <h1 className="text-2xl font-semibold mb-4">Welcome, {user.displayName}</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
              <h2 className="text-xl font-semibold mb-2">Submit Inquiry</h2>
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
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Inquiries</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Filter by Category:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {lawCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul className="space-y-4">
                {inquiries
                  .filter(inquiry => !filterCategory || inquiry.category === filterCategory)
                  .map((inquiry) => (
                    <li key={inquiry.id} className="border-b border-gray-300 pb-4">
                      <h3 className="text-lg font-semibold">{inquiry.title}</h3>
                      <p><strong>Location:</strong> {inquiry.location}</p>
                      <p><strong>Problem:</strong> {inquiry.problem}</p>
                      <p><strong>Email:</strong> {inquiry.email || "N/A"}</p>
                      <p><strong>Phone:</strong> {inquiry.phone}</p>
                      <p><strong>Category:</strong> {inquiry.category}</p>
                      <p><strong>Status:</strong> {inquiry.found ? "Found" : "Not Found"}</p>
                      <div className="mt-2">
                        <button
                          onClick={() => handleToggleFound(inquiry.id, inquiry.found)}
                          className={`mr-2 px-4 py-2 rounded-md text-white ${
                            inquiry.found ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          {inquiry.found ? "Mark as Not Found" : "Mark as Found"}
                        </button>
                        <button
                          onClick={() => handleDelete(inquiry.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-md"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
