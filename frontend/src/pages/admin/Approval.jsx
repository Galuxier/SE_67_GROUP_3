import { useState } from "react";

export default function Approval() {
  const [infoModal, setInfoModal] = useState(false);
  const [fileModal, setFileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterRole, setFilterRole] = useState("all"); // State สำหรับ Filter Role

  const users = [
    {
      id: 1,
      avatar: "https://th.bing.com/th/id/OIP.GkJ22eV9EN4902Jp1gb08wHaFI?rs=1&pid=ImgDetMain",
      name: "นายเก้า เท็นสิบ",
      time: "2025-03-01",
      email: "fffff@gmail.com",
      reviewer: "ดีีี",
      status: "Pending",
      role: "gym_owner", // เปลี่ยน Role ให้ตรงกับ Filter
      username: "kaoten10",
      phone: "0812345678",
      document: [
        "https://www.siriwongpanid.com/wp-content/uploads/2021/11/5054069A.jpg",
        "https://th.bing.com/th/id/R.145e6fcce39f2d430686b55325a1977e?rik=BPa1NCU4Gth23A&riu=http%3a%2f%2ff.ptcdn.info%2f796%2f021%2f000%2f1406693375-1JPG-o.jpg&ehk=5hXSRstxvaXPpFDd12OmCMHv5gDKgEpbZ3epKjlZ5KQ%3d&risl=&pid=ImgRaw&r=0",
        "https://th.bing.com/th/id/OIP.CoVEOXNLmioLcyPO_HPzTwHaJR?rs=1&pid=ImgDetMain",
      ],
    },
    // เพิ่มข้อมูลผู้ใช้อื่นๆ ตามต้องการ
  ];

  // ฟังก์ชันกรองข้อมูลตาม Role
  const filteredUsers = filterRole === "all" 
    ? users 
    : users.filter((user) => user.role === filterRole);

  // ตัวเลือก Filter Role
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
          <div>ชื่อ-นามสกุล</div>
          <div>Time</div>
          <div>Email</div>
          <div>Reviewer</div>
          <div>Status</div>
          <div>Action</div>
        </div>
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-7 p-2 border-b border-border items-center text-center hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div>
              <img src={user.avatar} alt="Avatar" className="w-12 h-12 rounded-full mx-auto" />
            </div>
            <div>{user.name}</div>
            <div>{user.time}</div>
            <div>{user.email}</div>
            <div>{user.reviewer}</div>
            <div>{user.status}</div>
            <div className="flex justify-center space-x-2">
              <span className="text-green-500 cursor-pointer">✔️</span>
              <span className="text-red-500 cursor-pointer">❌</span>
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => {
                  setSelectedUser(user);
                  setInfoModal(true);
                }}
                aria-label="View user details"
              >
                ℹ️
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Info Modal */}
      {infoModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-6">
          <div className="bg-card p-6 rounded-lg w-96 text-left shadow-lg border border-border">
            <img src={selectedUser.avatar} alt="Profile" className="rounded-full mb-4 mx-auto w-24 h-24" />
            <h2 className="mb-4 font-bold text-center">{selectedUser.role}</h2>
            <div className="space-y-2">
              <div>
                <span className="block font-semibold">Username</span>
                <input
                  type="text"
                  value={selectedUser.username}
                  readOnly
                  className="w-full border border-border p-2 rounded bg-background text-text"
                />
              </div>
              <div>
                <span className="block font-semibold">Name</span>
                <input
                  type="text"
                  value={selectedUser.name}
                  readOnly
                  className="w-full border border-border p-2 rounded bg-background text-text"
                />
              </div>
              <div>
                <span className="block font-semibold">Email</span>
                <input
                  type="email"
                  value={selectedUser.email}
                  readOnly
                  className="w-full border border-border p-2 rounded bg-background text-text"
                />
              </div>
              <div>
                <span className="block font-semibold">Phone Number</span>
                <input
                  type="text"
                  value={selectedUser.phone}
                  readOnly
                  className="w-full border border-border p-2 rounded bg-background text-text"
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="font-semibold">เอกสาร</span>
                <button
                  className="text-blue-500"
                  onClick={() => setFileModal(true)}
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
            {selectedUser.document && selectedUser.document.length > 0 ? (
              <div className="flex flex-col items-center">
                <img
                  src={selectedUser.document[currentIndex]}
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
                        Math.min(prev + 1, selectedUser.document.length - 1)
                      )
                    }
                    disabled={currentIndex === selectedUser.document.length - 1}
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