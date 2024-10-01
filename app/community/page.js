"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const CommunityHome = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const response = await fetch("/api/lawyer");
        if (!response.ok) {
          throw new Error("Failed to fetch lawyers");
        }
        const data = await response.json();
        setLawyers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Lawyer Community</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lawyers.map((lawyer) => (
          <div
            key={lawyer._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex flex-col items-center">
                  {" "}
                  <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
                    <img
                      // src={`/placeholder.svg?height=96&width=96`}
                      // alt={lawyer.lawyerName}
                      // className="w-full h-full object-cover"
                    />
                  </div>
                  <Link href={`/community/${lawyer._id}`}>
                <h2 className="text-xl font-semibold text-center mb-2">
                  {lawyer.lawyerName}
                </h2>                </Link>

                <p className="text-sm text-gray-600 text-center mb-2">
                  Age: {lawyer.age}
                </p>
                <p className="text-sm text-gray-600 text-center mb-2">
                  NIC: {lawyer.nic}
                </p>
                <p className="text-sm text-gray-600 text-center mb-2">
                  University: {lawyer.university}
                </p>
                <p className="text-sm text-gray-600 text-center mb-2">
                  Experience: {lawyer.experienceYears} years
                </p>
                <p className="text-sm text-gray-600 text-center mb-2">
                  Contact: {lawyer.contactNo}
                </p>
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
        ))}
      </div>
    </div>
  );
};

export default CommunityHome;
