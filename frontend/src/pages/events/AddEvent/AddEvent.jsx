import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { useAuth } from "../../../context/AuthContext";
import { PlusCircleIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import EventStepIndicator from "./EventStepIndicator";

const InputField = ({ label, name, type, min, value, onChange, error }) => (
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
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

const RadioGroup = ({ label, name, options, selectedValue, onChange, error }) => (
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
    {error && <p className="text-red-500 text-sm">{error}</p>}
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
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const locations = [
    { location_id: "66123abc1234567890abcdef", value: "", label: "-- Select Location--" },
    { location_id: "66123abc1234567890abcde2", value: "lumpinee", label: "Lumpinee Thai Boxing Stadium" },
    { location_id: "66123abc1234567890abcde0", value: "rajadamnern", label: "Rajadamnern Stadium" },
  ];

  const initialFormData = {
    organizer_id: user._id,
    location_id: "",
    event_name: "",
    level: "",
    start_date: "",
    end_date: "",
    description: "",
    poster_url: "",
    weight_classes: { type: "" },
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [filePreviews, setFilePreviews] = useState([]);

  useEffect(() => {
    const storedEventData = sessionStorage.getItem("eventData");
    if (storedEventData) setFormData(JSON.parse(storedEventData));

    const storedPoster = sessionStorage.getItem("posterImage");
    if (storedPoster) setFilePreviews([storedPoster]);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.event_name) newErrors.event_name = "Please enter event name.";
    if (!formData.level) newErrors.level = "Please select a level.";
    if (!formData.start_date) newErrors.start_date = "Please select a start date.";
    if (!formData.end_date) newErrors.end_date = "Please select an end date.";
    if (new Date(formData.end_date) < new Date(formData.start_date))
      newErrors.end_date = "End date must be after start date.";
    if (!formData.weight_classes.type) newErrors.weight_classes_type = "Please select a type.";
    if (!formData.location_id) newErrors.location_id = "Please select a location.";
    if (filePreviews.length === 0) newErrors.poster = "Please upload a poster.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        weight_classes: { ...prev.weight_classes, type: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    sessionStorage.setItem("eventData", JSON.stringify(formData));
    sessionStorage.setItem("posterImage", filePreviews[0]);

    if (formData.weight_classes.type === "Open for Registration") {
      navigate("/event/management/create/weightClass", { state: { formData } });
    } else {
      navigate("/event/management/create/weightClass", { state: { formData } });
    }
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Create Event</h2>
        <EventStepIndicator currentStep={1} />
        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField
            label="Event Name"
            name="event_name"
            value={formData.event_name}
            onChange={handleChange}
            error={errors.event_name}
          />
          <RadioGroup
            label="Level"
            name="level"
            options={["Rookie", "Fighter"]}
            selectedValue={formData.level}
            onChange={handleChange}
            error={errors.level}
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Start Date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              error={errors.start_date}
            />
            <InputField
              label="End Date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              min={formData.start_date}
              error={errors.end_date}
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">Location</label>
            <select
              name="location_id"
              value={formData.location_id}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-primary focus:border-primary"
            >
              {locations.map((loc) => (
                <option key={loc.location_id} value={loc.location_id}>
                  {loc.label}
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
                  <img src={filePreviews[0]} alt="Preview" className="w-full h-48 object-cover rounded-lg border" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600"
                  >
                    <XMarkIcon className="h-4 w-4 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="flex flex-col items-center justify-center w-full py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary"
                >
                  <PhotoIcon className="h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Click to upload a poster</p>
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
            error={errors.weight_classes_type}
          />
          <div className="flex justify-end mt-6 space-x-2">
            <Button onClick={() => navigate(-1)} variant="secondary">Cancel</Button>
            <Button type="submit" className="bg-primary hover:bg-primary-dark">Next</Button>
          </div>
        </form>
      </div>
    </div>
  );
}