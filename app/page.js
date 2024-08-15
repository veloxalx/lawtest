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

  return (
    <div>
      <h1>Law Inquiries</h1>

      {!user ? (
        <div>
          <button onClick={handleSignInWithGoogle}>Sign in with Google</button>
        </div>
      ) : (
        <div style={{ margin: "40px" }}>
          <img
            src={user?.photoURL || "/default-avatar.png"}
            alt="User Profile"
            className="w-full h-full rounded-full object-cover"
          />
          <h1 style={{ textAlign: "left", margin: "40px" }}>
            Welcome back {user?.displayName} 👋
          </h1>
          <button onClick={handleLogout}>Logout</button>
          <Link href={"/add"}>Add Inquiry</Link>
          <button onClick={() => setShowPopup(!showPopup)}>
            Manage Your Inquiries
          </button>
          {showPopup && (
            <div className="popup" style={{ margin: "40px" }}>
              <button onClick={() => setShowPopup(false)}>Close</button>
              <h3>Your Inquiries</h3>
              <ul>
                {inquiries && inquiries?.length ? (
                  inquiries
                    .filter((inquiry) => inquiry.userId === user.uid)
                    .map((inquiry) => (
                      <li key={inquiry.id}>
                        <p>
                          <strong>Title:</strong> {inquiry.title}
                        </p>
                        <p>
                          <strong>Location:</strong> {inquiry.location}
                        </p>
                        <p>
                          <strong>Problem:</strong> {inquiry.problem}
                        </p>
                        <p>
                          <strong>Email:</strong> {inquiry.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {inquiry.phone}
                        </p>
                        <button onClick={() => handleDelete(inquiry.id)}>
                          Delete
                        </button>
                      </li>
                    ))
                ) : (
                  <h1>No Inquiries Added</h1>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      <h2>Existing Inquiries</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {inquiries.length ? (
            inquiries.map((inquiry) => (
              <li key={inquiry.id} style={{ margin: "100px" }}>
                <p>
                  <strong>Title:</strong> {inquiry.title}
                </p>
                <p>
                  <strong>Location:</strong> {inquiry.location}
                </p>
                <p>
                  <strong>Problem:</strong> {inquiry.problem}
                </p>
                <p>
                  <strong>Email:</strong> {inquiry.email}
                </p>
                <p>
                  <strong>Phone:</strong> {inquiry.phone}
                </p>
              </li>
            ))
          ) : (
            <h1>No Inquiries Posted Yet</h1>
          )}
        </ul>
      )}
    </div>
  );
};

export default Home;
