"use client";
import Link from 'next/link';
import React from 'react';

const HowToSection = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '+94741143323';
    const message = "Hello, I have a question about Lanka Freelance!";
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

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold text-center">
              How To Use Lanka Freelance
            </h1>
            <p className="mt-2 text-center text-green-100">
              Connect with local Sri Lankan projects
            </p>
          </div>

          {/* ... (all the previous instructional content remains unchanged) ... */}

          <div className="bg-gray-50 py-8 px-6 text-center border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Have a question?</h3>
            <button
              className="mt-4 inline-flex items-center bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
              onClick={handleWhatsAppClick}
            >
              Contact via WhatsApp
            </button>
          </div>

          <div className="bg-blue-50 py-8 px-6 text-center border-t border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800">Want to Contribute?</h3>
            <p className="mt-2 text-gray-700 max-w-md mx-auto">
              Help us make Lanka Freelance better! We welcome your contributions to our open-source project.
            </p>
            <a
              href="https://github.com/veloxalx/lawtest"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contribute on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToSection;
