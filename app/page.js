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

const Home = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userProjects, setUserProjects] = useState([]);
  const [showVerificationWarning, setShowVerificationWarning] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);

    const fetchProjects = async () => {
      setLoading(true);
      try {
        const projectsCollection = collection(firestore, "projects");
        const snapshot = await getDocs(projectsCollection);
        const projectsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectsList);
        setFilteredProjects(projectsList);
      } catch (error) {
        console.error("Error fetching projects:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
    setShowVerificationWarning(true);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let updatedProjects = projects;
    if (selectedCategory) {
      updatedProjects = updatedProjects.filter(
        (project) => project.category === selectedCategory
      );
    }
    if (searchTerm) {
      updatedProjects = updatedProjects.filter((project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProjects(updatedProjects);
  }, [selectedCategory, searchTerm, projects]);

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
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("user");
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
              This platform connects Sri Lankan freelancers with local projects. 
              We recommend verifying the identity of clients before accepting any work.
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
              <h1 className="text-3xl font-bold">Lanka Freelance 🇱🇰</h1>
              <p className="mt-2 text-green-100">
                Connect with local Sri Lankan projects
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
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects..."
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
              {projectCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Link
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors m-4"
          href={"/how"}
        >
          {" "}
          How To Use The Platform
        </Link>
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
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors m-4"
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

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
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
                        {project.location}
                      </span>
                    )}
                  </div>
                  {user && user.uid === project.userId ? (
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
                  ) : (
                    <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Apply for Project
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProjects.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or post a new project.
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
                  userProjects.map((project) => (
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
                      <p className="text-gray-600 mb-4">{project.description}</p>
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
                          {project.completed ? "Reopen Project" : "Mark Completed"}
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
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