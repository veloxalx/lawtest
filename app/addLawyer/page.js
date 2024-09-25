'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddLawyer({ onClose }) {
  const router = useRouter()
  const [lawyerName, setLawyerName] = useState("")
  const [age, setAge] = useState("")
  const [nic, setNic] = useState("")
  const [university, setUniversity] = useState("Colombo")
  const [experienceYears, setExperienceYears] = useState("")
  const [certificate, setCertificate] = useState(null)
  const [contactNo, setContactNo] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!lawyerName || !age || !nic || !university || !experienceYears || !contactNo || !certificate) {
        alert("Please fill in all required fields and upload the certificate.")
        setLoading(false)
        return
      }

      const formData = new FormData()
      formData.append("lawyerName", lawyerName)
      formData.append("age", age)
      formData.append("nic", nic)
      formData.append("university", university)
      formData.append("experienceYears", experienceYears)
      formData.append("contactNo", contactNo)
      formData.append("certificate", certificate)

      const response = await fetch("/api/lawyer/new", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const newLawyer = await response.json()
        alert("New Lawyer added!")
        // router.push(`/community/${newLawyer._id}`)
      } else {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`)
      }
    } catch (error) {
      console.error("Error adding lawyer:", error)
      alert("Error adding lawyer, please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-8 rounded shadow-md w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-900"
        >
          &times;
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          New Lawyer Registration
        </h1>
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
              required
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
              required
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
              required
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
              required
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
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="certificate">
              Upload Certificate
            </label>
            <input
              type="file"
              id="certificate"
              onChange={(e) => setCertificate(e.target.files[0] || null)}
              className="w-full px-3 py-2 border rounded"
              required
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
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  )
}