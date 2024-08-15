"use client";
import React from 'react';

const HowToSection = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">How to Use This Application</h1>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">1. Sign Up with Google</h2>
          <p className="text-gray-700">
            To get started, you need to sign up by clicking the "Sign up with Google" button on the homepage!. This will allow you to access all features of the application.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">2. Add Your Legal Listings</h2>
          <p className="text-gray-700">
            After logging in, you can add your legal listings by navigating to the "Add Listing" section. Here, you can provide details about legal issues for which you're seeking assistance.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">3. Update Listing Status</h2>
          <p className="text-gray-700">
            Once you've found a lawyer for your problem, you can update the status of your listing. 
            Click the "Mark as Occupied" button to indicate that the issue has been resolved. 
            If you have not found a lawyer yet, the listing will remain in its initial color.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">4. Understanding Listing Colors</h2>
          <p className="text-gray-700">
            <span className="font-bold text-green-600">Green:</span> Indicates that the case is <span className="font-bold">OCCUPIED</span>. This means that a lawyer has been found and the issue has been resolved.
          </p>
          <p className="text-gray-700">
            <span className="font-bold text-yellow-600">Other Colors:</span> Represent listings that are <span className="font-bold">NOT YET OCCUPIED</span>. These cases are still open and require a lawyer.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HowToSection;
