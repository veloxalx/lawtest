"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
const profilePictures = {
  1: "https://randomuser.me/api/portraits/men/1.jpg",
  2: "https://randomuser.me/api/portraits/men/2.jpg",
  3: "https://randomuser.me/api/portraits/men/3.jpg",
};
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
      <section className="bg-blue-600 py-10">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">
            Find the Best Lawyers in the Community
          </h1>
          <p className="text-lg mb-8">
            Search and connect with experienced lawyers in various legal fields
          </p>
          <div className="flex justify-center">
            <input
              type="text"
              className="w-full md:w-2/3 lg:w-1/2 px-4 py-2 rounded-l-md focus:outline-none"
              placeholder="Search for a lawyer by name, age, or experience..."
            />
            <button className="bg-gray-900 px-4 py-2 rounded-r-md text-white hover:bg-blue-900">
              Search
            </button>
          </div>
        </div>
      </section>

      <h1 className="text-3xl font-bold text-center mt-8 mb-8"></h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-10">
        {lawyers.map((lawyer) => (
          <div
            key={lawyer._id}
            className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden hover:shadow-2xl hover:border-blue-500 transition-all duration-300 transform hover:scale-105"
          >
            <div className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden border-4 border-blue-100">
                  <img
                    src={
                      profilePictures[lawyer._id] ||
                      "https://randomuser.me/api/portraits/men/4.jpg"
                    }
                    alt="Lawyer Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <Link href={`/community/${lawyer._id}`}>
                  <h2 className="text-2xl font-bold text-center mb-2 hover:text-blue-600 transition-colors duration-200">
                    {lawyer.lawyerName}
                  </h2>
                </Link>

                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span className="material-icons mr-2"></span> Age:{" "}
                  {lawyer.age}
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span className="material-icons mr-2"></span> Experience:{" "}
                  {lawyer.experienceYears} years
                </div>

                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-4">
                  {lawyer.experienceYears >= 10
                    ? "Veteran Lawyer"
                    : "Rising Star"}
                </div>

                <Link href={`/community/${lawyer._id}`}>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all duration-300">
                    View Profile
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityHome;
