import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon, PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { getTrainersInGym } from "../../../services/api/TrainerApi";

function TrainerList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const data = await getTrainersInGym("gym_id_here");
        const formattedTrainers = data.map(trainer => ({
          id: trainer._id,
          image: trainer.image_url || trainer.profile_picture_url || "/api/placeholder/400/320",
          name: `${trainer.firstName || trainer.first_name} ${trainer.lastName || trainer.last_name}`,
          nickname: trainer.Nickname || trainer.nickname,
          contact: trainer.contact,
          fightHistory: trainer.fightHistory,
          detail: trainer.detail
        }));
        setTrainers(formattedTrainers);
      } catch (error) {
        console.error("Failed to fetch trainers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  // Filter and search logic
  const filteredTrainers = trainers.filter(trainer => {
    return trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           trainer.nickname.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAddTrainer = () => {
    navigate("/gym/management/trainers/create");
  };

  const handleEditTrainer = (trainer, e) => {
    e.stopPropagation();
    navigate(`/gym/management/trainers/edit/${trainer.id}`);
  };

  const handleDeletePrompt = (trainer, e) => {
    e.stopPropagation();
    setSelectedTrainer(trainer);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setTrainers(trainers.filter(trainer => trainer.id !== selectedTrainer.id));
    setIsDeleteModalOpen(false);
    setSelectedTrainer(null);
  };

  const handleViewProfile = (trainer) => {
    navigate(`/gym/management/trainers/${trainer.id}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header and Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Trainer Management</h1>
          <button
            onClick={handleAddTrainer}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Trainer
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search trainers..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Trainers List */}
        {filteredTrainers.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredTrainers.map((trainer) => (
              <motion.div
                key={trainer.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                variants={itemVariants}
                onClick={() => handleViewProfile(trainer)}
              >
                <div className="relative">
                  <img
                    src={trainer.image}
                    alt={trainer.nickname}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-0 right-0 m-2 flex space-x-1">
                    <button
                      className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                      onClick={(e) => handleEditTrainer(trainer, e)}
                      title="Edit"
                    >
                      <PencilSquareIcon className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                      onClick={(e) => handleDeletePrompt(trainer, e)}
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-2">
                    <h2 className="text-lg font-semibold text-gray-800">{trainer.name}</h2>
                    <p className="text-rose-600 font-medium">{trainer.nickname}</p>
                  </div>
                
                  {/* แสดงข้อมูล contact ถ้ามี */}
                  {trainer.contact && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Contact:</span> {trainer.contact}
                      </p>
                    </div>
                  )}

                  {/* แสดงข้อมูล fightHistory ถ้ามี */}
                  {trainer.fightHistory && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Fight History:</span> {trainer.fightHistory}
                      </p>
                    </div>
                  )}

                  {/* แสดงข้อมูล detail ถ้ามี */}
                  {trainer.detail && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Details:</span> {trainer.detail}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow">
            <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No trainers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? `No results for "${searchTerm}"`
                : "There are no trainers registered yet."}
            </p>
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(""); }}
                className="mt-4 text-rose-600 hover:text-rose-800"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to remove <span className="font-medium text-gray-700">{selectedTrainer?.name} ({selectedTrainer?.nickname})</span> from your gym? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainerList;