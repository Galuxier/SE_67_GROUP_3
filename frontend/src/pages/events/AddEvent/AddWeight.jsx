import { useState, useEffect } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { createEvent } from "../../../services/api/EventApi";
import EventStepIndicator from "./EventStepIndicator";


export default function FormAddWeightClass() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // รับค่าข้อมูลอีเวนต์จาก state หรือ localStorage
  const eventData = state?.formData || JSON.parse(sessionStorage.getItem("eventData"));
  const posterImage = sessionStorage.getItem("posterImage");

  const [weightClasses, setWeightClasses] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State สำหรับเก็บค่าจากฟอร์ม
  const [weight_name, setWeightName] = useState("");
  const [min_weight, setMinWeight] = useState("");
  const [max_weight, setMaxWeight] = useState("");
  const [max_enrollment, setMaxEnrollment] = useState("");
  const [editingWeight, setEditingWeight] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [weightClassToDelete, setWeightClassToDelete] = useState(null);
  const [errors, setErrors] = useState({});

  // โหลดข้อมูล Weight Classes จาก localStorage
  useEffect(() => {
    const savedWeightClasses = JSON.parse(sessionStorage.getItem("weightClasses")) || [];
    setWeightClasses(savedWeightClasses);
  }, []);

  const handleDeleteWeightClass = () => {
    if (weightClassToDelete) {
      const updatedWeightClasses = weightClasses.filter((wc) => wc.id !== weightClassToDelete.id);
      setWeightClasses(updatedWeightClasses);
      sessionStorage.setItem("weightClasses", JSON.stringify(updatedWeightClasses));
      setIsDeleteModalOpen(false);
      setWeightClassToDelete(null);
    }
  };

  const createFileFromBase64 = (base64String, fileName) => {
    try {
      if (!base64String.includes(",")) {
        throw new Error("Invalid Base64 format");
      }

      // แปลง Base64 เป็น Blob
      const byteCharacters = atob(base64String.split(",")[1]); // ตัด "data:image/png;base64," ออก
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });

      // สร้าง File จาก Blob
      return new File([blob], fileName, { type: "image/png" });
    } catch (error) {
      console.error("Error converting Base64 to File:", error);
      return null;
    }
  };

  const handleSaveWeightClasses = () => {
    // Create the final event data with weight classes
    const eventDataWithWeightClasses = {
      ...eventData,
      weight_classes: weightClasses.map((wc) => ({
        type: eventData.weight_classes.type,
        weigh_name: wc.weight_name,
        min_weight: wc.min_weight,
        max_weight: wc.max_weight,
        max_enrollment: wc.max_enrollment,
      })),
    };

    // Store in sessionStorage
    sessionStorage.setItem("eventData", JSON.stringify(eventDataWithWeightClasses));
    
    // Navigate to next step
    navigate("/event/management/create/seat", { 
      state: { formDataW: eventDataWithWeightClasses }
    });
  };

  // ฟังก์ชันสำหรับเพิ่มหรือแก้ไข Weight Class
  const handleAddWeightClass = () => {
    const newErrors = {};
    if (!weight_name) newErrors.weight_name = "Please enter weight name.";
    if (!min_weight) newErrors.min_weight = "Please enter min weight.";
    if (!max_weight) newErrors.max_weight = "Please enter max weight.";
    if (!max_enrollment) newErrors.max_enrollment = "Please enter max enrollment.";
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    if (editingWeight) {
      // Edit existing weight class
      const updatedWeightClasses = weightClasses.map((wc) =>
        wc.id === editingWeight.id
          ? { ...wc, weight_name, min_weight, max_weight, max_enrollment } 
          : wc
      );
      setWeightClasses(updatedWeightClasses);
      sessionStorage.setItem("weightClasses", JSON.stringify(updatedWeightClasses));
    } else {
      // Add new weight class
      const newWeightClass = {
        id: Date.now(),
        weight_name,
        min_weight,
        max_weight,
        max_enrollment,
      };
      const updatedWeightClasses = [...weightClasses, newWeightClass];
      setWeightClasses(updatedWeightClasses);
      sessionStorage.setItem("weightClasses", JSON.stringify(updatedWeightClasses));
    }
  
    setIsModalOpen(false);
    setEditingWeight(null);
    setWeightName("");
    setMinWeight("");
    setMaxWeight("");
    setMaxEnrollment("");
    setErrors({});
  };

  // ฟังก์ชันสำหรับเปิด Modal แก้ไข
  const handleEditWeight = (weightClass) => {
    setEditingWeight(weightClass); // ตั้งค่าข้อมูล Weight Class ที่จะแก้ไข
    setWeightName(weightClass.weight_name); // ตั้งค่า weight_name จาก Weight Class ที่เลือก
    setMinWeight(weightClass.min_weight); // ตั้งค่า min_weight จาก Weight Class ที่เลือก
    setMaxWeight(weightClass.max_weight); // ตั้งค่า max_weight จาก Weight Class ที่เลือก
    setMaxEnrollment(weightClass.max_enrollment); // ตั้งค่า max_enrollment จาก Weight Class ที่เลือก
    setIsModalOpen(true); // เปิด Modal
  };

  // ฟังก์ชันสำหรับเปิด Modal ยืนยันการลบ
  const handleDeleteConfirmation = (weightClass) => {
    setWeightClassToDelete(weightClass); // ตั้งค่าข้อมูล Weight Class ที่จะลบ
    setIsDeleteModalOpen(true); // เปิด Modal ยืนยันการลบ
  };

  // ฟังก์ชันสำหรับปิด Modal ยืนยันการลบ
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false); // ปิด Modal ยืนยันการลบ
    setWeightClassToDelete(null); // รีเซ็ต weightClassToDelete
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-4/5 p-10 shadow-lg bg-white rounded-lg relative">
        <div className="flex flex-col items-center mb-6">
          <label className="block text-lg font-semibold text-gray-700">
            Event : {eventData?.event_name || "ไม่พบชื่ออีเวนต์"}
          </label>
          <label className="block text-sm text-gray-600">
            Date : {eventData?.start_date} - {eventData?.end_date}
          </label>
          <label className="block text-sm text-gray-600">
            Location : {eventData?.location_id}
          </label>
        </div>
        <EventStepIndicator currentStep={2} />
        {/* <br></br> */}
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-2xl font-blod">Weight Class</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <table className="w-full border-collapse border rounded-lg text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Weight</th>
                <th className="p-2 border">Min Weight</th>
                <th className="p-2 border">Max Weight</th>
                <th className="p-2 border">Total of boxers</th>
                <th className="p-2 border">Edit</th>
              </tr>
            </thead>
            <tbody>
              {weightClasses.map((weightClass) => ( // ใช้ weightClasses แทน filteredWeightClasses
                <tr key={weightClass.id} className="text-center">
                  <td className="p-2 border">{weightClass.weight_name}</td>
                  <td className="p-2 border">{weightClass.min_weight}</td>
                  <td className="p-2 border">{weightClass.max_weight}</td>
                  <td className="p-2 border">{weightClass.max_enrollment}</td>
                  <td className="p-2 border">
                    <button
                      className="text-blue-500 mr-2"
                      onClick={() => handleEditWeight(weightClass)} // เรียกใช้ handleEditWeight
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => handleDeleteConfirmation(weightClass)} // เรียกใช้ handleDeleteConfirmation
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-6">
            <Button onClick={() => navigate(-1)} variant="secondary">
              Previous
            </Button>
            <Button 
              className="ml-2" 
              onClick={handleSaveWeightClasses}
              disabled={weightClasses.length === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Modal สำหรับเพิ่มหรือแก้ไข Weight Class */}
      {isModalOpen && (
        <Modal
          title={editingWeight ? "Edit Weight Class" : "Add Weight Class"} // ตั้งค่า title
          onClose={() => {
            setIsModalOpen(false);
            setEditingWeight(null); // รีเซ็ต editingWeight เมื่อปิด Modal
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Weight Name</label>
              <input
                type="text"
                placeholder="Weight Name"
                value={weight_name}
                onChange={(e) => setWeightName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.weight_name && (
                <p className="text-red-500 text-sm">{errors.weight_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Min Weight</label>
              <input
                type="number"
                placeholder="Min Weight"
                value={min_weight}
                onChange={(e) => setMinWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.min_weight && (
                <p className="text-red-500 text-sm">{errors.min_weight}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Max Weight</label>
              <input
                type="number"
                placeholder="Max Weight"
                value={max_weight}
                onChange={(e) => setMaxWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.max_weight && (
                <p className="text-red-500 text-sm">{errors.max_weight}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Max Enrollment</label>
              <input
                type="number"
                placeholder="Max Enrollment"
                value={max_enrollment}
                onChange={(e) => setMaxEnrollment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.max_enrollment && (
                <p className="text-red-500 text-sm">{errors.max_enrollment}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsModalOpen(false)} variant="secondary">Cancel</Button>
            <Button className="ml-2" onClick={handleAddWeightClass}>
              {editingWeight ? "Update" : "Save"} {/* เปลี่ยนข้อความปุ่มตามการแก้ไขหรือเพิ่ม */}
            </Button>
          </div>
        </Modal>
      )}

      {/* Modal สำหรับยืนยันการลบ */}
      {isDeleteModalOpen && (
        <Modal
          title="Confirm Delete"
          onClose={handleCancelDelete} // ปิด Modal เมื่อคลิก Cancel
        >
          <div className="space-y-4">
            <p className="text-gray-700">Are you sure you want to delete this weight class?</p>
            <div className="flex justify-end mt-4">
              <Button onClick={handleCancelDelete} variant="secondary">Cancel</Button>
              <Button className="ml-2" onClick={handleDeleteWeightClass} variant="primary">
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}