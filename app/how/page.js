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

          <div className="p-6 space-y-8">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-800">
                <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Getting Started
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">1</div>
                  <p className="ml-4 text-gray-700">
                    <span className="font-semibold text-blue-600">Browse Listings Without Logging In:</span> If you're looking for gigs, you don’t need to create an account. You can explore available projects and directly reach out to project owners through the <strong>Contact Section</strong> on each listing.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">2</div>
                  <p className="ml-4 text-gray-700">
                    <span className="font-semibold text-blue-600">Sign in with Google:</span> Click on the "Sign in with Google" button on the homepage to create an account or log in.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">3</div>
                  <p className="ml-4 text-gray-700">
                    <span className="font-semibold text-blue-600">Browse Projects:</span> View available projects by category or use the search bar to find specific opportunities.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">4</div>
                  <p className="ml-4 text-gray-700">
                    <span className="font-semibold text-blue-600">Apply for Projects:</span> Click the "Apply for Project" button on projects you're interested in working on.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">5</div>
                  <p className="ml-4 text-gray-700">
                    <span className="font-semibold text-blue-600">Verify Identity:</span> Always verify the identity of clients before accepting any work, as recommended in our platform notice.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-green-800">
                <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Posting Your Own Projects
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600">1</div>
                  <p className="ml-4 text-gray-700">
                    <span className="font-semibold text-green-600">Post a Project:</span> Click the "Post Project" button after signing in to create a new project listing.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600">2</div>
                  <p className="ml-4 text-gray-700">
                    <span className="font-semibold text-green-600">Manage Projects:</span> Click "Manage Projects" to view, edit, or delete your posted projects.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600">3</div>
                  <p className="ml-4 text-gray-700">
                    <span className="font-semibold text-green-600">Mark Completed:</span> Once a project is finished, click "Mark Completed" to update its status.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600">4</div>
                  <p className="ml-4 text-gray-700">
                    <span className="font-semibold text-green-600">Reopen if Needed:</span> If necessary, you can reopen a completed project by clicking "Reopen Project".
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Project Status Guide
              </h2>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                  <p className="ml-4 text-gray-700">Open: The project is live and available for bids.</p>
                </div>
                <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  <p className="ml-4 text-gray-700">In Progress: The project is underway and being worked on.</p>
                </div>
                <div className="flex items-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
                  <p className="ml-4 text-gray-700">Completed: The project has been finished.</p>
                </div>
                <div className="flex items-center p-4 bg-red-50 rounded-lg border border-red-100">
                  <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                  <p className="ml-4 text-gray-700">Closed: The project is no longer available.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 py-8 px-6 text-center">
            <h3 className="text-lg font-medium text-gray-900">Have a question?</h3>
            <button
              className="mt-4 inline-flex items-center bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
              onClick={handleWhatsAppClick}
            >
              Contact via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToSection;
