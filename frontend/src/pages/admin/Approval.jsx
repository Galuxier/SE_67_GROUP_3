import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  UserCircleIcon,
  XMarkIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as CheckCircleSolidIcon,
  XCircleIcon as XCircleSolidIcon
} from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import { getAllEnrollment, updateEnrollment } from "../../services/api/AdminApi";
import { getImage } from "../../services/api/ImageApi";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const encodeUserId = (userId) => {
  return btoa(userId);
};

const ROLE_DISPLAY = {
  boxer: "นักมวย",
  trainer: "โค้ชมวย",
  gym_owner: "เจ้าของค่ายมวย",
  organizer: "ผู้จัดการแข่งขัน",
  shop_owner: "เจ้าของร้านค้า",
  lessor: "ผู้ให้เช่าสถานที่",
  admin: "ผู้ดูแลระบบ",
};

const isImageFile = (fileUrl) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  return imageExtensions.some((ext) => fileUrl.toLowerCase().endsWith(ext));
};

const isPdfFile = (fileUrl) => {
  return fileUrl.toLowerCase().endsWith(".pdf");
};

export default function AdminApproval() {
  const { user } = useAuth();
  const [profileImages, setProfileImages] = useState({});
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // เพิ่ม state สำหรับ filter status
  const [infoModal, setInfoModal] = useState(false);
  const [fileModal, setFileModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "create_at",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // เพิ่ม state สำหรับหน้าปัจจุบัน
  const rowsPerPage = 10; // จำนวนแถวต่อหน้า

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const response = await getAllEnrollment();
        const enrollmentData = Array.isArray(response) ? response : [];
        setEnrollments(enrollmentData);
        setFilteredEnrollments(enrollmentData);
        
        const imagePromises = enrollmentData.map(async (enrollment) => {
          if (enrollment.user_id.profile_picture_url) {
            try {
              const imageUrl = await getImage(enrollment.user_id.profile_picture_url);
              return { [enrollment.user_id._id]: imageUrl };
            } catch (error) {
              console.error(`Failed to load image for ${enrollment.user_id.username}:`, error);
              return { [enrollment.user_id._id]: null };
            }
          }
          return { [enrollment.user_id._id]: null };
        });

        const images = await Promise.all(imagePromises);
        const imageMap = Object.assign({}, ...images);
        setProfileImages(imageMap);
      } catch (error) {
        console.error("Failed to fetch enrollments:", error);
        setEnrollments([]);
        setFilteredEnrollments([]);
      }
    };

    fetchEnrollment();
  }, []);

  // Filter and sort logic
  useEffect(() => {
    let filtered = [...enrollments];

    // Filter by role
    if (filterRole) {
      filtered = filtered.filter((enrollment) => enrollment.role === filterRole);
    }

    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter((enrollment) => enrollment.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (enrollment) =>
          enrollment.user_id.username.toLowerCase().includes(lowercasedSearch) ||
          enrollment.user_id.first_name.toLowerCase().includes(lowercasedSearch) ||
          enrollment.user_id.last_name.toLowerCase().includes(lowercasedSearch) ||
          enrollment.user_id.email.toLowerCase().includes(lowercasedSearch)
      );
    }

    // Sort
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (sortConfig.key.includes(".")) {
          const [parent, child] = sortConfig.key.split(".");
          if (!a[parent] || !b[parent]) return 0;

          if (a[parent][child] < b[parent][child]) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (a[parent][child] > b[parent][child]) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        }

        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredEnrollments(filtered);
    setCurrentPage(1); // รีเซ็ตไปหน้าแรกเมื่อมีการกรองใหม่
  }, [enrollments, filterRole, filterStatus, searchTerm, sortConfig]);

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredEnrollments.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredEnrollments.length / rowsPerPage);

  const handleSortClick = (key) => {
    let direction = "asc";
    if (sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return <ChevronUpIcon className="w-4 h-4 ml-1 opacity-30" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUpIcon className="w-4 h-4 ml-1 text-text" />
    ) : (
      <ChevronDownIcon className="w-4 h-4 ml-1 text-text" />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "d MMM yyyy, HH:mm", { locale: th });
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };

  const handleInfoClick = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setInfoModal(true);
  };

  const handleFilesClick = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setCurrentFileIndex(0);
    setFileModal(true);
  };

  const handleRejectClick = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setRejectReason("");
    setRejectModal(true);
  };

  const handleEnrollmentAction = async (id, status, reason = null) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("status", status);
      formData.append("reviewer_id", user._id);
      if (reason) formData.append("reject_reason", reason);

      const response = await updateEnrollment(id, formData);
      setEnrollments((prev) =>
        prev.map((enrollment) => (enrollment._id === id ? response.data : enrollment))
      );
      setRejectModal(false);
      setInfoModal(false);
      toast.success(`คำขอได้รับการ${status === "approved" ? "อนุมัติ" : "ปฏิเสธ"}แล้ว`);
    } catch (error) {
      console.error(`Error ${status === "approved" ? "approving" : "rejecting"} enrollment:`, error);
      toast.error(`เกิดข้อผิดพลาดในการ${status === "approved" ? "อนุมัติ" : "ปฏิเสธ"}คำขอ`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReject = () => {
    if (!rejectReason.trim()) {
      toast.error("กรุณาระบุเหตุผลในการปฏิเสธคำขอ");
      return;
    }
    handleEnrollmentAction(selectedEnrollment._id, "rejected", rejectReason);
  };

  const roleOptions = [
    { value: "boxer", display: "นักมวย" },
    { value: "trainer", display: "โค้ชมวย" },
    { value: "gym_owner", display: "เจ้าของค่ายมวย" },
    { value: "organizer", display: "ผู้จัดการแข่งขัน" },
    { value: "shop_owner", display: "เจ้าของร้านค้า" },
    { value: "lessor", display: "ผู้ให้เช่าสถานที่" },
  ];

  return (
    <div className="p-6 bg-background text-text min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">ระบบจัดการคำขอบทบาท</h1>
        <p className="text-text/70">อนุมัติหรือปฏิเสธคำขอบทบาทจากผู้ใช้งาน</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-card border border-border/50 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium mb-1">ค้นหาผู้ใช้</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ชื่อผู้ใช้, อีเมล, ชื่อ-นามสกุล"
              className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            />
          </div>

          <div className="w-full md:w-48">
            <label className="block text-sm font-medium mb-1">กรองตามบทบาท</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            >
              <option value="">ทุกบทบาท</option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.display}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-48">
            <label className="block text-sm font-medium mb-1">กรองตามสถานะ</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            >
              <option value="">ทุกสถานะ</option>
              <option value="pending">รอดำเนินการ</option>
              <option value="approved">อนุมัติแล้ว</option>
              <option value="rejected">ปฏิเสธแล้ว</option>
            </select>
          </div>

          <button
            onClick={() => {
              setFilterRole("");
              setFilterStatus("");
              setSearchTerm("");
              setSortConfig({ key: "create_at", direction: "desc" });
            }}
            className="px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors"
          >
            รีเซ็ตตัวกรอง
          </button>
        </div>
      </div>

      {/* Enrollment Table */}
      <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-bar">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSortClick("user_id.username")}>
                    <span>ผู้ใช้</span>
                    {getSortIcon("user_id.username")}
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSortClick("role")}>
                    <span>บทบาทที่ขอ</span>
                    {getSortIcon("role")}
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSortClick("user_id.first_name")}>
                    <span>ชื่อ-นามสกุล</span>
                    {getSortIcon("user_id.first_name")}
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSortClick("user_id.email")}>
                    <span>อีเมล</span>
                    {getSortIcon("user_id.email")}
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSortClick("create_at")}>
                    <span>เวลาร้องขอ</span>
                    {getSortIcon("create_at")}
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSortClick("updated_at")}>
                    <span>เวลาตอบกลับ</span>
                    {getSortIcon("updated_at")}
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">
                  <span>ผู้ดำเนินการ</span>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSortClick("status")}>
                    <span>สถานะ</span>
                    {getSortIcon("status")}
                  </div>
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text/70 uppercase tracking-wider">
                  <span>การดำเนินการ</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {Array.isArray(currentRows) && currentRows.length > 0 ? (
                currentRows.map((enrollment) => (
                  <tr key={enrollment._id} className="hover:bg-bar/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col items-center">
                        <Link to={`/user/${encodeUserId(enrollment.user_id._id)}`} className="relative group">
                          {profileImages[enrollment.user_id._id] ? (
                            <img
                              src={profileImages[enrollment.user_id._id]}
                              alt={enrollment.user_id.username}
                              className="h-10 w-10 rounded-full z=10 object-cover border border-border group-hover:border-primary transition-colors"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-text/70 border border-border group-hover:border-primary transition-colors">
                              <UserCircleIcon className="h-8 w-8" />
                            </div>
                          )}
                          <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        </Link>
                        <Link
                          to={`/user/${encodeUserId(enrollment.user_id._id)}`}
                          className="mt-1 text-sm text-text hover:text-primary transition-colors"
                        >
                          {enrollment.user_id.username}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                        {ROLE_DISPLAY[enrollment.role] || enrollment.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm">
                        {enrollment.user_id.first_name} {enrollment.user_id.last_name}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm">{enrollment.user_id.email}</div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="text-sm">{formatDate(enrollment.create_at)}</div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="text-sm">
                        {enrollment.updated_at && enrollment.updated_at !== enrollment.create_at
                          ? formatDate(enrollment.updated_at)
                          : "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {enrollment.reviewer_id ? (
                        <Link
                          to={`/user/${encodeUserId(enrollment.reviewer_id._id)}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {enrollment.reviewer_id.first_name} {enrollment.reviewer_id.last_name}
                        </Link>
                      ) : (
                        <span className="text-sm text-text/50">-</span>
                      )}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${statusColors[enrollment.status]}`}>
                        {enrollment.status === "pending" && "รอดำเนินการ"}
                        {enrollment.status === "approved" && "อนุมัติแล้ว"}
                        {enrollment.status === "rejected" && "ปฏิเสธแล้ว"}
                      </span>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-sm text-text/70">
                      <div className="flex space-x-1">
                        {enrollment.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleEnrollmentAction(enrollment._id, "approved")}
                              className="p-1 text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-300 bg-green-100 dark:bg-green-900/30 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                              title="อนุมัติ"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleRejectClick(enrollment)}
                              className="p-1 text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-300 bg-red-100 dark:bg-red-900/30 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                              title="ปฏิเสธ"
                            >
                              <XCircleIcon className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleInfoClick(enrollment)}
                          className="p-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-500 dark:hover:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/30 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                          title="ดูรายละเอียด"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleFilesClick(enrollment)}
                          className="p-1 text-amber-600 hover:text-amber-800 dark:text-amber-500 dark:hover:text-amber-300 bg-amber-100 dark:bg-amber-900/30 rounded-md hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                          title="ดูเอกสาร"
                        >
                          <DocumentTextIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-6 text-center text-text/70 bg-background">
                    ไม่พบคำขอในขณะนี้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredEnrollments.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 bg-bar border-t border-border">
            <div className="text-sm text-text/70">
              แสดง {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, filteredEnrollments.length)} จาก{" "}
              {filteredEnrollments.length} รายการ
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-background hover:bg-background/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              10 rows per page
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === index + 1
                      ? "bg-primary text-white"
                      : "bg-background hover:bg-background/80"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md bg-background hover:bg-background/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Information Modal */}
      {infoModal && selectedEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold text-text">รายละเอียดคำขอ</h2>
              <button
                onClick={() => setInfoModal(false)}
                className="text-text/70 hover:text-text transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-4">
                {profileImages[selectedEnrollment.user_id._id] ? (
                  <img
                    src={profileImages[selectedEnrollment.user_id._id]}
                    alt={selectedEnrollment.user_id.username}
                    className="h-16 w-16 rounded-full object-cover border border-border"
                  />
                ) : (
                  <UserCircleIcon className="h-16 w-16 text-text/50" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-text">
                    {selectedEnrollment.user_id.first_name} {selectedEnrollment.user_id.last_name}
                  </h3>
                  <p className="text-text/70">@{selectedEnrollment.user_id.username}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text/70 mb-1">บทบาทที่ขอ</label>
                  <div className="px-3 py-2 bg-background border border-border rounded-lg">
                    {ROLE_DISPLAY[selectedEnrollment.role] || selectedEnrollment.role}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text/70 mb-1">อีเมล</label>
                  <div className="px-3 py-2 bg-background border border-border rounded-lg">
                    {selectedEnrollment.user_id.email}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text/70 mb-1">คำอธิบาย</label>
                <div className="px-3 py-2 bg-background border border-border rounded-lg min-h-[100px]">
                  {selectedEnrollment.description}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text/70 mb-1">เอกสารประกอบ</label>
                <div className="grid grid-cols-3 gap-4">
                  {Array.isArray(selectedEnrollment.license_urls) &&
                  selectedEnrollment.license_urls.length > 0 ? (
                    selectedEnrollment.license_urls.map((file, index) => (
                      <div
                        key={index}
                        className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          setCurrentFileIndex(index);
                          setFileModal(true);
                        }}
                      >
                        {isImageFile(file) ? (
                          <img
                            src={`/api/images/${file}`}
                            alt={`เอกสารที่ ${index + 1}`}
                            className="w-full h-36 object-cover"
                          />
                        ) : isPdfFile(file) ? (
                          <div className="w-full h-36 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                            <DocumentTextIcon className="h-12 w-12 text-text/70" />
                          </div>
                        ) : (
                          <div className="w-full h-36 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                            <span className="text-text/70">ไม่รู้จัก</span>
                          </div>
                        )}
                        <div className="p-2 text-center text-sm text-text/70">
                          เอกสารที่ {index + 1}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-text/70">ไม่มีเอกสารประกอบ</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-text/70 mb-1">วันที่ร้องขอ</label>
                  <div className="px-3 py-2 bg-background border border-border rounded-lg">
                    {formatDate(selectedEnrollment.create_at)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text/70 mb-1">สถานะ</label>
                  <div
                    className={`px-3 py-2 border border-border rounded-lg text-center ${
                      statusColors[selectedEnrollment.status]
                    }`}
                  >
                    {selectedEnrollment.status === "pending" && "รอดำเนินการ"}
                    {selectedEnrollment.status === "approved" && "อนุมัติแล้ว"}
                    {selectedEnrollment.status === "rejected" && "ปฏิเสธแล้ว"}
                  </div>
                </div>
              </div>

              {selectedEnrollment.status === "rejected" && selectedEnrollment.reject_reason && (
                <div>
                  <label className="block text-sm font-medium text-text/70 mb-1">เหตุผลการปฏิเสธ</label>
                  <div className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-red-800 dark:text-red-300">
                    {selectedEnrollment.reject_reason}
                  </div>
                </div>
              )}

              {selectedEnrollment.status === "pending" && (
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => handleEnrollmentAction(selectedEnrollment._id, "approved")}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircleSolidIcon className="h-5 w-5 mr-2" />
                    อนุมัติ
                  </button>
                  <button
                    onClick={() => handleRejectClick(selectedEnrollment)}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircleSolidIcon className="h-5 w-5 mr-2" />
                    ปฏิเสธ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* File Modal */}
      {fileModal && selectedEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold text-text">
                เอกสารประกอบ ({currentFileIndex + 1}/{selectedEnrollment.license_urls.length})
              </h2>
              <button
                onClick={() => setFileModal(false)}
                className="text-text/70 hover:text-text transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-grow relative p-4">
              {selectedEnrollment.license_urls.length > 0 ? (
                <>
                  {isImageFile(selectedEnrollment.license_urls[currentFileIndex]) ? (
                    <img
                      src={`/api/images/${selectedEnrollment.license_urls[currentFileIndex]}`}
                      alt={`เอกสารที่ ${currentFileIndex + 1}`}
                      className="w-full h-full object-contain"
                    />
                  ) : isPdfFile(selectedEnrollment.license_urls[currentFileIndex]) ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-text/70 mb-4">
                        ไฟล์ PDF: {selectedEnrollment.license_urls[currentFileIndex].split("/").pop()}
                      </p>
                      <a
                        href={`/api/images/${selectedEnrollment.license_urls[currentFileIndex]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        ดู/ดาวน์โหลด PDF
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-text/70">
                      ไม่สามารถแสดงไฟล์นี้ได้ ({selectedEnrollment.license_urls[currentFileIndex]})
                    </div>
                  )}

                  {selectedEnrollment.license_urls.length > 1 && (
                    <>
                      {currentFileIndex > 0 && (
                        <button
                          onClick={() => setCurrentFileIndex((prev) => prev - 1)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full border border-gray-300 shadow-md transition-colors"
                        >
                          <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
                        </button>
                      )}
                      {currentFileIndex < selectedEnrollment.license_urls.length - 1 && (
                        <button
                          onClick={() => setCurrentFileIndex((prev) => prev + 1)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full border border-gray-300 shadow-md transition-colors"
                        >
                          <ChevronRightIcon className="h-6 w-6 text-gray-700" />
                        </button>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-text/70">
                  ไม่มีเอกสารประกอบ
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && selectedEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold text-text">ปฏิเสธคำขอ</h2>
              <button
                onClick={() => setRejectModal(false)}
                className="text-text/70 hover:text-text transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text/70 mb-1">เหตุผลการปฏิเสธ</label>
                <textarea
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="กรุณาระบุเหตุผลในการปฏิเสธคำขอ"
                  className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setRejectModal(false)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSubmitReject}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? "กำลังดำเนินการ..." : "ปฏิเสธคำขอ"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}