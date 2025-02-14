"use client";
import Link from 'next/link';
import React from 'react';

const HowToSection = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '+94741143323'; // Replace with your actual phone number (including country code)
    const message = "Hello , there's a bug in your application!";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
        >
          <svg 
            className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Homepage
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold text-center">
              How to Use This Application
            </h1>
          </div>

          <div className="p-6 space-y-8">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-800">
                <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Sign Up and Manage Problems
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">1</div>
                  <p className="ml-4 text-gray-700">
                    <span className="font-semibold text-blue-600">Sign Up:</span> Click on the "Sign in with Google" button to log in or sign up using your Google account.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">2</div>
                  <p className="ml-4 text-gray-700">
                    <span className="font-semibold text-blue-600">Add Problems:</span> After logging in, you can add your problems by clicking on the "Add Problem" button.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">3</div>
                  <p className="ml-4 text-gray-700">
                    <span className="font-semibold text-blue-600">Change Status:</span> You can update the status of your problems using the "Mark as Solved" button.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">4</div>
                  <p className="ml-4 text-gray-700">
                    <span className="font-semibold text-blue-600">Update Status:</span> If a solved problem needs attention again, use "Mark as Unsolved" to reopen it.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Color Codes
              </h2>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <p className="text-gray-700">
                    <span className="font-semibold text-green-600">Green:</span> Problem is SOLVED
                  </p>
                </div>
                <div className="flex items-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                  <p className="text-gray-700">
                    <span className="font-semibold text-yellow-600">Yellow:</span> Problem is UNSOLVED
                  </p>
                </div>
                <div className="flex items-center p-4 bg-red-50 rounded-lg border border-red-100">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                  <p className="text-gray-700">
                    <span className="font-semibold text-red-600">Red Glow:</span> Problem is URGENT
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-green-800">
                <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Helping Others
              </h2>
              <p className="text-gray-700">
                If you see a problem you can help with, click the "Contact to Help" button. This will open your email client to contact the person who posted the problem.
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-purple-800">
                <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Any Other Questions?
              </h2>
              <button
                onClick={handleWhatsAppClick}
                className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowToSection;