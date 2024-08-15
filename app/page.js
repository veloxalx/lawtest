"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { auth, signInWithPopup, signOut, GoogleAuthProvider } from "./lib/firebase";
import Link from "next/link";

const Home = () => {
  const [user, setUser] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [problem, setProblem] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
        problem,
        email,
        phone,
        userId: user.uid,
        createdAt: new Date(),
      });
      setProblem("");
      setEmail("");
      setPhone("");
      setInquiries([...inquiries, { problem, email, phone, userId: user.uid }]);
    } catch (error) {
      console.error("Error adding inquiry:", error.message);
    }
  };

  const handleDelete = async (inquiryId) => {
    try {
      const inquiryDoc = doc(firestore, "inquiries", inquiryId);
      await deleteDoc(inquiryDoc);
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
        <div>
          <button onClick={handleLogout}>Logout</button>
          <form onSubmit={handleSubmit}>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe your problem"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              required
            />
            <button type="submit">Add Inquiry</button>
          </form>
          <button onClick={() => setShowPopup(!showPopup)}>
            Manage Your Inquiries
          </button>
          {showPopup && (
            <div className="popup">
              <button onClick={() => setShowPopup(false)}>Close</button>
              <h3>Your Inquiries</h3>
              <ul>
                {inquiries.filter(inquiry => inquiry.userId === user.uid).map((inquiry) => (
                  <li key={inquiry.id}>
                    <p>{inquiry.problem}</p>
                    <p>Email: {inquiry.email}</p>
                    <p>Phone: {inquiry.phone}</p>
                    <button onClick={() => handleDelete(inquiry.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <Link href="/add">Add New Inquiry</Link>
      <h2>Existing Inquiries</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {inquiries.length ? inquiries.map((inquiry) => (
            <li key={inquiry.id}>
              <p>{inquiry.problem}</p>
              <p>Email: {inquiry.email}</p>
              <p>Phone: {inquiry.phone}</p>
            </li>
          )) : <h1>No Inquiries Posted Yet</h1>}
        </ul>
      )}
    </div>
  );
};

export default Home;
