"use client";
import Link from 'next/link';
import React from 'react';

const HowToSection = () => {
  const handleEmailClick = () => {
    window.location.href = "mailto:imveloxal@gmail.com";
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-md">
      <Link href={"/"}>Back to Homepage!</Link>
      <br/>  <br/>
      <h1 className="text-2xl font-bold mb-4 text-center">How to Use This Application</h1>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Sign Up and Manage Listings</h2>
          <p className="text-gray-700 mb-2">
            <span className="font-bold text-blue-600">Sign Up:</span> Click on the <span className="font-bold">"Sign in with Google"</span> button to log in or sign up using your Google account.
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-bold text-blue-600">Add Listings:</span> After logging in, you can add your legal listings by clicking on the <span className="font-bold">"Add Listing"</span> button.
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-bold text-blue-600">Change Status:</span> You can update the status of your listings to indicate whether they are resolved. Use the <span className="font-bold">"Mark as Occupied"</span> button to change the status.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Color Codes</h2>
          <p className="text-gray-700">
            <span className="font-bold text-green-600">Green:</span> Indicates that the case is <span className="font-bold">OCCUPIED</span>. This means that a lawyer has been found and the issue has been resolved.
          </p>
          <p className="text-gray-700">
            <span className="font-bold text-yellow-600">Yellow:</span> Indicates that the case is <span className="font-bold">OPEN</span>. This means that the case is still available for legal assistance.
          </p>
          <p className="text-gray-700">
            <span className="font-bold text-red-600">Red:</span> Indicates that the case is <span className="font-bold">CLOSED</span>. This means that the case has been resolved and is no longer available.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Any Other Questions?</h2>
          <button
            onClick={handleEmailClick}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}

export default HowToSection;
