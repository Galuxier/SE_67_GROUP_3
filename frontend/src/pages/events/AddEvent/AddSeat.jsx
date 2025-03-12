import { useState, useEffect } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";

export default function FormAddSeat() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // รับค่าข้อมูลอีเวนต์จาก state หรือ localStorage
  const eventData = state?.formData || JSON.parse(localStorage.getItem("eventData"));

  const [seats, setSeats] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");

  // State สำหรับเก็บค่าจากฟอร์ม
  const [seatNumber, setSeatNumber] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);

  // State สำหรับเก็บข้อมูล seat ที่กำลังแก้ไข
  const [editingSeat, setEditingSeat] = useState(null);

  // State สำหรับ Modal ยืนยันการลบ
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [seatToDelete, setSeatToDelete] = useState(null);

  // State สำหรับแสดงข้อผิดพลาด
  const [errors, setErrors] = useState({});

  // โหลดข้อมูล seats จาก localStorage
  useEffect(() => {
    const savedSeats = JSON.parse(localStorage.getItem("seats")) || [];
    setSeats(savedSeats);
  }, []);

  const handleDeleteSeat = () => {
    if (seatToDelete) {
      const updatedSeats = seats.filter((seat) => seat.id !== seatToDelete.id);
      setSeats(updatedSeats);
      localStorage.setItem("seats", JSON.stringify(updatedSeats));
      setIsDeleteModalOpen(false); // ปิด Modal ยืนยันการลบ
      setSeatToDelete(null); // รีเซ็ต seatToDelete
    }
  };

  const handleSaveSeats = () => {
    if (!image) {
      setImageError("Please upload an image.");
      return;
    }

    const finalEventData = {
      ...eventData,
      seats: seats,
      image: URL.createObjectURL(image), // เพิ่มรูปภาพในข้อมูล
    };
    localStorage.setItem("completeEvent", JSON.stringify(finalEventData));
    navigate("/event/addFighter");
  };
  // ฟังก์ชันสำหรับการอัพโหลดรูปภาพ
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setImageError("File size should be less than 5MB.");
        setImage(null);
      } else if (!file.type.startsWith("image/")) {
        setImageError("Please upload an image file.");
        setImage(null);
      } else {
        setImageError("");
        setImage(file);
      }
    }
  };

  // ฟังก์ชันสำหรับเพิ่มหรือแก้ไข seat
  const handleAddSeat = () => {
    const newErrors = {};
    if (!seatNumber) newErrors.seatNumber = "Please enter seat number.";
    if (!quantity || quantity <= 0) newErrors.quantity = "Please enter a valid quantity.";
    if (!price || price <= 0) newErrors.price = "Please enter a valid price.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingSeat) {
      // แก้ไข seat ที่มีอยู่
      const updatedSeats = seats.map((seat) =>
        seat.id === editingSeat.id
          ? { ...seat, seatNumber, quantity, price }
          : seat
      );
      setSeats(updatedSeats);
      localStorage.setItem("seats", JSON.stringify(updatedSeats));
    } else {
      // เพิ่ม seat ใหม่
      const newSeat = {
        id: Date.now(),
        seatNumber,
        quantity,
        price,
      };
      setSeats([...seats, newSeat]);
      localStorage.setItem("seats", JSON.stringify([...seats, newSeat]));
    }

    setIsModalOpen(false); // ปิด Modal
    setEditingSeat(null); // รีเซ็ต editingSeat
    setSeatNumber(""); // รีเซ็ต seatNumber
    setQuantity(0); // รีเซ็ต quantity
    setPrice(0); // รีเซ็ต price
    setErrors({}); // รีเซ็ต errors
  };

  // ฟังก์ชันสำหรับเปิด Modal แก้ไข
  const handleEditSeat = (seat) => {
    setEditingSeat(seat); // ตั้งค่าข้อมูล seat ที่จะแก้ไข
    setSeatNumber(seat.seatNumber); // ตั้งค่า seatNumber จาก seat ที่เลือก
    setQuantity(seat.quantity); // ตั้งค่า quantity จาก seat ที่เลือก
    setPrice(seat.price); // ตั้งค่า price จาก seat ที่เลือก
    setIsModalOpen(true); // เปิด Modal
  };

  // ฟังก์ชันสำหรับเปิด Modal ยืนยันการลบ
  const handleDeleteConfirmation = (seat) => {
    setSeatToDelete(seat); // ตั้งค่าข้อมูล seat ที่จะลบ
    setIsDeleteModalOpen(true); // เปิด Modal ยืนยันการลบ
  };

  // ฟังก์ชันสำหรับปิด Modal ยืนยันการลบ
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false); // ปิด Modal ยืนยันการลบ
    setSeatToDelete(null); // รีเซ็ต seatToDelete
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-[1000px] p-10 shadow-lg bg-white rounded-lg relative">
        <div className="flex flex-col items-center mb-6">
          <label className="block text-lg font-semibold text-gray-700">
            Event : {eventData?.eventName || "ไม่พบชื่ออีเวนต์"}
          </label>
          <label className="block text-sm text-gray-600">
            Date : {eventData?.startDate} - {eventData?.endDate}
          </label>
          <label className="block text-sm text-gray-600">
            Location : {eventData?.location}
          </label>
        </div>
        <br></br>
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium">Seat</h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <table className="w-full border-collapse border rounded-lg text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Seat Number</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Edit</th>
              </tr>
            </thead>
            <tbody>
              {seats.map((seat) => (
                <tr key={seat.id} className="text-center">
                  <td className="p-2 border">{seat.seatNumber}</td>
                  <td className="p-2 border">{seat.quantity}</td>
                  <td className="p-2 border">{seat.price}</td>
                  <td className="p-2 border">
                    <button
                      className="text-blue-500 mr-2"
                      onClick={() => handleEditSeat(seat)} // เรียกใช้ handleEditSeat
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => handleDeleteConfirmation(seat)} // เรียกใช้ handleDeleteConfirmation
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ปุ่มอัพโหลดรูปภาพ */}
          <div className="mt-4">
            <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
              Please upload an image
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-2"
            />
            {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
            {image && (
              <div className="mt-2">
                <img src={URL.createObjectURL(image)} alt="Uploaded" className="max-w-full h-auto rounded-lg" />
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={() => navigate(-1)} variant="secondary">
              Cancel
            </Button>
            <Button className="ml-2" onClick={handleSaveSeats}>
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Modal สำหรับเพิ่มหรือแก้ไข seat */}
      {isModalOpen && (
        <Modal
          title={editingSeat ? "Edit Seat" : "Add Seat"} // ตั้งค่า title
          onClose={() => {
            setIsModalOpen(false);
            setEditingSeat(null); // รีเซ็ต editingSeat เมื่อปิด Modal
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Seat Number</label>
              <input
                type="text"
                placeholder="Seat Number"
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.seatNumber && (
                <p className="text-red-500 text-sm">{errors.seatNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm">{errors.quantity}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsModalOpen(false)} variant="secondary">Cancel</Button>
            <Button className="ml-2" onClick={handleAddSeat}>
              {editingSeat ? "Update" : "Save"} {/* เปลี่ยนข้อความปุ่มตามการแก้ไขหรือเพิ่ม */}
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
            <p className="text-gray-700">Are you sure you want to delete this seat?</p>
            <div className="flex justify-end mt-4">
              <Button onClick={handleCancelDelete} variant="secondary">Cancel</Button>
              <Button className="ml-2" onClick={handleDeleteSeat} variant="danger">
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}