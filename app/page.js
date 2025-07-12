"use client";
import React, { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { auth, firestore } from "./lib/firebase";
import Link from "next/link";

const projectCategories = [
  "Web Development",
  "Mobile App Development",
  "Graphic Design",
  "Content Writing",
  "Digital Marketing",
  "Video Production",
  "Translation",
  "Data Entry",
  "Accounting",
  "Other",
];

const smeCategories = [
  "Access to Finance",
  "Digital Infrastructure",
  "Export & Trade",
  "Skills & Training",
  "Regulatory Compliance",
  "Technology Adoption",
  "Market Access",
  "Supply Chain",
  "Energy & Utilities",
  "Workspace & Facilities",
  "Innovation Support",
  "Other",
];

const infrastructureCategories = [
  "Transportation & Roads",
  "Public Transport",
  "Water Supply & Sanitation",
  "Electricity & Power",
  "Internet & Telecommunications",
  "Healthcare Facilities",
  "Education & Schools",
  "Waste Management",
  "Parks & Recreation",
  "Housing & Urban Planning",
  "Agriculture & Irrigation",
  "Environmental Protection",
  "Digital Government Services",
  "Emergency Services",
  "Other",
];

const Home = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [smeSubmissions, setSmeSubmissions] = useState([]);
  const [infrastructureSubmissions, setInfrastructureSubmissions] = useState(
    []
  );
  const [filteredSmeSubmissions, setFilteredSmeSubmissions] = useState([]);
  const [
    filteredInfrastructureSubmissions,
    setFilteredInfrastructureSubmissions,
  ] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedView, setSelectedView] = useState("projects"); // projects, sme, infrastructure
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userProjects, setUserProjects] = useState([]);
  const [showVerificationWarning, setShowVerificationWarning] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);

    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Fetch projects
        const projectsCollection = collection(firestore, "projects");
        const projectsSnapshot = await getDocs(projectsCollection);
        const projectsList = projectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectsList);
        setFilteredProjects(projectsList);

        // Fetch SME submissions
        const smeCollection = collection(firestore, "sme_challenges");
        const smeQuery = query(smeCollection, orderBy("createdAt", "desc"));
        const smeSnapshot = await getDocs(smeQuery);
        const smeList = smeSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSmeSubmissions(smeList);
        setFilteredSmeSubmissions(smeList);

        // Fetch Infrastructure submissions
        const infrastructureCollection = collection(
          firestore,
          "infrastructure_suggestions"
        );
        const infrastructureQuery = query(
          infrastructureCollection,
          orderBy("createdAt", "desc")
        );
        const infrastructureSnapshot = await getDocs(infrastructureQuery);
        const infrastructureList = infrastructureSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInfrastructureSubmissions(infrastructureList);
        setFilteredInfrastructureSubmissions(infrastructureList);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    setShowVerificationWarning(true);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Filter projects
    let updatedProjects = projects;
    if (selectedCategory) {
      updatedProjects = updatedProjects.filter(
        (project) => project.category === selectedCategory
      );
    }
    if (selectedStatus === "open") {
      updatedProjects = updatedProjects.filter((project) => !project.completed);
    } else if (selectedStatus === "completed") {
      updatedProjects = updatedProjects.filter((project) => project.completed);
    }
    if (searchTerm) {
      updatedProjects = updatedProjects.filter((project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProjects(updatedProjects);

    // Filter SME submissions
    let updatedSme = smeSubmissions;
    if (selectedCategory) {
      updatedSme = updatedSme.filter(
        (submission) => submission.category === selectedCategory
      );
    }
    if (searchTerm) {
      updatedSme = updatedSme.filter((submission) =>
        submission.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredSmeSubmissions(updatedSme);

    // Filter Infrastructure submissions
    let updatedInfrastructure = infrastructureSubmissions;
    if (selectedCategory) {
      updatedInfrastructure = updatedInfrastructure.filter(
        (submission) => submission.category === selectedCategory
      );
    }
    if (searchTerm) {
      updatedInfrastructure = updatedInfrastructure.filter((submission) =>
        submission.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredInfrastructureSubmissions(updatedInfrastructure);
  }, [
    selectedCategory,
    selectedStatus,
    searchTerm,
    projects,
    smeSubmissions,
    infrastructureSubmissions,
  ]);

  useEffect(() => {
    if (user && showPopup) {
      fetchUserProjects();
    }
  }, [user, showPopup]);

  const fetchUserProjects = async () => {
    if (user) {
      setLoading(true);
      try {
        const projectsCollection = collection(firestore, "projects");
        const q = query(projectsCollection, where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        const userProjectsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserProjects(userProjectsList);
      } catch (error) {
        console.error("Error fetching user projects:", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const handleToggleCompleted = async (projectId) => {
    try {
      const projectDoc = doc(firestore, "projects", projectId);
      const projectToUpdate = projects.find(
        (project) => project.id === projectId
      );
      const newCompletedStatus = !projectToUpdate.completed;
      await updateDoc(projectDoc, { completed: newCompletedStatus });
      const updateProject = (list) =>
        list.map((project) =>
          project.id === projectId
            ? { ...project, completed: newCompletedStatus }
            : project
        );
      setProjects(updateProject(projects));
      setFilteredProjects(updateProject(filteredProjects));
      setUserProjects(updateProject(userProjects));
    } catch (error) {
      console.error("Error toggling project completion status:", error.message);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const projectDoc = doc(firestore, "projects", projectId);
      await deleteDoc(projectDoc);
      setProjects(projects.filter((project) => project.id !== projectId));
      setFilteredProjects(
        filteredProjects.filter((project) => project.id !== projectId)
      );
      setUserProjects(
        userProjects.filter((project) => project.id !== projectId)
      );
    } catch (error) {
      console.error("Error deleting project:", error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCurrentCategories = () => {
    if (selectedView === "projects") return projectCategories;
    if (selectedView === "sme") return smeCategories;
    if (selectedView === "infrastructure") return infrastructureCategories;
    return [];
  };

  const getCurrentData = () => {
    if (selectedView === "projects") return filteredProjects;
    if (selectedView === "sme") return filteredSmeSubmissions;
    if (selectedView === "infrastructure")
      return filteredInfrastructureSubmissions;
    return [];
  };

  const renderProjectCard = (project) => (
    <div
      key={project.id}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">{project.title}</h3>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              project.completed
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {project.completed ? "Completed" : "Open"}
          </span>
        </div>
        <p className="text-gray-600 mb-4">{project.description}</p>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
            {project.category}
          </span>
          {project.budget && (
            <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
              Rs. {project.budget.toLocaleString()}
            </span>
          )}
          {project.location && (
            <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
              {project.location}, Sri Lanka
            </span>
          )}
          {project.contact && (
            <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
              Contact: {project.contact}
            </span>
          )}
        </div>
        {user && user.uid === project.userId && (
          <div className="flex gap-2">
            <button
              onClick={() => handleToggleCompleted(project.id)}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
                project.completed
                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {project.completed ? "Reopen Project" : "Mark Completed"}
            </button>
            <button
              onClick={() => handleDeleteProject(project.id)}
              className="p-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderSubmissionCard = (submission) => (
    <div
      key={submission.id}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">{submission.title}</h3>
          <div className="flex flex-col gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm ${getUrgencyColor(
                submission.urgency
              )}`}
            >
              {submission.urgency?.charAt(0).toUpperCase() +
                submission.urgency?.slice(1)}{" "}
              Priority
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              {submission.status?.replace("_", " ").toUpperCase()}
            </span>
          </div>
        </div>

        <p className="text-gray-600 mb-4">{submission.description}</p>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Proposed Solution:</h4>
          <p className="text-gray-700 text-sm">{submission.proposedSolution}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
            {submission.category}
          </span>
          {submission.location && (
            <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
              📍 {submission.location}
            </span>
          )}
          {submission.affectedPeople && (
            <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
              👥 {submission.affectedPeople.toLocaleString()} people affected
            </span>
          )}
          {submission.contact && (
            <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
              📞 {submission.contact}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-200">
          <span>
            Submitted by:{" "}
            <span className="font-medium">{submission.userName}</span>
          </span>
          <span>📅 {formatDate(submission.createdAt)}</span>
        </div>

        {submission.votes !== undefined && (
          <div className="mt-3 flex items-center gap-4">
            <span className="text-sm text-gray-600">
              👍 {submission.votes} votes
            </span>
            {submission.comments && (
              <span className="text-sm text-gray-600">
                💬 {submission.comments.length} comments
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Verification Warning Alert */}
      {showVerificationWarning && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-yellow-600">
                ⚠ Verification Notice
              </h2>
              <button
                onClick={() => setShowVerificationWarning(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="mt-4 text-gray-700">
              This platform connects Sri Lankan freelancers with local projects
              and enables civic engagement. We recommend verifying the identity
              of clients before accepting any work.
            </p>
            <button
              onClick={() => setShowVerificationWarning(false)}
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h1 className="text-3xl font-bold">FreeLanka 🇱🇰</h1>
              <p className="mt-2 text-green-100">
                Connect with local Sri Lankan projects & contribute to national
                development
              </p>
            </div>
            {user && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* View Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedView("projects")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedView === "projects"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              💼 Freelance Projects ({projects.length})
            </button>
            <button
              onClick={() => setSelectedView("sme")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedView === "sme"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              🏢 SME Challenges ({smeSubmissions.length})
            </button>
            <button
              onClick={() => setSelectedView("infrastructure")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedView === "infrastructure"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              🏗️ Infrastructure Issues ({infrastructureSubmissions.length})
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${selectedView}...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {getCurrentCategories().map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {selectedView === "projects" && (
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Projects</option>
                <option value="open">Open Projects</option>
                <option value="completed">Completed Projects</option>
              </select>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <Link
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            href="/how"
          >
            How To Use The Platform
          </Link>
          <Link
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            href="/civic-platform"
          >
            🏛️ Civic Platform - Report Issues
          </Link>
        </div>

        {/* User Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {!user ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Get Started</h2>
              <button
                onClick={handleSignInWithGoogle}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Sign in with Google
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Welcome back, {user?.displayName} 👋
              </h2>
              <div className="space-x-4">
                <button
                  onClick={() => setShowPopup(true)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Manage Projects
                </button>
                <Link href="/add">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Post Project
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Status Filter Pills - Only for projects */}
        {selectedView === "projects" && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setSelectedStatus("")}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedStatus === ""
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              } transition-colors`}
            >
              All Projects
            </button>
            <button
              onClick={() => setSelectedStatus("open")}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedStatus === "open"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              } transition-colors`}
            >
              Open Projects
            </button>
            <button
              onClick={() => setSelectedStatus("completed")}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedStatus === "completed"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              } transition-colors`}
            >
              Completed Projects
            </button>
          </div>
        )}

        {/* Content Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getCurrentData().map((item) => {
              if (selectedView === "projects") {
                return renderProjectCard(item);
              } else {
                return renderSubmissionCard(item);
              }
            })}
          </div>
        )}

        {getCurrentData().length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">
              No {selectedView} Found
            </h3>
            <p className="text-gray-600">
              {selectedView === "projects"
                ? "Try adjusting your filters or post a new project."
                : "No submissions found for the selected criteria."}
            </p>
          </div>
        )}
      </main>

      {/* User Projects Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Your Posted Projects</h2>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {userProjects.length > 0 ? (
                  <>
                    {userProjects
                      .filter((project) => {
                        if (selectedStatus === "open")
                          return !project.completed;
                        if (selectedStatus === "completed")
                          return project.completed;
                        return true;
                      })
                      .map((project) => (
                        <div
                          key={project.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold">
                              {project.title}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                project.completed
                                  ? "bg-green-100 text-green-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {project.completed ? "Completed" : "Open"}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4">
                            {project.description}
                          </p>
                          {project.budget && (
                            <p className="text-gray-600 mb-4">
                              Budget: Rs. {project.budget.toLocaleString()}
                            </p>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleCompleted(project.id)}
                              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                                project.completed
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                  : "bg-green-600 text-white hover:bg-green-700"
                              }`}
                            >
                              {project.completed
                                ? "Reopen Project"
                                : "Mark Completed"}
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}

                    {/* Show message when filtered results are empty */}
                    {userProjects.filter((project) => {
                      if (selectedStatus === "open") return !project.completed;
                      if (selectedStatus === "completed")
                        return project.completed;
                      return true;
                    }).length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-600">
                          No {selectedStatus} projects found.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      You haven't posted any projects yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
