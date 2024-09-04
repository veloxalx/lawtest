"use client";
import React, { useState } from 'react';

export default function AddLawyer({ onClose }) {
  const [lawyerName, setLawyerName] = useState('');
  const [age, setAge] = useState('');
  const [nic, setNic] = useState('');
  const [university, setUniversity] = useState('Colombo');
  const [experienceYears, setExperienceYears] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [prevExperiences, setPrevExperiences] = useState([]);
  const [experience, setExperience] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [contactNo, setContactNo] = useState('');

  const addExperience = () => {
    if (experience) {
      setPrevExperiences([...prevExperiences, experience]);
      setExperience('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('lawyerName', lawyerName);
    formData.append('age', age);
    formData.append('nic', nic);
    formData.append('university', university);
    formData.append('experienceYears', experienceYears);
    formData.append('certificate', certificate);
    formData.append('prevExperiences', prevExperiences.join(', '));
    formData.append('profilePic', profilePic);
    formData.append('contactNo', contactNo);

    fetch('Api-url', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className=" inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-8 rounded shadow-md w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-900"
        >
          &times;
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">New Lawyer Registration</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="lawyerName">
              Full Name
            </label>
            <input
              type="text"
              id="lawyerName"
              value={lawyerName}
              onChange={(e) => setLawyerName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="age">
              Age
            </label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter your age"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="nic">
              NIC No
            </label>
            <input
              type="text"
              id="nic"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter your NIC number"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="university">
              Graduate University
            </label>
            <select
              id="university"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Colombo">University of Colombo</option>
              <option value="Peradeniya">University of Peradeniya</option>
              <option value="Jaffna">University of Jaffna</option>
              <option value="Open">Open University of SL</option>
              <option value="LawCollege">SL Law College</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="experienceYears">
              Experience in Years
            </label>
            <input
              type="number"
              id="experienceYears"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter years of experience"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="certificate">
              Upload Certificate
            </label>
            <input
              type="file"
              id="certificate"
              onChange={(e) => setCertificate(e.target.files[0])}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="prevExperience">
              Add Previous Working Experience
            </label>
            <input
              type="text"
              id="prevExperience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter previous work experience"
            />
            <button
              type="button"
              onClick={addExperience}
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Experience
            </button>
            <ul className="mt-4">
              {prevExperiences.map((exp, index) => (
                <li key={index} className="text-gray-700">
                  {exp}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="profilePic">
              Upload Profile Picture
            </label>
            <input
              type="file"
              id="profilePic"
              onChange={(e) => setProfilePic(e.target.files[0])}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="contactNo">
              Contact No
            </label>
            <input
              type="text"
              id="contactNo"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter your contact number"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
