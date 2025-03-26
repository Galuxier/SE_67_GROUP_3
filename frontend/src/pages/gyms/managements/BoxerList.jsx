import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MagnifyingGlassIcon, FunnelIcon, PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { getBoxerInGym } from "../../../services/api/BoxerApi";
import { updateUser } from "../../../services/api/UserApi";

function BoxerList() {
  const { gym_id } = useParams(); // ดึง gym_id จาก URL
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWeight, setFilterWeight] = useState("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBoxer, setSelectedBoxer] = useState(null);
  const [boxers, setBoxers] = useState([]);
  const [loading, setLoading] = useState(true);

  // แทนที่ useEffect เดิมด้วยนี้
  useEffect(() => {
    const fetchBoxers = async () => {
      try {
        const response = await getBoxerInGym(gym_id);
        console.log('Boxers response:', response);
        
        // ใช้ response.data แทน response เพราะ API return object ที่มี property data
        const boxerData = response.data || [];
        
        const formattedBoxers = boxerData.map(boxer => ({
          id: boxer._id,
          image: boxer.profile_picture_url || "/api/placeholder/400/320",
          name: `${boxer.first_name} ${boxer.last_name}`,
          nickname: boxer.nickname,
          username: boxer.username,
          age: boxer.age, 
          weight: boxer.weight, 
          wins: boxer.wins,
          losses: boxer.losses,
          draws: boxer.draws,
          fightHistory: boxer.fightHistory,
          detail: boxer.detail,
          status: boxer.status
        }));
        
        setBoxers(formattedBoxers);
      } catch (error) {
        console.error("Failed to fetch boxers:", error);
        setBoxers([]); // เซ็ตเป็น array ว่างหากเกิด error
      } finally {
        setLoading(false);
      }
    };
  
    fetchBoxers();
  }, [gym_id]);
  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  // Filter and search logic
  const filteredBoxers = boxers.filter(boxer => {
    const matchesSearch = boxer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          boxer.nickname.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterWeight === "all") return matchesSearch;
    
    if (filterWeight === "lightweight") return matchesSearch && boxer.weight < 60;
    if (filterWeight === "welterweight") return matchesSearch && boxer.weight >= 60 && boxer.weight < 70;
    if (filterWeight === "heavyweight") return matchesSearch && boxer.weight >= 70;
    
    return matchesSearch;
  });

  const handleAddBoxer = () => {
    navigate(`/gym/management/${gym_id}/boxers/create`);
  };

  const handleEditBoxer = (boxer, e) => {
    e.stopPropagation();
    navigate(`/gym/management/boxers/edit/${boxer.id}`);
  };

  const handleDeletePrompt = (boxer, e) => {
    e.stopPropagation();
    setSelectedBoxer(boxer);
    setIsDeleteModalOpen(true);
  };

  // ในส่วน handleDeleteConfirm
  const handleDeleteConfirm = async () => {
    try {
      console.log(`Removing ${selectedBoxer.id} from gym ${gym_id}`);
      
      // เรียก API เพื่ออัปเดต gym_id เป็น null
      await updateUser(selectedBoxer.id, { 
        gym_id: null,
        role: ['member'] // เปลี่ยน role เป็น member เมื่อออกจาก gym
      });
      
      // อัปเดต state โดยไม่ต้องรอ refetch
      setBoxers(boxers.filter(boxer => boxer.id !== selectedBoxer.id));
      
      setIsDeleteModalOpen(false);
      setSelectedBoxer(null);
      
      // แสดงการแจ้งเตือน
      alert('ลบนักมวยออกจากยิมเรียบร้อยแล้ว');
    } catch (error) {
      console.error("Failed to remove:", error);
      alert('เกิดข้อผิดพลาดในการลบ: ' + error.message);
    }
  };

  const handleViewProfile = (boxer) => {
    if (boxer.username) {
      navigate(`/gym/management/user/${boxer.username}`);
    }
  };

  // Weight category badge 
  const getWeightCategory = (weight) => {
    if (weight < 60) return "Lightweight";
    if (weight >= 60 && weight < 70) return "Welterweight";
    return "Heavyweight";
  };

  // Animation variants for list items
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
          <h1 className="text-3xl font-bold text-gray-800">Boxer Management</h1>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddBoxer}
              className="inline-flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New Boxer
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search boxers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <select
              value={filterWeight}
              onChange={(e) => setFilterWeight(e.target.value)}
              className="py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="all">All Weights</option>
              <option value="lightweight">Lightweight (&lt;60kg)</option>
              <option value="welterweight">Welterweight (60-70kg)</option>
              <option value="heavyweight">Heavyweight (&gt;70kg)</option>
            </select>
          </div>
        </div>

        {/* Stats Summary */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Boxers</p>
              <p className="text-2xl font-bold">{boxers.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <UserCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Age</p>
              <p className="text-2xl font-bold">
                {boxers.length > 0 
                  ? Math.round(boxers.reduce((sum, boxer) => sum + boxer.age, 0) / boxers.length) 
                  : 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <div className="h-6 w-6 text-green-600">📅</div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Win Rate</p>
              <p className="text-2xl font-bold">
                {boxers.length > 0 
                  ? Math.round(boxers.reduce((sum, boxer) => sum + boxer.wins, 0) / 
                      boxers.reduce((sum, boxer) => sum + boxer.wins + boxer.losses + boxer.draws, 0) * 100) + '%'
                  : '0%'}
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <div className="h-6 w-6 text-amber-600">🏆</div>
            </div>
          </div>
        </div> */}

        {/* Boxers List */}
        {filteredBoxers.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredBoxers.map((boxer) => (
              <motion.div
                key={boxer.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                variants={itemVariants}
                onClick={() => handleViewProfile(boxer)}
              >
                <div className="relative">
                  <img
                    src={boxer.image}
                    alt={boxer.nickname}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-0 right-0 m-2 flex space-x-1">
                    <button
                      className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                      onClick={(e) => handleEditBoxer(boxer, e)}
                      title="Edit"
                    >
                      <PencilSquareIcon className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                      onClick={(e) => handleDeletePrompt(boxer, e)}
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{boxer.name}</h2>
                      <p className="text-rose-600 font-medium">{boxer.nickname}</p>
                    </div>
                  </div>
                  
                  {/* แสดงข้อมูล fightHistory ถ้ามี */}
                  {boxer.fightHistory && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Fight History:</span> {boxer.fightHistory}
                      </p>
                    </div>
                  )}

                  {/* แสดงข้อมูล detail ถ้ามี */}
                  {boxer.detail && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Details:</span> {boxer.detail}
                      </p>
                    </div>
                  )}

                  {/* แสดงสถิติเฉพาะที่มีค่า */}
                  {(boxer.wins !== undefined || boxer.losses !== undefined || boxer.draws !== undefined || boxer.age !== undefined) && (
                    <div className="flex justify-between mt-4 pt-2 border-t border-gray-100">
                      {boxer.wins !== undefined && (
                        <div className="text-center">
                          <p className="text-xs text-gray-500">WINS</p>
                          <p className="font-bold text-green-600">{boxer.wins}</p>
                        </div>
                      )}
                      {boxer.losses !== undefined && (
                        <div className="text-center">
                          <p className="text-xs text-gray-500">LOSSES</p>
                          <p className="font-bold text-red-600">{boxer.losses}</p>
                        </div>
                      )}
                      {boxer.draws !== undefined && (
                        <div className="text-center">
                          <p className="text-xs text-gray-500">DRAWS</p>
                          <p className="font-bold text-gray-600">{boxer.draws}</p>
                        </div>
                      )}
                      {boxer.age !== undefined && (
                        <div className="text-center">
                          <p className="text-xs text-gray-500">AGE</p>
                          <p className="font-bold text-gray-600">{boxer.age}</p>
                        </div>
                      )}
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
            <h3 className="mt-4 text-lg font-medium text-gray-900">No boxers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? `No results for "${searchTerm}"` 
                : filterWeight !== "all" 
                  ? `No boxers in the ${filterWeight} category`
                  : "There are no boxers registered yet."}
            </p>
            {(searchTerm || filterWeight !== "all") && (
              <button
                onClick={() => { setSearchTerm(""); setFilterWeight("all"); }}
                className="mt-4 text-rose-600 hover:text-rose-800"
              >
                Clear filters
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
              Are you sure you want to remove <span className="font-medium text-gray-700">{selectedBoxer?.name} ({selectedBoxer?.nickname})</span> from your gym? This action cannot be undone.
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

export default BoxerList;