import { useState, useEffect,useRef} from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import {PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import EventStepIndicator from "./EventStepIndicator";

export default function FormAddSeat() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // รับค่าข้อมูลอีเวนต์จาก state หรือ localStorage
  const eventData = state?.formDataW || JSON.parse(sessionStorage.getItem("eventData"));
  const posterImage = sessionStorage.getItem("posterImage");

  // console.log("poster",poster);
  
  const [seatZone, setSeats] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef(null);
  const [filePreviews, setFilePreviews] = useState([]);

  // State สำหรับเก็บค่าจากฟอร์ม
  const [zone_name, setSeatNumber] = useState("");
  const [number_of_seat, setQuantity] = useState(null);
  const [price, setPrice] = useState(null);

  // State สำหรับเก็บข้อมูล seat ที่กำลังแก้ไข
  const [editingSeat, setEditingSeat] = useState(null);

  // State สำหรับ Modal ยืนยันการลบ
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [seatToDelete, setSeatToDelete] = useState(null);

  // State สำหรับแสดงข้อผิดพลาด
  const [errors, setErrors] = useState({});

  // โหลดข้อมูล seats จาก localStorage
  useEffect(() => {
    const savedSeats = JSON.parse(localStorage.getItem("seatZone")) || [];
    setSeats(savedSeats);
    const storedImage = localStorage.getItem("seatZone_url");
      if (storedImage) {
        setFilePreviews([storedImage]); // ตั้งค่ารูปที่แสดงผล
      }
  }, []);

  const handleDeleteSeat = () => {
    if (seatToDelete) {
      const updatedSeats = seatZone.filter((seat) => seat.seat_zone_id !== seatToDelete.seat_zone_id);
      setSeats(updatedSeats);
      localStorage.setItem("seatZone", JSON.stringify(updatedSeats));
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
      seat_zones: seatZone.map((s)=> ({
        zone_name: s.zone_name,
        price: s.price,
        seats: s.seats,
        number_of_seat: s.number_of_seat,
      }))
    };
    console.log("final",finalEventData);
    
    localStorage.setItem("eventData", JSON.stringify(finalEventData));
    
    const reader = new FileReader();
    reader.readAsDataURL(image); // แปลงเป็น Base64
    reader.onloadend = () => {
      localStorage.setItem("seatZone_url", reader.result); // เก็บ Base64 ไว้
    };
    console.log(finalEventData);
    
    navigate("/event/management/create/match");
  };
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreviews([e.target.result]); // แสดงรูปที่อัปโหลด
        localStorage.setItem("seatZone_url", e.target.result); // เก็บรูปใน localStorage
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  
  const handleRemoveImage = (index) => {
    setFilePreviews([]); // ลบรูปภาพทั้งหมด
    setImage(null); // ลบ posterURL
  };



  // ฟังก์ชันสำหรับเพิ่มหรือแก้ไข seat
  const handleAddSeat = () => {
    const newErrors = {};
    if (!zone_name) newErrors.seatNumber = "Please enter seat number.";
    if (!number_of_seat || number_of_seat <= 0) newErrors.quantity = "Please enter a valid quantity.";
    if (!price || price <= 0) newErrors.price = "Please enter a valid price.";
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    // สร้าง seats ตามจำนวน number_of_seat
    const generatedSeats = Array.from({ length: number_of_seat }, (_, index) => ({
      seat_number: `${zone_name}-${index + 1}`, // สร้าง seat_number โดยใช้ zone_name และลำดับ
    }));
  
    if (editingSeat) {
      // แก้ไข seat zone ที่มีอยู่
      const updatedSeats = seatZone.map((seat) =>
        seat.seat_zone_id === editingSeat.seat_zone_id
          ? { ...seat, zone_name, number_of_seat, price, seats: generatedSeats }
          : seat
      );
      setSeats(updatedSeats);
      localStorage.setItem("seats", JSON.stringify(updatedSeats));
    } else {
      // เพิ่ม seat zone ใหม่
      const newSeatZone = {
        seat_zone_id: null,
        zone_name,
        number_of_seat,
        price,
        seats: generatedSeats,
      };
      setSeats([...seatZone, newSeatZone]);
      localStorage.setItem("seatZone", JSON.stringify([...seatZone, newSeatZone]));
      // console.log(newSeatZone);
      
    }
  
    setIsModalOpen(false); // ปิด Modal
    setEditingSeat(null); // รีเซ็ต editingSeat
    setSeatNumber(""); // รีเซ็ต seatNumber
    setQuantity(null); // รีเซ็ต quantity
    setPrice(null); // รีเซ็ต price
    setErrors({}); // รีเซ็ต errors
  };

  // ฟังก์ชันสำหรับเปิด Modal แก้ไข
  const handleEditSeat = (seat) => {
    setEditingSeat(seat); // ตั้งค่าข้อมูล seat ที่จะแก้ไข
    setSeatNumber(seat.zone_name); // ตั้งค่า seatNumber จาก seat ที่เลือก
    setQuantity(seat.number_of_seat); // ตั้งค่า quantity จาก seat ที่เลือก
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
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-4/5 p-10 shadow-lg  rounded-lg relative bg-white">
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
        <EventStepIndicator currentStep={3} />
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium">Seat</h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <table className="w-full border-collapse border rounded-lg text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Zone</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Edit</th>
              </tr>
            </thead>
            <tbody>
              {seatZone.map((seat) => (
                <tr key={seat.seat_zone_id} className="text-center">
                  <td className="p-2 border">{seat.zone_name}</td>
                  <td className="p-2 border">{seat.number_of_seat}</td>
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

          <div>
          <label className="block mb-1">Seat Zone</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/png, image/jpeg"
            />
            <div className="mt-4 flex justify-center">
              {filePreviews.length > 0 ? (
                <div className="relative">
                  <img
                    src={filePreviews[0]}
                    alt="Preview"
                    className="w-full h-80 object-cover rounded-lg border border-border/50 mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(0)}
                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <XMarkIcon className="h-3 w-3 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="flex flex-col items-center justify-center w-4/5 h-80 border-2 border-dashed border-border/50 rounded-lg hover:border-primary/50 transition-colors mx-auto"
                >
                  <PhotoIcon className="h-8 w-8 text-text/40" />
                  <p className="mt-2 text-sm text-text/60">Click to upload a photo</p>
                </button>
              )}
            </div>
            {imageError && <p className="text-red-500 text-sm text-center mt-2">{imageError}</p>}
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
              <label className="block text-sm font-medium text-gray-700">Zone</label>
              <input
                type="text"
                placeholder="Zone"
                value={zone_name}
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
                value={number_of_seat}
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
              <Button className="ml-2" onClick={handleDeleteSeat} variant="primary">
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}