import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';

const EditLawyer = () => {
  const router = useRouter();
  const { id } = router.query;
  const [lawyer, setLawyer] = useState({
    lawyerName: '',
    age: '',
    nic: '',
    university: '',
    experienceYears: '',
    certificate: '',
    prevExperiences: [],
    profilePic: '',
    contactNo: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchLawyer = async () => {
        try {
          const doc = await db.collection('lawyers').doc(id).get();
          if (doc.exists) {
            setLawyer(doc.data());
          } else {
            console.log('No such profile!');
          }
        } catch (error) {
          console.error('Error fetching document: ', error);
        } finally {
          setLoading(false);
        }
      };

      fetchLawyer();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLawyer({ ...lawyer, [name]: value });
  };

  const handleExperienceChange = (index, value) => {
    const newExperiences = [...lawyer.prevExperiences];
    newExperiences[index] = value;
    setLawyer({ ...lawyer, prevExperiences: newExperiences });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await db.collection('lawyers').doc(id).update(lawyer);
      alert('Profile updated!');
      router.push(`/lawyerProfile/${id}`);
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mt-4 p-8 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Edit Lawyer Profile</h1>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Full Name</label>
          <input
            type="text"
            name="lawyerName"
            value={lawyer.lawyerName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Age</label>
          <input
            type="number"
            name="age"
            value={lawyer.age}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">NIC No</label>
          <input
            type="text"
            name="nic"
            value={lawyer.nic}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">University</label>
          <input
            type="text"
            name="university"
            value={lawyer.university}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Experience in Years</label>
          <input
            type="number"
            name="experienceYears"
            value={lawyer.experienceYears}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Certificate URL</label>
          <input
            type="text"
            name="certificate"
            value={lawyer.certificate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Previous Experiences</label>
          {lawyer.prevExperiences.map((exp, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={exp}
                onChange={(e) => handleExperienceChange(index, e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
              <button
                type="button"
                onClick={() => {
                  const newExperiences = [...lawyer.prevExperiences];
                  newExperiences.splice(index, 1);
                  setLawyer({ ...lawyer, prevExperiences: newExperiences });
                }}
                className="ml-2 text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setLawyer({ ...lawyer, prevExperiences: [...lawyer.prevExperiences, ''] })}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Experience
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Profile Picture URL</label>
          <input
            type="text"
            name="profilePic"
            value={lawyer.profilePic}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Contact No</label>
          <input
            type="text"
            name="contactNo"
            value={lawyer.contactNo}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditLawyer;
