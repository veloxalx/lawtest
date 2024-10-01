'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const Community = () => {
  const [lawyer, setLawyer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const params = useParams()

  useEffect(() => {
    const fetchLawyerDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/lawyer/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch lawyer details')
        }
        const data = await response.json()
        setLawyer(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchLawyerDetails()
    }
  }, [params.id])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>
  }

  if (!lawyer) {
    return <div className="flex justify-center items-center min-h-screen">No lawyer found.</div>
  }

  return (        <div className="flex justify-center items-center min-h-screen">
    <h2>{params.id}</h2>
    <h2>{lawyer._id}</h2>
    {lawyer.lawyerName}
    </div>

  );
};

export default Community;
