"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Community = () => {
  const router = useRouter();
  // const { id } = router.query;
    const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError('Loading timeout, please try again.');
    }, 10000);
    if (!router.isReady) return;

    const { id } = router.query;

    const fetchLawyer = async () => {
      try {
        const response = await fetch(`/api/lawyer/${id}`, { signal });        if (!response.ok) {
          throw new Error('Failed to fetch lawyer details');
        }
        const data = await response.json();
        setLawyer(data);
        clearTimeout(timeoutId);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLawyer();
    }
    return () => clearTimeout(timeoutId); 
  }, [router.isReady, router.query]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;
  }

  if (!lawyer) {
    return <div className="flex justify-center items-center min-h-screen">No lawyer found.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Lawyer Details</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
              <img 
                src={lawyer.profilePic || `/placeholder.svg?height=96&width=96`} 
                alt={lawyer.lawyerName} 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">{lawyer.lawyerName}</h2>
            <p className="text-sm text-gray-600 text-center mb-2">Age: {lawyer.age}</p>
            <p className="text-sm text-gray-600 text-center mb-2">NIC: {lawyer.nic}</p>
            <p className="text-sm text-gray-600 text-center mb-2">University: {lawyer.university}</p>
            <p className="text-sm text-gray-600 text-center mb-2">Experience: {lawyer.experienceYears} years</p>
            <p className="text-sm text-gray-600 text-center mb-2">Contact: {lawyer.contactNo}</p>
            <a 
              href={lawyer.certificatePath} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-blue-500 hover:underline"
            >
              View Certificate
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
