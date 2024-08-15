"use client";
import { useState, useEffect } from 'react';
import { firestore,auth } from './lib/firebase';
import { useAuth } from './context/AuthContext';

const Home = () => {
  const [inquiries, setInquiries] = useState([]);
  const [problem, setProblem] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signInWithGoogle, logout } = useAuth();

  useEffect(() => {
    const fetchInquiries = async () => {
      setLoading(true);
      const snapshot = await firestore.collection('inquiries').get();
      const inquiriesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInquiries(inquiriesList);
      setLoading(false);
    };

    fetchInquiries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to submit an inquiry.');
      return;
    }
    await firestore.collection('inquiries').add({
      problem,
      email,
      phone,
      userId: user.uid,
      createdAt: new Date()
    });
    setProblem('');
    setEmail('');
    setPhone('');
    setInquiries([...inquiries, { problem, email, phone }]);
  };

  return (
    <div>
      <h1>Law Inquiries</h1>
      {!user ? (
        <div>
          <button onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
      ) : (
        <div>
          <button onClick={logout}>Logout</button>
          <form onSubmit={handleSubmit}>
            <textarea value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="Describe your problem" required />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" required />
            <button type="submit">Add Inquiry</button>
          </form>
        </div>
      )}
      <h2>Existing Inquiries</h2>
      {loading ? <p>Loading...</p> : (
        <ul>
          {inquiries.map(inquiry => (
            <li key={inquiry.id}>
              <p>{inquiry.problem}</p>
              <p>Email: {inquiry.email}</p>
              <p>Phone: {inquiry.phone}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
