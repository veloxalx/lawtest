import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { firestore } from "../lib/firebase";



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
            <p><strong>Certificate:</strong> <a href={URL.createObjectURL(lawyer.certificate)} target="_blank" rel="noopener noreferrer">View Certificate</a></p>
          )}
          <p><strong>Previous Experiences:</strong></p>
          <ul>
            {lawyer.prevExperiences.map((exp, index) => (
              <li key={index}>{exp}</li>
            ))}
          </ul>
          {lawyer.profilePic && (
            <p><strong>Profile Picture:</strong> <img src={URL.createObjectURL(lawyer.profilePic)} alt="Profile" className="w-32 h-32 rounded-full" /></p>
          )}
          <p><strong>Contact No:</strong> {lawyer.contactNo}</p>
        </div>
      );
    };
    
export default LawyerProfile