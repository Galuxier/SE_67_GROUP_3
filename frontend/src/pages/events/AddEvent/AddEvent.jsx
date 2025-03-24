import { useState, useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { useAuth } from "../../../context/AuthContext";
import { PlusCircleIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import MockUsers from "./MockBoxer";

const InputField = ({ label, name, type, min, value, onChange }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type || "text"}
      id={name}
      name={name}
      min={min}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const RadioGroup = ({ label, name, options, selectedValue, onChange }) => (
  <div className="mb-4">
    <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
    <div className="flex space-x-4">
      {options.map((option) => (
        <div key={option} className="flex items-center">
          <input
            type="radio"
            id={`${name}-${option}`}
            name={name}
            value={option}
            checked={selectedValue === option}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor={`${name}-${option}`} className="ml-2 text-sm text-gray-700">
            {option}
          </label>
        </div>
      ))}
    </div>
  </div>
);

const TextArea = ({ label, name, value, onChange }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      rows="4"
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default function FormAddEvent() {
  const navigate = useNavigate();
  const { user } = useAuth(); // user ที่ล็อกอินอยู่

  const locations = [
    { location_id: "66123abc1234567890abcdef", value: "", label: "-- Select Location--" },
    { location_id: "66123abc1234567890abcde2", value: "lumpinee", label: "Lumpinee Thai Boxing Stadium" },
    { location_id: "66123abc1234567890abcde0", value: "rajadamnern", label: "Rajadamnern Stadium" },
  ];

  // ตั้งค่าเริ่มต้นของ formData
  const initialFormData = {
    organizer_id: user._id,
    location_id: "",
    event_name: "",
    level: "",
    start_date: null,
    end_date: "",
    description: "",
    poster_url: "",
    weight_classes: {
      type: "",
    },
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posterURL,setPosterURL] = useState(null);
  const fileInputRef = useRef(null);
  const [filePreviews, setFilePreviews] = useState([]);

  console.log(formData);
  

  const weightClass = [
    {
      weigh_name: "Lightweight",
      min_weight: 50,
      max_weight: 60,
      max_enrollment: 100,
      matches: []
    },
    {
      weigh_name: "Middleweight",
      min_weight: 61,
      max_weight: 75,
      max_enrollment: 150,
      matches: []
    },
    {
      weigh_name: "Heavyweight",
      min_weight: 76,
      max_weight: 90,
      max_enrollment: 200,
      matches: []
    },
    {
      weigh_name: "Super Heavyweight",
      min_weight: 91,
      max_weight: 120,
      max_enrollment: 50,
      matches: []
    }
  ];

  // โหลด eventData ถ้ามีใน localStorage
  useEffect(() => {
    const storedEventData = localStorage.getItem("eventData");
    if (storedEventData) {
      const parsedEventData = JSON.parse(storedEventData);
      setFormData(parsedEventData);
    }

    const storedPoster = localStorage.getItem("poster_url");
    if (storedPoster) {
      setFilePreviews([storedPoster]);
      setPosterURL(storedPoster);
    }
  }, []);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.event_name) newErrors.event_name = "Please enter event name.";
    if (!formData.level) newErrors.level = "Please select a level.";
    if (!formData.start_date) newErrors.start_date = "Please select a start date.";
    if (!formData.end_date) newErrors.end_date = "Please select an end date.";
    if (!formData.weight_classes.type) newErrors.weight_classes_type = "Please select a type."; // ใช้ weight_classes_type แทน
    if (!formData.location_id) newErrors.location_id = "Please select a location.";
    if(filePreviews.length == 0) newErrors.poster = "Please upload a poster."
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        weight_classes: {
          ...prev.weight_classes,
          type: value, // อัปเดต type ใน weight_classes
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (formData.weight_classes.type === "Open for Registration") {
        setIsModalOpen(true);
      } else {
        
        const formDataW = {
          ...formData, // คัดลอกข้อมูลเดิมจาก eventData
          weight_classes: weightClass.map((wc) => ({
            type: formData.weight_classes.type, // ใช้ type จาก eventData หรือค่าเริ่มต้น
            weigh_name: wc.weigh_name, // ใช้ weigh_name จาก weightClasses
            min_weight: wc.min_weight,
            max_weight: wc.max_weight,
            max_enrollment: wc.max_enrollment,
            matches:[]
          })),
        };
        const reader = new FileReader();
        reader.readAsDataURL(posterURL); // แปลงเป็น Base64
        reader.onloadend = () => {
          localStorage.setItem("poster_url", reader.result); // เก็บ Base64 ไว้
        };
        navigate("/event/management/create/seat", { state: { formDataW} });
      }
    }
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    navigate("/event/management/create/weightClass/", { state: { formData } });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreviews([e.target.result]); // อัปเดตรูปภาพที่แสดง
        localStorage.setItem("poster_url", e.target.result); // บันทึกลง localStorage
      };
      reader.readAsDataURL(file);
      setPosterURL(file);
    }
  };

  const handleRemoveImage = (index) => {
    setFilePreviews([]); // ลบรูปภาพทั้งหมด
    setPosterURL(null); // ลบ posterURL
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
    <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
      Create Event
    </h2>
    <form className="space-y-4" onSubmit={handleSubmit}>
      <InputField
        label="Event Name"
        name="event_name"
        value={formData.event_name}
        onChange={handleChange}
      />
      {errors.event_name && <p className="text-red-500 text-sm">{errors.event_name}</p>}

      <RadioGroup
        label="Level"
        name="level"
        options={["Rookie", "Fighter"]}
        selectedValue={formData.level}
        onChange={handleChange}
      />
      {errors.level && <p className="text-red-500 text-sm">{errors.level}</p>}

      <div className="grid grid-cols-2 gap-4">
  {/* Start Date */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
    <input
      type="date"
      name="start_date"
      value={formData.start_date || ""}
      onChange={handleChange}
      className="border p-2 w-full rounded-lg shadow-sm focus:ring-primary focus:border-primary"
    />
  </div>

  {/* End Date - Disabled ถ้าไม่มี Start Date */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
    <input
      type="date"
      name="end_date"
      value={formData.end_date || ""}
      onChange={handleChange}
      min={formData.start_date} // วันที่ไม่สามารถเลือกก่อน Start Date ได้
      disabled={!formData.start_date} // Disable ถ้าไม่มี Start Date
      className={`border p-2 w-full rounded-lg shadow-sm focus:ring-primary focus:border-primary ${
        !formData.start_date ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    />
  </div>
</div>

      {/* แสดง Error ถ้าเลือกวันที่ผิด */}
      {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date}</p>}
      {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date}</p>}

      <div>
        <label className="block font-medium text-gray-700 mb-1">Location</label>
        <select
          name="location_id"
          value={formData.location_id}
          onChange={handleChange}
          className="border p-3 w-full rounded-lg shadow-sm focus:ring-primary focus:border-primary transition"
        >
          {locations.map((location, index) => (
            <option key={index} value={location.location_id}>
              {location.label}
            </option>
          ))}
        </select>
        {errors.location_id && <p className="text-red-500 text-sm">{errors.location_id}</p>}
      </div>

      <div>
        <label className="block font-medium text-gray-700 mb-1">Poster</label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/png, image/jpeg"
        />
        <div className="mt-4">
          {filePreviews.length > 0 ? (
            <div className="relative">
              <img
                src={filePreviews[0]}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(0)}
                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition"
              >
                <XMarkIcon className="h-4 w-4 text-white" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="flex flex-col items-center justify-center w-full py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition"
            >
              <PhotoIcon className="h-10 w-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Click to upload a photo</p>
            </button>
          )}
        </div>
        {errors.poster && <p className="text-red-500 text-sm">{errors.poster}</p>}
      </div>

      <TextArea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />

      <RadioGroup
        label="Type"
        name="type"
        options={["Open for Registration", "Open for Ticket Sales"]}
        selectedValue={formData.weight_classes.type}
        onChange={handleChange}
      />
      {errors.weight_classes_type && (
        <p className="text-red-500 text-sm">{errors.weight_classes_type}</p>
      )}

      <div className="flex justify-end mt-6 space-x-2">
        <Button onClick={() => navigate(-1)} variant="secondary">
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary-dark transition">
          Save
        </Button>
      </div>
    </form>

    {isModalOpen && (
      <Modal onClose={handleCloseModal} onConfirm={handleConfirm}>
        <div>
          <p>Do you want to open registration for {formData.event_name}?</p>
          <p>from {formData.start_date} to {formData.end_date}?</p>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button onClick={handleCloseModal} variant="secondary">
            Cancel
          </Button>
          <Button className="bg-primary hover:bg-primary-dark transition" onClick={handleConfirm}>
            Save
          </Button>
        </div>
      </Modal>
    )}
  </div>
</div>

  );
}