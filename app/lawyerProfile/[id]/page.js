import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase'; 
import { firestore } from "../lib/firebase";
import { FaEdit, FaTrash } from 'react-icons/fa'; 

const LawyerProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchLawyer = async () => {
        try {
          const doc = await db.collection('lawyers').doc(id).get();
          if (doc.exists) {
            setLawyer(doc.data());
          } else {
            console.log('No such profile!');
          }
        } catch (error) {
          console.error('Error fetching document: ', error);
        } finally {
          setLoading(false);
        }
      };

      fetchLawyer();
    }
  }, [id]);

  const handleEdit = () => {
    router.push(`/editLawyer/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        await db.collection('lawyers').doc(id).delete();
        alert("Profile deleted!");
        router.push('/lawyers');
      } catch (error) {
        console.error('Error deleting document: ', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!lawyer) return <div>No Profile found</div>;

  return (
    <div className="mt-4 p-8 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Lawyer Details</h1>
      <p><strong>Full Name:</strong> {lawyer.lawyerName}</p>
      <p><strong>Age:</strong> {lawyer.age}</p>
      <p><strong>NIC No:</strong> {lawyer.nic}</p>
      <p><strong>University:</strong> {lawyer.university}</p>
      <p><strong>Experience in Years:</strong> {lawyer.experienceYears}</p>
      {lawyer.certificate && (
        <p><strong>Certificate:</strong> <a href={lawyer.certificate} target="_blank" rel="noopener noreferrer">View Certificate</a></p>
      )}
      <p><strong>Previous Experiences:</strong></p>
      <ul>
        {lawyer.prevExperiences.map((exp, index) => (
          <li key={index}>{exp}</li>
        ))}
      </ul>
      {lawyer.profilePic && (
        <p><strong>Profile Picture:</strong> <img src={lawyer.profilePic} alt="Profile" className="w-32 h-32 rounded-full" /></p>
      )}
      <p><strong>Contact No:</strong> {lawyer.contactNo}</p>
      <div className="mt-4 flex space-x-4">
        <button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <FaEdit /> Edit
        </button>
        <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
};

export default LawyerProfile;
