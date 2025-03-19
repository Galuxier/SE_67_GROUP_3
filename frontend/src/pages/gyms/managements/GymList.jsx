import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const GymList = () => {
  const [gyms, setGyms] = useState([
    {
      _id: "1",
      gym_name: "Bangkok Fight Club",
      location: { district: "Pathumwan", province: "Bangkok" },
      contact: { tel: "02-123-4567", email: "info@bkk-fightclub.com" },
      active_courses: 5,
    },
    {
      _id: "2",
      gym_name: "Phuket Muay Thai",
      location: { district: "Kathu", province: "Phuket" },
      contact: { tel: "076-123-4567", email: "info@phuketmuaythai.com" },
      active_courses: 3,
    },
    {
      _id: "3",
      gym_name: "Chiang Mai Warriors",
      location: { district: "Mueang", province: "Chiang Mai" },
      contact: { tel: "053-123-4567", email: "info@cmwarriors.com" },
      active_courses: 4,
    },
  ]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [gymToDelete, setGymToDelete] = useState(null);

  const handleDeleteClick = (gym) => {
    setGymToDelete(gym);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setGyms(gyms.filter(gym => gym._id !== gymToDelete._id));
    setIsDeleteModalOpen(false);
    setGymToDelete(null);
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text">My Gyms</h1>
        <Link
          to="/gym/management/create"
          className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Gym
        </Link>
      </div>

      {/* Gym List */}
      <div className="bg-card rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-bar">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">Gym Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">Active Courses</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-text/70 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {gyms.map((gym) => (
                <tr key={gym._id} className="hover:bg-bar/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text">{gym.gym_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text">
                      {gym.location.district}, {gym.location.province}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text">{gym.contact.tel}</div>
                    <div className="text-sm text-text/70">{gym.contact.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {gym.active_courses}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/gym/manage/gyms/${gym._id}/courses`}
                        className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 p-2 rounded-full transition-colors"
                        title="View Courses"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      <Link
                        to={`/gym/manage/gyms/${gym._id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 p-2 rounded-full transition-colors"
                        title="Edit"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(gym)}
                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 p-2 rounded-full transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* No Gyms Message */}
      {gyms.length === 0 && (
        <div className="text-center py-16 bg-card rounded-lg shadow-md">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-text">No gyms</h3>
          <p className="mt-1 text-sm text-text/70">Get started by creating a new gym.</p>
          <div className="mt-6">
            <Link
              to="/gym/manage/gyms/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Gym
            </Link>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-medium text-text mb-4">Confirm Deletion</h3>
            <p className="text-text/70 mb-6">
              Are you sure you want to delete <span className="font-semibold">{gymToDelete?.gym_name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-border rounded-md text-text hover:bg-bar"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GymList;