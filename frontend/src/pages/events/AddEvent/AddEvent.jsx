import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";

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

const DatePicker = ({ label, name, value, onChange, min }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="date"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      min={min}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
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
  const locations = [
    { value: "", label: "-- Select Location--" },
    { value: "lumpinee", label: "Lumpinee Thai Boxing Stadium" },
    { value: "rajadamnern", label: "Rajadamnern Stadium" },
  ];

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("eventData");
    return savedData
      ? JSON.parse(savedData)
      : {
          eventName: "",
          level: "",
          startDate: "",
          endDate: "",
          description: "",
          type: "",
          location: "",
        };
  });

  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("eventData", JSON.stringify(formData));
  }, [formData]);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.eventName) newErrors.eventName = "Please enter event name.";
    if (!formData.level) newErrors.level = "Please select a level.";
    if (!formData.startDate) newErrors.startDate = "Please select a start date.";
    if (!formData.endDate) newErrors.endDate = "Please select an end date.";
    if (!formData.type) newErrors.type = "Please select a type.";
    if (!formData.location) newErrors.location = "Please select a location."; // แก้ไขตัวสะกด
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (formData.type === "Open for Registration") {
        setIsModalOpen(true);
      } else {
        localStorage.setItem("eventData", JSON.stringify(formData));
        navigate("/event/addSeat", { state: { formData } });
      }
    }
  };

  const handleConfirm = () => {
    localStorage.setItem("eventData", JSON.stringify(formData));
    setIsModalOpen(false);
    navigate("/event/addWeight", { state: { formData } }); // เปลี่ยนเส้นทางไปยัง /event/addWeight
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">Create Event</h2>
        <form className="mt-4" onSubmit={handleSubmit}>
          <InputField
            label="Event Name"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
          />
          {errors.eventName && <p className="text-red-500 text-sm">{errors.eventName}</p>}

          <RadioGroup
            label="Level"
            name="level"
            options={["Rookie", "Fighter"]}
            selectedValue={formData.level}
            onChange={handleChange}
          />
          {errors.level && <p className="text-red-500 text-sm">{errors.level}</p>}

          <div className="flex flex-row justify-between w-f">
            <DatePicker
              label="Start Date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
            {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
            <DatePicker
              label="End Date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
            {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="border p-2 w-full"
            >
              {locations.map((location, index) => (
                <option key={index} value={location.value}>
                  {location.label}
                </option>
              ))}
            </select>
            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
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
            selectedValue={formData.type}
            onChange={handleChange}
          />
          {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}

          <div className="flex justify-end mt-4">
            <Button onClick={() => navigate(-1)} variant="secondary">
              Cancel
            </Button>
            <Button className="ml-2" type="submit">
              Save
            </Button>
          </div>
        </form>

        {isModalOpen && (
          <Modal onClose={handleCloseModal} onConfirm={handleConfirm}>
            <div>
              <p>Do you want to open registration for {formData.eventName}</p>
              <p>from {formData.startDate} to {formData.endDate}?</p>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleCloseModal} variant="secondary">
                Cancel
              </Button>
              <Button className="ml-2" type="submit" onClick={handleConfirm}>
                Save
              </Button>
            </div>
           
          </Modal>
        )}
      </div>
    </div>
  );
}