import { useState, useEffect, useRef } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import EventStepIndicator from "./EventStepIndicator";

export default function FormAddSeat() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const eventData = state?.formData || JSON.parse(sessionStorage.getItem("eventData"));
  const fileInputRef = useRef(null);

  const [seatZones, setSeatZones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filePreviews, setFilePreviews] = useState([]);
  const [zone_name, setZoneName] = useState("");
  const [number_of_seat, setNumberOfSeat] = useState("");
  const [price, setPrice] = useState("");
  const [editingSeat, setEditingSeat] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [seatToDelete, setSeatToDelete] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const savedSeats = JSON.parse(sessionStorage.getItem("seatZones")) || [];
    setSeatZones(savedSeats);
    const storedImage = sessionStorage.getItem("seatZoneImage");
    if (storedImage) setFilePreviews([storedImage]);
  }, []);

  const validateSeat = () => {
    const newErrors = {};
    if (!zone_name) newErrors.zone_name = "Please enter zone name.";
    if (!number_of_seat || number_of_seat <= 0) newErrors.number_of_seat = "Please enter a valid quantity.";
    if (!price || price <= 0) newErrors.price = "Please enter a valid price.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSeat = () => {
    if (!validateSeat()) return;

    const generatedSeats = Array.from({ length: parseInt(number_of_seat) }, (_, i) => ({
      seat_number: `${zone_name}-${i + 1}`,
    }));

    const newSeatZone = {
      id: editingSeat ? editingSeat.id : Date.now(),
      zone_name,
      number_of_seat: parseInt(number_of_seat),
      price: parseInt(price),
      seats: generatedSeats,
    };

    const updatedSeatZones = editingSeat
      ? seatZones.map((s) => (s.id === editingSeat.id ? newSeatZone : s))
      : [...seatZones, newSeatZone];

    setSeatZones(updatedSeatZones);
    sessionStorage.setItem("seatZones", JSON.stringify(updatedSeatZones));
    setIsModalOpen(false);
    setEditingSeat(null);
    setZoneName("");
    setNumberOfSeat("");
    setPrice("");
    setErrors({});
  };

  const handleDeleteSeat = () => {
    const updatedSeatZones = seatZones.filter((s) => s.id !== seatToDelete.id);
    setSeatZones(updatedSeatZones);
    sessionStorage.setItem("seatZones", JSON.stringify(updatedSeatZones));
    setIsDeleteModalOpen(false);
    setSeatToDelete(null);
  };

  const handleSubmit = () => {
    if (seatZones.length === 0) {
      setErrors({ general: "Please add at least one seat zone." });
      return;
    }
    if (filePreviews.length === 0) {
      setErrors({ general: "Please upload a seat zone image." });
      return;
    }

    const updatedEventData = {
      ...eventData,
      seat_zones: seatZones,
    };
    sessionStorage.setItem("eventData", JSON.stringify(updatedEventData));
    sessionStorage.setItem("seatZoneImage", filePreviews[0]);
    navigate("/event/management/create/match", { state: { formData: updatedEventData } });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreviews([e.target.result]);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFilePreviews([]);
  };

  const handleEditSeat = (seat) => {
    setEditingSeat(seat);
    setZoneName(seat.zone_name);
    setNumberOfSeat(seat.number_of_seat);
    setPrice(seat.price);
    setIsModalOpen(true);
  };

  const handleDeleteConfirmation = (seat) => {
    setSeatToDelete(seat);
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSeatToDelete(null);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-4/5 p-10 shadow-lg rounded-lg bg-white">
        <div className="flex flex-col items-center mb-6">
          <label className="block text-lg font-semibold text-gray-700">{eventData?.event_name}</label>
          <label className="block text-sm text-gray-600">
            {eventData?.start_date} - {eventData?.end_date}
          </label>
          <label className="block text-sm text-gray-600">{eventData?.location_id}</label>
        </div>
        <EventStepIndicator currentStep={3} />
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-2xl font-bold">Seat Zones</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white"
          >
            <Plus size={20} />
          </button>
        </div>
        {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}
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
            {seatZones.map((seat) => (
              <tr key={seat.id} className="text-center">
                <td className="p-2 border">{seat.zone_name}</td>
                <td className="p-2 border">{seat.number_of_seat}</td>
                <td className="p-2 border">{seat.price}</td>
                <td className="p-2 border">
                  <button className="text-blue-500 mr-2" onClick={() => handleEditSeat(seat)}>
                    <Pencil size={16} />
                  </button>
                  <button className="text-red-500" onClick={() => handleDeleteConfirmation(seat)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <label className="block mb-1">Seat Zone Image</label>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/png, image/jpeg" />
          {filePreviews.length > 0 ? (
            <div className="relative">
              <img src={filePreviews[0]} alt="Preview" className="w-full h-80 object-cover rounded-lg border" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 p-1 bg-red-500 rounded-full hover:bg-red-600"
              >
                <XMarkIcon className="h-3 w-3 text-white" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary"
            >
              <PhotoIcon className="h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Click to upload a seat zone image</p>
            </button>
          )}
        </div>
        <div className="flex justify-between mt-6">
          <Button onClick={() => navigate(-1)} variant="secondary">Previous</Button>
          <Button onClick={handleSubmit} className="ml-2">Next</Button>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          title={editingSeat ? "Edit Seat Zone" : "Add Seat Zone"}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSeat(null);
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Zone Name</label>
              <input
                type="text"
                value={zone_name}
                onChange={(e) => setZoneName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.zone_name && <p className="text-red-500 text-sm">{errors.zone_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                value={number_of_seat}
                onChange={(e) => setNumberOfSeat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.number_of_seat && <p className="text-red-500 text-sm">{errors.number_of_seat}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsModalOpen(false)} variant="secondary">Cancel</Button>
            <Button className="ml-2" onClick={handleAddSeat}>
              {editingSeat ? "Update" : "Save"}
            </Button>
          </div>
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal title="Confirm Delete" onClose={handleCancelDelete}>
          <p className="text-gray-700">Are you sure you want to delete this seat zone?</p>
          <div className="flex justify-end mt-4">
            <Button onClick={handleCancelDelete} variant="secondary">Cancel</Button>
            <Button className="ml-2" onClick={handleDeleteSeat} variant="primary">Delete</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}