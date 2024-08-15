"use client";
import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, firestore } from "./lib/firebase";
import Link from "next/link";

const Home = () => {
  const [user, setUser] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [problem, setProblem] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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
    return () => unsubscribe(); // Cleanup subscription on unmount
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
        userId: user.uid,
        userName: user.displayName,
        createdAt: new Date(),
      });
      setTitle("");
      setLocation("");
      setProblem("");
      setEmail("");
      setPhone("");
      // Refresh the inquiries list
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
      // Refresh the inquiries list
      setInquiries(inquiries.filter((inquiry) => inquiry.id !== inquiryId));
    } catch (error) {
      console.error("Error deleting inquiry:", error.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => alert("Copied to clipboard!"),
      (err) => console.error("Failed to copy: ", err)
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Law Inquiries ⚖️</h1>

      {!user ? (
        <div className="text-center">
          <h2 className="text-xl mb-4">Login to Add Your Listings 👇</h2>
          <button
            onClick={handleSignInWithGoogle}
            className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 transition"
          >
            Sign in with Google
          </button>
        </div>
      ) : (
        <div className="text-center mt-8">
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
              Add Inquiry
            </Link>
          </div>
          <button
            onClick={() => setShowPopup(!showPopup)}
            className="bg-gray-500 text-white py-2 px-4 rounded shadow hover:bg-gray-600 transition"
          >
            Manage Your Inquiries
          </button>
          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-4 relative">
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition"
                >
                  ✖
                </button>
                <h3 className="text-xl font-semibold mb-4">Your Inquiries</h3>
                <ul className="space-y-4">
                  {user && inquiries && inquiries.length ? (
                    inquiries
                      .filter((inquiry) => inquiry.userId === user.uid)
                      .map((inquiry) => (
                        <li key={inquiry.id} className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
                          <p><strong>Title:</strong> {inquiry.title}</p>
                          <p><strong>Location:</strong> {inquiry.location}</p>
                          <p><strong>Problem:</strong> {inquiry.problem}</p>
                          <p>
                            <strong>Email:</strong>{" "}
                            <span
                              className="text-blue-500 cursor-pointer hover:underline"
                              onClick={() => copyToClipboard(inquiry.email)}
                            >
                              {inquiry.email}
                            </span>
                          </p>
                          <p>
                            <strong>Phone:</strong>{" "}
                            <span
                              className="text-blue-500 cursor-pointer hover:underline"
                              onClick={() => copyToClipboard(inquiry.phone)}
                            >
                              {inquiry.phone}
                            </span>
                          </p>
                          <button
                            onClick={() => handleDelete(inquiry.id)}
                            className="bg-red-500 text-white py-1 px-3 rounded mt-2 hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </li>
                      ))
                  ) : (
                    <h1>{user ? "No Inquiries Added" : "Please log in to see inquiries"}</h1>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Existing Inquiries</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-4">
            {inquiries.length ? (
              inquiries.map((inquiry) => (
                <li key={inquiry.id} className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
                  <h3 className="text-lg font-semibold mb-2">Name: {inquiry.userName}</h3>
                  <p><strong>Title:</strong> {inquiry.title}</p>
                  <p><strong>Location:</strong> {inquiry.location}</p>
                  <p><strong>Problem:</strong> {inquiry.problem}</p>
                  <p>
                    <strong>Email:</strong>{" "}
                    <span
                      className="text-blue-500 cursor-pointer hover:underline"
                      onClick={() => copyToClipboard(inquiry.email)}
                    >
                      {inquiry.email}
                    </span>
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    <span
                      className="text-blue-500 cursor-pointer hover:underline"
                      onClick={() => copyToClipboard(inquiry.phone)}
                    >
                      {inquiry.phone}
                    </span>
                  </p>
                </li>
              ))
            ) : (
              <h1>No Inquiries Posted Yet</h1>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
