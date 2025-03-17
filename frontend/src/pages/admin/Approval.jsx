import { useState, useEffect } from "react";
import { api } from "../../services/Axios";

export default function Approval() {
  const [infoModal, setInfoModal] = useState(false);
  const [fileModal, setFileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterRole, setFilterRole] = useState("all");
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);

  // Fetch enrollments when component mounts
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await api.get('/enrollments');
        setEnrollments(response.data.data);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      }
    };

    fetchEnrollments();
  }, []);

  // Filter enrollments based on role
  useEffect(() => {
    if (filterRole === "all") {
      setFilteredEnrollments(enrollments);
    } else {
      const filtered = enrollments.filter((enrollment) => 
        enrollment.role.toLowerCase().replace(" ", "_") === filterRole
      );
      setFilteredEnrollments(filtered);
    }
  }, [filterRole, enrollments]);

  // Handle enrollment approval/rejection
  const handleEnrollmentAction = async (id, status) => {
    try {
      await api.put(`/enrollment/${id}`, { status });
      
      // Update local state
      setEnrollments(prevEnrollments => 
        prevEnrollments.map(enrollment => 
          enrollment._id === id 
            ? { ...enrollment, status } 
            : enrollment
        )
      );
    } catch (error) {
      console.error(`Error ${status} enrollment:`, error);
    }
  };

  // Role options matching the backend
  const roleOptions = [
    { value: "gym_owner", display: "Gym Owner" },
    { value: "organizer", display: "Organizer" },
    { value: "shop_owner", display: "Shop Owner" },
    { value: "trainer", display: "Trainer" },
    { value: "boxer", display: "Boxer" },
    { value: "lessor", display: "Lessor" },
  ];

  return (
    <div className="p-6 bg-background text-text min-h-screen">
      {/* Filter Section */}
      <div className="flex justify-end mb-4">
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="p-2 border border-border rounded bg-card text-text"
        >
          <option value="all">All Roles</option>
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.display}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="p-4 bg-card rounded-lg shadow-md">
        <div className="grid grid-cols-7 bg-primary p-2 font-bold text-center text-white rounded-t-lg">
          <div>User</div>
          <div>Role</div>
          <div>Name</div>
          <div>Time</div>
          <div>Status</div>
          <div>Description</div>
          <div>Action</div>
        </div>
        {filteredEnrollments.length === 0 ? (
          <div className="text-center p-4 text-gray-500">
            No enrollment requests found
          </div>
        ) : (
          filteredEnrollments.map((enrollment) => (
            <div
              key={enrollment._id}
              className="grid grid-cols-7 p-2 border-b border-border items-center text-center hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div>
                <img 
                  src="/api/placeholder/50/50" 
                  alt="Avatar" 
                  className="w-12 h-12 rounded-full mx-auto" 
                />
              </div>
              <div>{enrollment.role}</div>
              <div>
                {enrollment.user_id?.first_name} {enrollment.user_id?.last_name}
              </div>
              <div>{new Date(enrollment.created_at).toLocaleDateString()}</div>
              <div>{enrollment.status}</div>
              <div>{enrollment.description}</div>
              <div className="flex justify-center space-x-2">
                {enrollment.status === 'pending' && (
                  <>
                    <button 
                      className="text-green-500 bg-green-100 p-1 rounded"
                      onClick={() => handleEnrollmentAction(enrollment._id, 'approved')}
                    >
                      ✔️ Approve
                    </button>
                    <button 
                      className="text-red-500 bg-red-100 p-1 rounded"
                      onClick={() => handleEnrollmentAction(enrollment._id, 'rejected')}
                    >
                      ❌ Reject
                    </button>
                  </>
                )}
                <button
                  className="text-blue-500 bg-blue-100 p-1 rounded"
                  onClick={() => {
                    setSelectedUser(enrollment);
                    setInfoModal(true);
                  }}
                  aria-label="View enrollment details"
                >
                  ℹ️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Modal */}
      {infoModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-6">
          <div className="bg-card p-6 rounded-lg w-96 text-left shadow-lg border border-border">
            <h2 className="mb-4 font-bold text-center">Enrollment Details</h2>
            <div className="space-y-2">
              <div>
                <span className="block font-semibold">Role</span>
                <input
                  type="text"
                  value={selectedUser.role}
                  readOnly
                  className="w-full border border-border p-2 rounded bg-background text-text"
                />
              </div>
              <div>
                <span className="block font-semibold">Description</span>
                <textarea
                  value={selectedUser.description}
                  readOnly
                  className="w-full border border-border p-2 rounded bg-background text-text h-24"
                />
              </div>
              <div>
                <span className="block font-semibold">Status</span>
                <input
                  type="text"
                  value={selectedUser.status}
                  readOnly
                  className="w-full border border-border p-2 rounded bg-background text-text"
                />
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="font-semibold">Documents</span>
                <button
                  className="text-blue-500"
                  onClick={() => {
                    setFileModal(true);
                    setCurrentIndex(0);
                  }}
                  aria-label="View document"
                >
                  ตรวจสอบ
                </button>
              </div>
            </div>
            <button
              className="mt-4 bg-red-500 w-full p-2 text-white rounded"
              onClick={() => setInfoModal(false)}
              aria-label="Close Info Modal"
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* File Modal */}
      {fileModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-card p-8 rounded-lg max-w-lg relative border border-border">
            {selectedUser.license_files && selectedUser.license_files.length > 0 ? (
              <div className="flex flex-col items-center">
                <img
                  src={`/api/images/${selectedUser.license_files[currentIndex]}`}
                  alt={`Document ${currentIndex + 1}`}
                  className="w-full h-auto mb-4"
                />
                <div className="flex justify-between w-full">
                  <button
                    className="bg-primary p-2 rounded text-white"
                    onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={currentIndex === 0}
                  >
                    ก่อนหน้า
                  </button>
                  <button
                    className="bg-primary p-2 rounded text-white"
                    onClick={() =>
                      setCurrentIndex((prev) =>
                        Math.min(prev + 1, selectedUser.license_files.length - 1)
                      )
                    }
                    disabled={currentIndex === selectedUser.license_files.length - 1}
                  >
                    ถัดไป
                  </button>
                </div>
              </div>
            ) : (
              <p>No documents available.</p>
            )}
            <button
              className="mt-4 bg-primary w-full p-2 text-white rounded"
              onClick={() => {
                setFileModal(false);
                setCurrentIndex(0);
              }}
              aria-label="Close Document Modal"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}