"use client";
import React, { useEffect, useState } from 'react';

const CommunityHome = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const profileData = [
        {
          name: 'Searam de Silva',
          avatar: 'https://via.placeholder.com/150',
          bio: 'Criminal Lawyer',
          location: 'Colombo | LK',
        },
        {
          name: 'Jamal Mohommad',
          avatar: 'https://via.placeholder.com/150',
          bio: 'Corporate Lawyer',
          location: 'London, UK',
        },
        {
          name: 'SM Chandran>',
          avatar: 'https://via.placeholder.com/150',
          bio: 'Family Lawyer',
          location: 'Gampaha | Lk',
        },
      ];
      setProfiles(profileData);
    };
    
    fetchProfiles();
  }, []);

  if (!profiles.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-wrap justify-center items-center min-h-screen bg-gray-100">
      {profiles.map((profile, index) => (
        <div key={index} className="bg-white shadow-lg rounded-lg p-6 m-4 max-w-sm">
          <div className="flex items-center justify-center mb-4">
            <img
              src={profile.avatar}
              alt={`${profile.name} profile`}
              className="w-24 h-24 rounded-full border-4 border-purple-500"
            />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
            <p className="text-gray-600">{profile.bio}</p>
            <p className="text-purple-500 mt-2">{profile.location}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunityHome;
