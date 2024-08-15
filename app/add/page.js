"use client";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { auth, firestore } from "../lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AddInquiry = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [problem, setProblem] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const user = auth.currentUser;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to submit an inquiry.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const inquiriesCollection = collection(firestore, "inquiries");
      await addDoc(inquiriesCollection, {
        title,
        location,
        problem,
        email,
        phone,
        userId: user.uid,
        userName: user.displayName, // Add userName to the inquiry
        createdAt: new Date(),
      });
      setTitle("");
      setLocation("");
      setProblem("");
      setEmail("");
      setPhone("");
      router.push("/"); // Redirect to the home page or any other page after submission
    } catch (error) {
      console.error("Error adding inquiry:", error.message);
      setError("Error adding inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link href={"/"}>Go back home!</Link>
      <h1>Add Inquiry</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (Ex: Colombo)"
          required
        />
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
          placeholder="Email (Optional), Ideally recommended"
        />
        <input
          type="number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Inquiry"}
        </button>
      </form>
    </div>
  );
};

export default AddInquiry;
