/* eslint-disable react/prop-types */
import React, { useState, useEffect,useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon, TrashIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { createEvent } from "../../../services/api/EventApi";
import { useAuth } from "../../../context/AuthContext";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { boxers } from "./mockBoxer";
import { defaultWeightClass } from "./DefaultWeightClass";

const SearchableSelect = ({ label, boxers, selectedBoxer, setSelectedBoxer }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBoxers = boxers.filter(
    (boxer) =>
      boxer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boxer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boxer.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        placeholder="ค้นหา Boxer..."
        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchTerm && filteredBoxers.length > 0 && (
        <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-md">
          {filteredBoxers.map((boxer) => (
            <div
              key={boxer.id}
              className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer transition duration-200"
              onClick={() => {
                setSelectedBoxer(boxer);
                setSearchTerm(""); // clear the search term after selection
              }}
            >
              <img
                src={boxer.profile_picture_url}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
              />
              <p className="text-gray-800 font-medium">
                {boxer.first_name} {boxer.last_name}
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedBoxer && (
        <div className="mt-2 flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-md">
          <img
            src={selectedBoxer.profile_picture_url}
            className="w-14 h-14 rounded-full object-cover border-2 border-gray-300"
          />
          <p className="ml-3 text-lg font-semibold text-gray-800">
            {selectedBoxer.first_name} {selectedBoxer.last_name}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedBoxer(null); // Clear the selected boxer
              setSearchTerm(""); // Reset the search term
            }}
            className="ml-auto text-gray-500 hover:text-red-500 transition duration-200"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};


const MatchModal = ({ 
  isOpen, 
  setIsOpen, 
  setMatches, 
  setWeightClasses,
  currentDate, 
  newMatch, 
  setNewMatch
}) => {

  const handleMatchInputChange = (e) => {
    const { name, value } = e.target;
    setNewMatch({ ...newMatch, [name]: value });
  };
  
  const saveMatch = () => {
    // Validate required fields
    if (!newMatch.boxer1_id || !newMatch.boxer2_id || !newMatch.match_time || !newMatch.weight_class_id) {
      toast.error("Please fill in all match details including weight class");
      return;
    }

    // Prevent boxer from matching against themselves
    if (newMatch.boxer1_id === newMatch.boxer2_id) {
      toast.error("A boxer cannot be matched against themselves");
      return;
    }
    setWeightClasses(defaultWeightClass);
    setMatches(prev => [...prev, { ...newMatch, match_date: currentDate }]);
    // Reset form and close modal
    setNewMatch({ 
      id: Date.now(),
      boxer1_id: "", 
      boxer2_id: "", 
      match_time: "",
      weight_class_id: ""
    });
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">Add Match for {new Date(currentDate).toLocaleDateString()}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Weight Class
            </label>
            <select
              name="weight_class_id"
              value={newMatch.weight_class_id || ""}
              onChange={handleMatchInputChange}
              className="w-full border rounded-lg py-2 px-3"
              required
            >
              <option value="">-- Select Weight Class --</option>
              {defaultWeightClass.map((wc) => (
                <option key={wc.id} value={wc.id}>
                  {wc.weigh_name} ({wc.min_weight} kg - {wc.max_weight} kg)
                </option>
              ))}
            </select>
          </div>

          <SearchableSelect
            label="Boxer 1"
            boxers={boxers}
            selectedBoxer={boxers.find(b => b.id === newMatch.boxer1_id) || null}
            setSelectedBoxer={(boxer) => {
              setNewMatch({ ...newMatch, boxer1_id: boxer?.id || null });
            }}
          />

          <SearchableSelect
            label="Boxer 2"
            boxers={boxers}
            selectedBoxer={boxers.find(b => b.id === newMatch.boxer2_id) || null}
            setSelectedBoxer={(boxer) => {
              setNewMatch({ ...newMatch, boxer2_id: boxer?.id || null });
            }}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Match Time
            </label>
            <input
              type="time"
              name="match_time"
              value={newMatch.match_time}
              onChange={handleMatchInputChange}
              className="w-full border rounded-lg py-2 px-3"
              required
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button 
            onClick={() => setIsOpen(false)} 
            className="px-4 py-2 mr-2 border rounded-lg"
          >
            Cancel
          </button>
          <button 
            onClick={saveMatch} 
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const SeatZoneModal = ({ isOpen, setIsOpen, seatZones, setSeatZones, editingSeat, setEditingSeat }) => {
  const [zone_name, setZoneName] = useState(editingSeat?.zone_name || "");
  const [number_of_seat, setNumberOfSeat] = useState(editingSeat?.number_of_seat || "");
  const [price, setPrice] = useState(editingSeat?.price || "");
  const [errors, setErrors] = useState({});

  const validateSeat = () => {
    const newErrors = {};
    if (!zone_name) newErrors.zone_name = "Please enter zone name.";
    if (!number_of_seat || number_of_seat <= 0) newErrors.number_of_seat = "Please enter a valid quantity.";
    if (!price || price <= 0) newErrors.price = "Please enter a valid price.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveSeat = () => {
    if (!validateSeat()) return;
  
    const newSeatZone = {
      id: editingSeat ? editingSeat.id : Date.now(),
      zone_name,
      number_of_seat: parseInt(number_of_seat),
      price: parseInt(price),
    };
  
    const generatedSeats = Array.from({ length: number_of_seat }, (_, index) => ({
      seat_number: `${zone_name}-${index + 1}`,
    }));
  
    if (editingSeat) {
      // Update existing seat zone
      const updatedSeatZones = seatZones.map((seat) =>
        seat.id === editingSeat.id
          ? { ...seat, zone_name, number_of_seat, price, seats: generatedSeats }
          : seat
      );
      setSeatZones(updatedSeatZones);
    } else {
      // Add new seat zone
      setSeatZones([...seatZones, { ...newSeatZone, seats: generatedSeats }]);
    }
  
    // Reset form
    setIsOpen(false);
    setEditingSeat(null);
    setZoneName("");
    setNumberOfSeat("");
    setPrice("");
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">{editingSeat ? "Edit Seat Zone" : "Add Seat Zone"}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Zone Name</label>
            <input type="text" value={zone_name} onChange={(e) => setZoneName(e.target.value)} className="w-full border rounded-lg py-2 px-3" />
            {errors.zone_name && <p className="text-red-500 text-sm">{errors.zone_name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <input type="number" value={number_of_seat} onChange={(e) => setNumberOfSeat(e.target.value)} className="w-full border rounded-lg py-2 px-3" />
            {errors.number_of_seat && <p className="text-red-500 text-sm">{errors.number_of_seat}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Price</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border rounded-lg py-2 px-3" />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 mr-2 border rounded-lg">Cancel</button>
          <button onClick={handleSaveSeat} className="px-4 py-2 bg-primary text-white rounded-lg">{editingSeat ? "Update" : "Save"}</button>
        </div>
      </div>
    </div>
  );
};

const WeightClassModal = ({ isOpen, setIsOpen, weightClasses, setWeightClasses, editingWeightClass, setEditingWeightClass }) => {
  const [type, setType] = useState(editingWeightClass?.type || "");
  const [weigh_name, setWeighName] = useState(editingWeightClass?.weigh_name || "");
  const [min_weight, setMinWeight] = useState(editingWeightClass?.min_weight || "");
  const [max_weight, setMaxWeight] = useState(editingWeightClass?.max_weight || "");
  const [max_enrollment, setMaxEnrollment] = useState(editingWeightClass?.max_enrollment || "");
  const [price, setPrice] = useState(editingWeightClass?.price || "");
  const [errors, setErrors] = useState({});

  const validateWeightClass = () => {
    const newErrors = {};
    if (!type) newErrors.type = "Please enter type.";
    if (!weigh_name) newErrors.weigh_name = "Please enter weight name.";
    if (!min_weight || min_weight <= 0) newErrors.min_weight = "Please enter a valid minimum weight.";
    if (!max_weight || max_weight <= min_weight) newErrors.max_weight = "Max weight must be greater than min weight.";
    if (!max_enrollment || max_enrollment <= 0) newErrors.max_enrollment = "Please enter a valid max enrollment.";
    if (price && price < 0) newErrors.price = "Price cannot be negative.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveWeightClass = () => {
    if (!validateWeightClass()) return;

    const newWeightClass = {
      id: editingWeightClass ? editingWeightClass.id : Date.now(),
      type,
      weigh_name,
      min_weight: parseFloat(min_weight),
      max_weight: parseFloat(max_weight),
      max_enrollment: parseInt(max_enrollment),
      price: price ? parseFloat(price) : "",
      matches: editingWeightClass 
        ? [...editingWeightClass.matches] 
        : [] // เริ่มต้นด้วย array ว่างหากสร้างใหม่
    };
    
    const updatedWeightClasses = editingWeightClass
      ? weightClasses.map(wc => wc.id === editingWeightClass.id ? newWeightClass : wc)
      : [...weightClasses, newWeightClass];

    setWeightClasses(updatedWeightClasses);
    setIsOpen(false);
    setEditingWeightClass(null);
    setType("");
    setWeighName("");
    setMinWeight("");
    setMaxWeight("");
    setMaxEnrollment("");
    setPrice("");
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">{editingWeightClass ? "Edit Weight Class" : "Add Weight Class"}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Type</label>
            <input type="text" value={type} onChange={(e) => setType(e.target.value)} className="w-full border rounded-lg py-2 px-3" />
            {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Weight Name</label>
            <input type="text" value={weigh_name} onChange={(e) => setWeighName(e.target.value)} className="w-full border rounded-lg py-2 px-3" />
            {errors.weigh_name && <p className="text-red-500 text-sm">{errors.weigh_name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Min Weight (kg)</label>
            <input type="number" value={min_weight} onChange={(e) => setMinWeight(e.target.value)} className="w-full border rounded-lg py-2 px-3" />
            {errors.min_weight && <p className="text-red-500 text-sm">{errors.min_weight}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Max Weight (kg)</label>
            <input type="number" value={max_weight} onChange={(e) => setMaxWeight(e.target.value)} className="w-full border rounded-lg py-2 px-3" />
            {errors.max_weight && <p className="text-red-500 text-sm">{errors.max_weight}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Max Enrollment</label>
            <input type="number" value={max_enrollment} onChange={(e) => setMaxEnrollment(e.target.value)} className="w-full border rounded-lg py-2 px-3" />
            {errors.max_enrollment && <p className="text-red-500 text-sm">{errors.max_enrollment}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Price (optional)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border rounded-lg py-2 px-3" />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 mr-2 border rounded-lg">Cancel</button>
          <button onClick={handleSaveWeightClass} className="px-4 py-2 bg-primary text-white rounded-lg">{editingWeightClass ? "Update" : "Save"}</button>
        </div>
      </div>
    </div>
  );
};

const AddEventForm = () => {
  const navigate = useNavigate();
  const { organizer_id } = useParams();
  const user = useAuth();
//   console.log("organize id = ",organizer_id);
  
const locations = [
    { location_id: "66123abc1234567890abcde2", name: "Lumpinee Thai Boxing Stadium" },
    { location_id: "66123abc1234567890abcde0", name: "Rajadamnern Stadium" },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [eventData, setEventData] = useState({
    organizer_id: organizer_id || "",
    location_id: "",
    event_name: "",
    level: "",
    description: "",
    poster_url: null,
    seatZone_url: null,
    previewPoster: null,
    start_date: "",
    end_date: "",
    event_type: "",
    status: "preparing"
  });

  const [weightClasses, setWeightClasses] = useState([]);
  const [seatZones, setSeatZones] = useState([]);
  const [matches, setMatches] = useState([]);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [isWeightClassModalOpen, setIsWeightClassModalOpen] = useState(false);
  const [editingSeat, setEditingSeat] = useState(null);
  const [editingWeightClass, setEditingWeightClass] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [newMatch, setNewMatch] = useState({ boxer1_id: "", boxer2_id: "", match_time: "" });

  const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    let currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const [availableDates, setAvailableDates] = useState([]);
  useEffect(() => {
    if (eventData.start_date && eventData.end_date) {
      const dateRange = getDatesInRange(eventData.start_date, eventData.end_date);
      setAvailableDates(dateRange);
    } else {
      setAvailableDates([]);
    }
  }, [eventData.start_date, eventData.end_date]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventData({ ...eventData, poster_url: file, previewPoster: URL.createObjectURL(file) });
    }
  };

  const handleEditSeat = (seat) => {
    setEditingSeat(seat);
    setIsSeatModalOpen(true);
  };

  const handleDeleteSeat = (seatId) => {
    setSeatZones(seatZones.filter(s => s.id !== seatId));
  };

  const handleEditWeightClass = (weightClass) => {
    setEditingWeightClass(weightClass);
    setIsWeightClassModalOpen(true);
  };

  const handleDeleteWeightClass = (weightClassId) => {
    setWeightClasses(weightClasses.filter(wc => wc.id !== weightClassId));
  };

  const handleAddMatch = (date) => {
    setCurrentDate(date.toISOString().split('T')[0]);
    setIsMatchModalOpen(true);
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps && validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  
  const fileSeatInputRef = useRef(null);
  const [fileSeatPreviews, setFileSeatPreviews] = useState([]);
  const [seatImg, setSeatImg] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileSeatPreviews([e.target.result]); // แสดงรูปที่อัปโหลด
      };
      reader.readAsDataURL(file);
      setSeatImg(file);
      setEventData({ ...eventData, seatZone_url: file });
    }
  };

  
  const handleRemoveImage = (index) => {
    setFileSeatPreviews([]); // ลบรูปภาพทั้งหมด
    setSeatImg(null); // ลบ posterURL
    setEventData({ ...eventData, seatZone_url: null });
  };
  const handleRemovePoster = (index) => {
    setEventData({ ...eventData, poster_url: null, previewPoster: null });
  };


  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!eventData.event_name || !eventData.location_id) {
          toast.error("Please fill in event name and location");
          return false;
        }
        return true;
      case 2:
        if (!eventData.start_date || !eventData.end_date) {
          toast.error("Please set start and end dates");
          return false;
        }
        if (eventData.event_type === "registration" && weightClasses.length === 0) {
          toast.error("Please add at least one weight class");
          return false;
        }
        if (eventData.event_type === "ticket_sales" && seatZones.length === 0) {
          toast.error("Please add at least one seat zone");
          return false;
        }
        return true;
      case 3:
        if (eventData.event_type === "ticket_sales" && matches.length === 0) {
          toast.error("Please add at least one match");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== totalSteps) {
      // ถ้าไม่ใช่ขั้นตอนสุดท้าย ให้ทำการไปขั้นตอนต่อไปแทน
      goToNextStep();
      return;
    }
    
    if (!validateCurrentStep()) return;
    console.log(eventData);
      const formData = new FormData();

      // ใส่ค่าที่ไม่ใช่ไฟล์โดยแปลงเป็น JSON String
      formData.append("organizer_id", eventData.organizer_id);
      formData.append("location_id", eventData.location_id);
      formData.append("event_name", eventData.event_name);
      formData.append("level", eventData.level.toLowerCase());
      formData.append("start_date", eventData.start_date);
      formData.append("end_date", eventData.end_date);
      formData.append("description", eventData.description);
      formData.append("event_type", eventData.event_type);
      formData.append("status", eventData.status || "preparing");
      
      // แปลง Array/Object ให้เป็น JSON แล้วส่งไป
      formData.append("seat_zones", JSON.stringify(seatZones));
      formData.append("weight_classes", JSON.stringify(
        weightClasses.map(wc => ({
          ...wc,
          matches: matches
            .filter(match => match.weight_class_id === wc.id)
            .map(match => ({
              match_date: match.match_date,
              match_time: match.match_time,
              boxer1_id: match.boxer1_id,
              boxer2_id: match.boxer2_id
            }))
        }))
      ));
      
      // ใส่ไฟล์ภาพ (ถ้ามี)
      console.log();
      
      if (eventData.poster_url) {
        formData.append("poster_url", eventData.poster_url); // ใช้ชื่อ key "poster_url"
      }
      
      if (eventData.seatZone_url) {
        formData.append("seatZone_url", eventData.seatZone_url); // ใช้ชื่อ key "seatZone_url"
      }

    try {
      const response = await createEvent(formData);
      toast.success("Event created successfully!");
      console.log(response);
      
      // navigate(`/organizer/events/${organizer_id}`);
      navigate('/event/management/eventList');
    } catch (error) {
      toast.error("Failed to create event");
      console.error(error);
    }
  };

  const renderStepIndicator = () => {
    const steps = ["Basic Info", "Details", "Matches", "Review"];
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;
            return (
              <div key={stepNumber} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${isActive ? "border-primary bg-primary text-white" : isCompleted ? "border-green-500 bg-green-500 text-white" : "border-gray-300 text-gray-500"}`}>
                  {isCompleted ? <CheckIcon className="w-6 h-6" /> : stepNumber}
                </div>
                <p className={`mt-2 text-xs font-medium ${isActive ? "text-primary" : isCompleted ? "text-green-500" : "text-gray-500"}`}>{step}</p>
              </div>
            );
          })}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-300" style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}></div>
        </div>
      </div>
    );
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-gray-700">Event Name</label>
          <input 
            type="text" 
            name="event_name" 
            value={eventData.event_name} 
            onChange={handleInputChange} 
            className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition ease-in-out duration-200" 
            placeholder="Enter event name" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Location ID</label>
          <select
            name="location_id"
            value={eventData.location_id}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition ease-in-out duration-200"
            required
          >
            <option value="">-- Select Location --</option>
            {locations.map((location, index) => (
              <option key={index} value={location.location_id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Level</label>
          <select 
            name="level" 
            value={eventData.level} 
            onChange={handleInputChange} 
            className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition ease-in-out duration-200" 
            required
          >
            <option value="">-- Select Level --</option>
            <option value="beginner">Beginner</option>
            <option value="fighter">Fighter</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-gray-700">Description</label>
          <textarea 
            name="description" 
            value={eventData.description} 
            onChange={handleInputChange} 
            className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition ease-in-out duration-200" 
            rows="4" 
            placeholder="Enter event description" 
          />
        </div>
  
        <div className="md:col-span-2">
          <label className="block mb-1">Poster</label>
          <input
            type="file"
            ref={fileSeatInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <div className="mt-4 flex justify-center">
            {eventData.previewPoster ? (
              <div className="relative w-full max-w-2xl">
                <img
                  src={eventData.previewPoster}
                  alt="Preview"
                  className="w-full h-80 object-cover rounded-lg border border-border/50 mx-auto"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePoster(0)}
                  className="absolute top-1 right-1 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                >
                  <XMarkIcon className="h-3 w-3 text-white" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileSeatInputRef.current.click()}
                className="flex flex-col items-center justify-center w-full max-w-2xl h-80 border-2 border-gray-300 border-dashed border-border/50 rounded-lg hover:border-primary/50 transition-colors mx-auto"
              >
                <PhotoIcon className="h-8 w-8 text-text/40" />
                <p className="mt-2 text-sm text-text/60">Click to upload a photo</p>
              </button>
            )}
          </div>
        </div>


      </div>
    </div>
  );
  

  const renderDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input type="date" name="start_date" value={eventData.start_date} onChange={handleInputChange} className="w-full border rounded-lg py-2 px-3" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input type="date" name="end_date" value={eventData.end_date} onChange={handleInputChange}disabled={!eventData.start_date} min={eventData.start_date} className="w-full border rounded-lg py-2 px-3" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Event Type</label>
          <select name="event_type" value={eventData.event_type} onChange={handleInputChange} className="w-full border rounded-lg py-2 px-3">
            <option value="">-- Select Event Type --</option>
            <option value="registration">Open for Registration</option>
            <option value="ticket_sales">Ticket Sale</option>
          </select>
        </div>
      </div>

      {eventData.event_type === "registration" ? (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-lg font-medium">Weight Classes</h3>
            <button onClick={() => setIsWeightClassModalOpen(true)} className="p-1 rounded-full bg-rose-500 text-white">
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
          <table className="w-full border-collapse border rounded-lg text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Weight Name</th>
                <th className="p-2 border">Min Weight</th>
                <th className="p-2 border">Max Weight</th>
                <th className="p-2 border">Max Enrollment</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {weightClasses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-2 border text-center text-gray-500">
                    No weight classes added yet. Please add a weight class.
                  </td>
                </tr>
              ) : (
                weightClasses.map((wc) => (
                  <tr key={wc.id} className="text-center">
                    <td className="p-2 border">{wc.type}</td>
                    <td className="p-2 border">{wc.weigh_name}</td>
                    <td className="p-2 border">{wc.min_weight}</td>
                    <td className="p-2 border">{wc.max_weight}</td>
                    <td className="p-2 border">{wc.max_enrollment}</td>
                    <td className="p-2 border">{wc.price || "Free"}</td>
                    <td className="p-2 border">
                      <button className="text-blue-500 mr-2" onClick={() => handleEditWeightClass(wc)}>
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-red-500" onClick={() => handleDeleteWeightClass(wc.id)}>
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-lg font-medium">Seat Zones</h3>
            <button onClick={() => setIsSeatModalOpen(true)} className="p-1 rounded-full bg-rose-500 text-white">
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
          <table className="w-full border-collapse border rounded-lg text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Zone</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Actions</th>
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
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="text-red-500" onClick={() => handleDeleteSeat(seat.id)}>
                      <TrashIcon className="h-4 w-4" />
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
              ref={fileSeatInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/png, image/jpeg"
            />
            <div className="mt-4 flex justify-center">
              {fileSeatPreviews.length > 0 ? (
                <div className="relative">
                  <img
                    src={fileSeatPreviews[0]}
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
                  onClick={() => fileSeatInputRef.current.click()}
                  className="flex flex-col items-center justify-center w-4/5 h-80 border-2 border-gray-300 border-dashed border-border/50 rounded-lg hover:border-primary/50 transition-colors mx-auto"
                >
                  <PhotoIcon className="h-8 w-8 text-text/40" />
                  <p className="mt-2 text-sm text-text/60">Click to upload a photo</p>
                </button>
              )}
            </div>
          </div>
        </div>
        
      )}
    </div>
  );

  const handleDeleteMatch = (matchToDelete) => {
    if (matchToDelete) {
      const updatedFighters = matches.filter(
        (match) => match.id !== matchToDelete.id
      );
      setMatches(updatedFighters);
    }
  };
  
  const renderMatches = () => (
    eventData.event_type === "ticket_sales" ? (
      <div className="space-y-6">
        <h3 className="text-lg font-medium mb-3">Event Matches</h3>
        {matches.length === 0 ? (
          <div className="text-center py-10 bg-card border rounded-lg">
            <p>No matches added yet</p>
            <p className="text-sm mt-2">Click on a date in the calendar to add matches</p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableDates.map((date, dateIndex) => {
              const dateString = date.toISOString().split('T')[0];
              const dayMatches = matches.filter(m => m.match_date === dateString);
              if (dayMatches.length === 0) return null;
  
              return (
                <div key={dateIndex} className="bg-card border rounded-lg p-4">
                  <h4 className="text-md font-medium mb-2">
                    {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h4>
                  <div className="space-y-2">
                    {dayMatches.map((match, matchIndex) => {
                      const boxer1 = boxers.find(boxer => boxer.id === match.boxer1_id);
                      const boxer2 = boxers.find(boxer => boxer.id === match.boxer2_id);
                      return (
                        <div key={matchIndex} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div>
                            <p className="font-medium">{boxer1?.first_name} {boxer1?.last_name} vs {boxer2?.first_name} {boxer2?.last_name}</p>
                            <p className="text-sm">{match.match_time}</p>
                          </div>
                          {/* ปุ่มลบสำหรับการลบแมตช์ */}
                          <button
                            onClick={() => handleDeleteMatch(match)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <button type="button" onClick={() => handleAddMatch(date)} className="mt-2 text-sm text-primary hover:text-secondary">
                    + Add more matches
                  </button>
                </div>
              );
            })}
          </div>
        )}
  
        {availableDates.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Match Calendar</h3>
            <div className="bg-card border rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {availableDates.map((date, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-2 flex flex-col items-center cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleAddMatch(date)}
                  >
                    <span className="text-sm font-medium">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span className="text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    {matches.some(m => m.match_date === date.toISOString().split('T')[0]) && (
                      <div className="mt-1 w-4 h-4 rounded-full bg-primary"></div>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm">Click on a date to add matches</p>
            </div>
          </div>
        )}
      </div>
    ) : (
      <div className="text-center py-10">
        <p>No matches to configure for Open Registration events</p>
      </div>
    )
  );
  

  const renderReview = () => (
    <div className="space-y-6">
  <h3 className="text-xl font-bold mb-4">Event Summary</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="border p-4 rounded-lg">
      <h4 className="text-lg font-medium mb-3">Basic Information</h4>
      <p>Event Name: {eventData.event_name}</p>
      <p>
        Location: {
          locations.find(loc => loc.location_id === eventData.location_id)?.name || 
          "Unknown Location"
        }
      </p>
      <p>Level: {eventData.level}</p>
      <p>Type: {eventData.event_type === "registration" ? "Open for Registration" : "Ticket Sale"}</p>
    </div>
    
    <div className="border p-4 rounded-lg">
      <h4 className="text-lg font-medium mb-3">Schedule</h4>
      <p>Start: {new Date(eventData.start_date).toLocaleDateString()}</p>
      <p>End: {new Date(eventData.end_date).toLocaleDateString()}</p>
    </div>

    {eventData.event_type === "registration" ? (
      <div className="border p-4 rounded-lg md:col-span-2">
        <h4 className="text-lg font-medium mb-3">Weight Classes</h4>
        {weightClasses.map((wc, index) => (
          <div key={index} className="mb-2">
            <p>{wc.weigh_name} ({wc.min_weight}-{wc.max_weight}kg) - Max: {wc.max_enrollment} {wc.price ? `- ฿${wc.price}` : "(Free)"}</p>
          </div>
        ))}
      </div>
    ) : (
      <>
        <div className="border p-4 rounded-lg">
          <h4 className="text-lg font-medium mb-3">Seat Zones</h4>
          {seatZones.map((sz, index) => (
            <p key={index}>{sz.zone_name} - ฿{sz.price} ({sz.number_of_seat} seats)</p>
          ))}
        </div>
        
        <div className="border p-4 rounded-lg">
          <h4 className="text-lg font-medium mb-3">Matches</h4>
          {matches.map((m, index) => {
            const boxer1 = boxers.find(b => b.id === m.boxer1_id);
            const boxer2 = boxers.find(b => b.id === m.boxer2_id);
            
            return (
              <div key={index} className="mb-2">
                <p className="flex flex-row">
                  {boxer1 ? `${boxer1.first_name} "${boxer1.nickname}" ${boxer1.last_name}` : 'Unknown Boxer'} 
                  <h2 className="px-2">VS</h2>  
                  {boxer2 ? `${boxer2.first_name} "${boxer2.nickname}" ${boxer2.last_name}` : 'Unknown Boxer'}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(m.match_date).toLocaleDateString()} at {m.match_time}
                </p>
              </div>
            );
          })}
        </div>
      </>
    )}
  </div>

  {eventData.previewPoster && (
    <div className="border p-4 rounded-lg">
      <h4 className="text-lg font-medium mb-3">Poster</h4>
      <img src={eventData.previewPoster} alt="Poster" className="h-40 object-cover rounded-md" />
    </div>
  )}
  {fileSeatPreviews.length > 0 && (
    <div className="border p-4 rounded-lg">
      <h4 className="text-lg font-medium mb-3">Seat Zone</h4>
      <img src={fileSeatPreviews[0]} alt="Zone" className="h-40 object-cover rounded-md" />
    </div>
  )}

  

</div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderBasicInfo();
      case 2: return renderDetails();
      case 3: return renderMatches();
      case 4: return renderReview();
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto border rounded-lg p-6 shadow-md">
  <h1 className="text-2xl font-bold mb-6 text-center">Create New Event</h1>
  {renderStepIndicator()}
  
  {/* ไม่ใช้ form รอบทั้งหมด */}
  <div>
    {renderCurrentStep()}
  </div>
  
  <div className="flex justify-between mt-8">
    <button type="button" onClick={goToPreviousStep} className="flex items-center px-4 py-2 border rounded-lg">
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            {currentStep === 1 ? "Cancel" : "Previous"}
          </button>
    
    {currentStep < totalSteps ? (
      <button type="button" onClick={goToNextStep} className="flex items-center px-4 py-2 bg-primary text-white rounded-lg">
              Next <ChevronRightIcon className="h-5 w-5 ml-1" />
            </button>
    ) : (
      <button 
        type="button" 
        onClick={handleSubmit}
        className="flex items-center px-4 py-2 bg-primary text-white rounded-lg"
      >
        Create Event <CheckIcon className="h-5 w-5 ml-1" />
      </button>
    )}
  </div>
      <MatchModal
        isOpen={isMatchModalOpen}
        setIsOpen={setIsMatchModalOpen}
        setMatches={setMatches}
        setWeightClasses={setWeightClasses}
        currentDate={currentDate}
        newMatch={newMatch}
        setNewMatch={setNewMatch}
      />
      <SeatZoneModal
        isOpen={isSeatModalOpen}
        setIsOpen={setIsSeatModalOpen}
        seatZones={seatZones}
        setSeatZones={setSeatZones}
        editingSeat={editingSeat}
        setEditingSeat={setEditingSeat}
      />
      <WeightClassModal
        isOpen={isWeightClassModalOpen}
        setIsOpen={setIsWeightClassModalOpen}
        weightClasses={weightClasses}
        setWeightClasses={setWeightClasses}
        editingWeightClass={editingWeightClass}
        setEditingWeightClass={setEditingWeightClass}
      />
    </div>
  );
};

export default AddEventForm;
