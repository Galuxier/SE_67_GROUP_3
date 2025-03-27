/* eslint-disable react/prop-types */
import React, { useState, useEffect,useRef,useMemo  } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon, TrashIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { createEvent } from "../../../services/api/EventApi";
import { useAuth } from "../../../context/AuthContext";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { defaultWeightClass } from "./DefaultWeightClass";
import { getBoxers } from "../../../services/api/BoxerApi";
import { getImage } from "../../../services/api/ImageApi";
import { getPlaces } from "../../../services/api/PlaceApi";
import { set } from "date-fns";

const PlaceModal = ({ places, isOpen, setIsOpen,setPlaceModalOpen,location, setLocation}) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedProvince, setSelectedProvince] = useState("");
const [selectedDistrict, setSelectedDistrict] = useState("");
const [filteredPlaces, setFilteredPlaces] = useState([]);


  useEffect(() => {
    async function fetchImages() {
      const urls = {};
      // ลูปผ่านแต่ละ place
      for (const place of places) {
        const validUrls = [];
        // ถ้า place มี place_image_urls ให้ดึง URL ทุกตัวใน array
        if (place.place_image_urls && Array.isArray(place.place_image_urls)) {
          for (const url of place.place_image_urls) {
            const validUrl = await getImage(url); // ฟังก์ชันที่คุณใช้ตรวจสอบ URL
            console.log("validUrl",validUrl);
            if (validUrl) {
              validUrls.push(validUrl); // เก็บ URL ที่ถูกต้อง
            }
          }
        }
  
        // ถ้าไม่มีภาพที่ถูกต้อง ให้ใช้ default image
        if (validUrls.length > 0) {
          urls[place._id] = validUrls; // เก็บหลาย ๆ URL ถ้ามีหลายตัว
        } else {
          urls[place._id] = ["/default-event-image.jpg"]; // fallback image
        }
      }
      setImageUrls(urls); // อัปเดต state ของ imageUrls
    }
  
    if (places && places.length) {
      fetchImages(); // เรียกใช้ฟังก์ชัน
    }
  }, [places, selectedPlace]); // เรียกใหม่ทุกครั้งที่ places หรือ selectedPlace เปลี่ยนแปลง
  
  const savePlace = () => {
    // Validate required fields
    console.log("selectedPlace",selectedPlace);
    
    if (!selectedPlace) {
      toast.error("Please fill in all match details including weight class");
      return;
    }
    setLocation(selectedPlace);
    setPlaceModalOpen(false);
  };
  
  useEffect(() => {
    let filtered = places;

    if (selectedProvince) {
      filtered = filtered.filter((place) => place.address.province === selectedProvince);
    }

    if (selectedDistrict) {
      filtered = filtered.filter((place) => place.address.district === selectedProvince);
    }

    setFilteredPlaces(filtered);
  }, [selectedProvince, selectedDistrict, places]);
  
  if (!isOpen) return null;

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    setSelectedImageIndex(0); // Reset image index to 0 when new place is selected
  };

  const handlePrevImage = () => {
    if (selectedPlace && selectedPlace.place_image_urls.length > 0) {
      setSelectedImageIndex((prevIndex) => (prevIndex === 0 ? selectedPlace.place_image_urls.length - 1 : prevIndex - 1));
    }
  };

  const handleNextImage = () => {
    if (selectedPlace && selectedPlace.place_image_urls.length > 0) {
      setSelectedImageIndex((prevIndex) => (prevIndex === selectedPlace.place_image_urls.length - 1 ? 0 : prevIndex + 1));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-lg w-full mx-4 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Select a Place</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div>
          <div className="mb-4">
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Province</option>
                {[...new Set(places.map((p) => p.address.province))].map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={!selectedProvince}
              >
                <option value="">District</option>
                {[...new Set(places.filter(p => p.address.province === selectedProvince)
                  .map((p) => p.address.district))].map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

        </div>
  
        {/* List of places */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((place) => (
              <div
                key={place._id}
                className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer transition-all
                  ${selectedPlace?._id === place._id 
                    ? 'bg-primary/10 border border-primary/30' 
                    : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                onClick={() => handleSelectPlace(place)}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={imageUrls[place._id] ? imageUrls[place._id][0] : "/default-event-image.jpg"}
                    alt={place.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  {selectedPlace?._id === place._id && (
                    <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{place.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {place.address.province}, {place.address.district}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2 text-gray-500 dark:text-gray-400">No places available</p>
            </div>
          )}
        </div>
  
        {/* Show selected place's images */}
        {selectedPlace && selectedPlace.place_image_urls.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Images of {selectedPlace.name}</h3>
            <div className="relative flex items-center justify-center">
              <button 
                onClick={handlePrevImage} 
                className="absolute left-0 p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors z-10 -translate-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                <img
                  src={selectedPlace.place_image_urls[selectedImageIndex]}
                  alt={selectedPlace.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              </div>
              
              <button 
                onClick={handleNextImage} 
                className="absolute right-0 p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors z-10 translate-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
              {selectedImageIndex + 1} / {selectedPlace.place_image_urls.length}
            </div>
          </div>
        )}
  
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => setIsOpen(false)} 
            className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={savePlace}
            className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors shadow-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
  
};


const SearchableSelect = ({ label, boxers, selectedBoxer, setSelectedBoxer }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [imageUrls, setImageUrls] = useState({});

  // console.log(selectedBoxer);
  
  const filteredBoxers = (boxers || []).filter((boxer) => {
    const firstName = boxer.first_name || "";
    const lastName = boxer.last_name || "";
    const nickname = boxer.nickname || "";
    
    return (
      firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nickname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const fetchImage = async (url) => {
    try {
      const imageUrl = await getImage(url); // รับค่า imageUrl
      return imageUrl;
    } catch (error) {
      console.error("Error fetching image:", error);
      return "/default-event-image.jpg"; // ใช้ default ในกรณีเกิดข้อผิดพลาด
    }
  };
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
      <input
        type="text"
        placeholder="ค้นหา Boxer..."
        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-gray-900"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchTerm && filteredBoxers.length > 0 && (
        <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-md">
          {filteredBoxers.map((boxer) => (
            <div
              key={boxer._id}
              className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer transition duration-200"
              onClick={() => {
                setSelectedBoxer(boxer);
                setSearchTerm(""); // ล้างค่าค้นหาหลังจากเลือก
              }}
            >
              <img
                src={fetchImage(boxer.profile_picture_url)}
                alt={`${boxer.first_name} ${boxer.last_name}`}
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
            src={fetchImage(selectedBoxer.profile_picture_url) || "/default-event-image.jpg"}
            alt={`${selectedBoxer.first_name} ${selectedBoxer.last_name}`}
            className="w-14 h-14 rounded-full object-cover border-2 border-gray-300"
          />
          <p className="ml-3 text-lg font-semibold text-gray-800">
            {selectedBoxer.first_name} {selectedBoxer.last_name}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedBoxer(null);
              setSearchTerm("");
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

  const [boxers, setBoxers] = useState([]); // ✅ ใช้ useState เก็บข้อมูลนักมวย

  // เรียก API โหลดรายชื่อนักมวย
  useEffect(() => {
    const fetchBoxers = async () => {
      try {
        const response = await getBoxers();
        // console.log("boxers:", response);
        if (response.success) {
          setBoxers(response.data); // ✅ กำหนดค่า boxers ให้เป็นอาร์เรย์ที่ได้จาก API
        } else {
          console.error("Failed to fetch boxers");
        }
      } catch (error) {
        console.error("Error fetching boxers:", error);
      }
    };

    fetchBoxers();
  }, []); // ✅ ทำงานครั้งเดียวตอน component mount

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
    <h3 className="text-lg font-medium mb-4 text-white">Add Match for {new Date(currentDate).toLocaleDateString()}</h3>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300">
          Weight Class
        </label>
        <select
          name="weight_class_id"
          value={newMatch.weight_class_id || ""}
          onChange={handleMatchInputChange}
          className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg py-2 px-3"
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
        selectedBoxer={boxers.find(b => b._id === newMatch.boxer1_id) || null}
        setSelectedBoxer={(boxer) => {
          setNewMatch({ ...newMatch, boxer1_id: boxer?._id || null });
        }}
      />

      <SearchableSelect
        label="Boxer 2"
        boxers={boxers}
        selectedBoxer={boxers.find(b => b._id === newMatch.boxer2_id) || null}
        setSelectedBoxer={(boxer) => {
          setNewMatch({ ...newMatch, boxer2_id: boxer?._id || null });
        }}
      />

      <div>
        <label className="block text-sm font-medium text-gray-300">
          Match Time
        </label>
        <input
          type="time"
          name="match_time"
          value={newMatch.match_time}
          onChange={handleMatchInputChange}
          className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg py-2 px-3"
          required
        />
      </div>
    </div>
    <div className="flex justify-end mt-4">
      <button 
        onClick={() => setIsOpen(false)} 
        className="px-4 py-2 mr-2 border border-gray-600 rounded-lg text-gray-300"
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

const SeatZoneModal = ({
  isOpen,
  setIsOpen,
  seatZones,
  setSeatZones,
  editingSeat,
  setEditingSeat,
  isEditMode,
}) => {
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
      id: editingSeat ? editingSeat.id : Date.now(), // Use existing ID for editing, else generate new ID
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
      <div className="bg-white p-6 rounded-lg max-w-md w-full dark:bg-gray-800">
        <h3 className="text-lg font-medium mb-4 text-text">
          {isEditMode ? "Edit Seat Zone" : "Add Seat Zone"}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300">Zone Name</label>
            <input 
              type="text" 
              value={zone_name} 
              onChange={(e) => setZoneName(e.target.value)} 
              className="w-full border rounded-lg py-2 px-3 dark:bg-gray-700 dark:text-gray-100"
            />
            {errors.zone_name && <p className="text-red-500 text-sm">{errors.zone_name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-gray-300">Quantity</label>
            <input 
              type="number" 
              value={number_of_seat} 
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^[0-9\b]+$/.test(value)) {
                  setNumberOfSeat(value);
                }
              }} 
              className="w-full border rounded-lg py-2 px-3 dark:bg-gray-700 dark:text-gray-100"
              step="1"
              min="0"
            />
            {errors.number_of_seat && <p className="text-red-500 text-sm">{errors.number_of_seat}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300">Price</label>
            <input 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              className="w-full border rounded-lg py-2 px-3 dark:bg-gray-700 dark:text-gray-100"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 mr-2 border rounded-lg dark:text-gray-300">Cancel</button>
          <button onClick={handleSaveSeat} className="px-4 py-2 bg-primary text-white rounded-lg">
            {isEditMode ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};


const WeightClassModal = ({
  isOpen,
  setIsOpen,
  weightClasses,
  setWeightClasses,
  editingWeightClass,
  setEditingWeightClass
}) => {
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
        : [] // start with an empty array if creating new
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
      <div className="bg-white p-6 rounded-lg max-w-md w-full dark:bg-gray-800">
        <h3 className="text-lg font-medium mb-4 dark:text-gray-200">
          {editingWeightClass ? "Edit Weight Class" : "Add Weight Class"}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-gray-200">Type</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded-lg py-2 px-3 dark:bg-gray-700 dark:text-gray-200"
            />
            {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-gray-200">Weight Name</label>
            <input
              type="text"
              value={weigh_name}
              onChange={(e) => setWeighName(e.target.value)}
              className="w-full border rounded-lg py-2 px-3 dark:bg-gray-700 dark:text-gray-200"
            />
            {errors.weigh_name && <p className="text-red-500 text-sm">{errors.weigh_name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-gray-200">Min Weight (kg)</label>
            <input
              type="number"
              value={min_weight}
              onChange={(e) => setMinWeight(e.target.value)}
              className="w-full border rounded-lg py-2 px-3 dark:bg-gray-700 dark:text-gray-200"
            />
            {errors.min_weight && <p className="text-red-500 text-sm">{errors.min_weight}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-gray-200">Max Weight (kg)</label>
            <input
              type="number"
              value={max_weight}
              onChange={(e) => setMaxWeight(e.target.value)}
              className="w-full border rounded-lg py-2 px-3 dark:bg-gray-700 dark:text-gray-200"
            />
            {errors.max_weight && <p className="text-red-500 text-sm">{errors.max_weight}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-gray-200">Max Enrollment</label>
            <input
              type="number"
              value={max_enrollment}
              onChange={(e) => setMaxEnrollment(e.target.value)}
              className="w-full border rounded-lg py-2 px-3 dark:bg-gray-700 dark:text-gray-200"
            />
            {errors.max_enrollment && <p className="text-red-500 text-sm">{errors.max_enrollment}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-gray-200">Price (optional)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border rounded-lg py-2 px-3 dark:bg-gray-700 dark:text-gray-200"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 mr-2 border rounded-lg dark:bg-gray-600 dark:text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveWeightClass}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            {editingWeightClass ? "Update" : "Save"}
          </button>
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

const [places, setPlaces] = useState([]); // ✅ เก็บข้อมูลสถานที่

console.log("places",places);


useEffect(() => {
  const fetchPlaces = async () => {
    try {
      const response = await getPlaces(); // ✅ เรียก API
      console.log(response);
      
      setPlaces(response);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  fetchPlaces(); // ✅ เรียกใช้ฟังก์ชันเมื่อ component ถูกโหลดครั้งแรก
}, []); // ✅ ทำงานครั้งเดียวเมื่อ component ถูก mount

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [eventData, setEventData] = useState({
    organizer_id: user.user._id || "",
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
  const [isEditMode, setIsEditMode] = useState(false);  // เพิ่ม state นี้

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isPlaceModalOpen, setPlaceModalOpen] = useState(false);


  useEffect(() => {
    if(eventData?.event_type === "ticket_sales") {
      setWeightClasses(Array.isArray(defaultWeightClass) ? defaultWeightClass : []);
    } else {
      setWeightClasses([]);
    }
  }, [eventData, defaultWeightClass]);

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

  console.log("isOpen",isPlaceModalOpen);
  
  const [location,setLocation] = useState(null);
  const [locaionImg,setLocationImg] =useState(null);
  console.log("location",location);
  

  const handleAddLocation = () =>{
    setPlaceModalOpen(true);
    setSelectedPlace(null);
  }



  useEffect(() => {
    async function fetchImage() {
      if (location?.place_image_urls?.length > 0) { // ตรวจสอบก่อน
        const url = await getImage(location.place_image_urls[0]);
        console.log(url);
        
        setLocationImg(url);
      } else {
        setLocationImg("/default-event-image.jpg"); // ตั้งค่าภาพเริ่มต้นหากไม่มีข้อมูล
      }
    }
  
    fetchImage();
  }, [location?.place_image_urls]); // ใช้ optional chaining ป้องกัน error
  

const handleEditSeat = (seat) => {
  setEditingSeat(seat);  // ตั้งค่าข้อมูลที่จะแก้ไข
  setIsEditMode(true);   // ตั้งค่าเป็น Edit Mode
  setIsSeatModalOpen(true);  // เปิด Modal
};

const handleAddSeat = () => {
  setEditingSeat(null);  // ตั้งค่าเป็น null สำหรับการเพิ่มข้อมูลใหม่
  setIsEditMode(false);  // ตั้งค่าเป็น Add Mode
  setIsSeatModalOpen(true);  // เปิด Modal
};

const handleDeleteSeat = (seatId) => {
  // ลบข้อมูล seat ที่มี id ตรงกับ seatId
  const updatedSeatZones = seatZones.filter(seat => seat.id !== seatId);
  
  // อัปเดต seatZones ด้วยอาเรย์ใหม่ที่ไม่มี seat ที่ถูกลบ
  setSeatZones(updatedSeatZones);
};


const handleEditWeightClass = (weightClass) => {
  setEditingWeightClass(weightClass);  // ตั้งค่าข้อมูลที่จะแก้ไข
  setIsEditMode(true);   // ตั้งค่าเป็น Edit Mode
  setIsWeightClassModalOpen(true);  // เปิด Modal
};

const handleAddWeightClass = () => {
  setEditingWeightClass(null);  // ตั้งค่าเป็น null สำหรับการเพิ่มข้อมูลใหม่
  setIsEditMode(false);  // ตั้งค่าเป็น Add Mode
  setIsWeightClassModalOpen(true);  // เปิด Modal
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
    // console.log(eventData);
      const formData = new FormData();

      // console.log(eventData);
      // ใส่ค่าที่ไม่ใช่ไฟล์โดยแปลงเป็น JSON String
      formData.append("organizer_id", eventData.organizer_id);
      formData.append("location_id",location._id);
      formData.append("event_name", eventData.event_name);
      formData.append("level", eventData.level.toLowerCase());
      formData.append("start_date", eventData.start_date);
      formData.append("end_date", eventData.end_date);
      formData.append("description", eventData.description);
      formData.append("event_type", eventData.event_type);
      
      if(eventData.event_type === "ticket_sales"){
        formData.append("status", "ongoing");
      }
      else{
        formData.append("status",eventData.event_type);
      }
      

      const weightClassesData = weightClasses.map(wc => {
        // แปลง id ของ weightClass เป็น string เพื่อเปรียบเทียบกับ weight_class_id
        const classMatches = matches.filter(match => 
          String(match.weight_class_id) === String(wc.id)
        );
      
        return {
          ...wc,
          matches: classMatches.map(match => {
            // แปลง match_time ที่เป็น string (เช่น "21:04") ให้เป็น Date
            const timeString = match.match_time; // สมมุติว่า match_time เป็น "HH:mm"
            const currentDate = new Date(); // ใช้วันที่ปัจจุบัน
            const [hours, minutes] = timeString.split(':');
            currentDate.setHours(hours, minutes, 0, 0); // ตั้งเวลาเป็น match_time
      
            return {
              match_date: match.match_date, // ไม่เปลี่ยนแปลง match_date
              match_time: currentDate, // เปลี่ยน match_time เป็น Date
              boxer1_id: match.boxer1_id,
              boxer2_id: match.boxer2_id
            };
          })
        };
      });
      
      
      formData.append("weight_classes", JSON.stringify(weightClassesData));
      // แปลง Array/Object ให้เป็น JSON แล้วส่งไป
      formData.append("seat_zones", JSON.stringify(seatZones));
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
      {/* Event Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Event Name</label>
        <input
          type="text"
          name="event_name"
          value={eventData.event_name}
          onChange={handleInputChange}
          className="w-full border border-gray-300 dark:text-black rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition duration-200"
          placeholder="Enter event name"
          required
        />
      </div>
  
    {/* Location & Level */}
    <div className="space-y-6">
  {/* Location - With enhanced UI */}
  <div>
    <div className="flex">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
      <button 
          onClick={handleAddLocation} 
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-full transition-colors"
        >
          {location ? <span className="text-lg">✎</span> : <span className="text-lg">+</span>} 
        </button>
    </div>
    
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

      
      {location && (
        <div className="flex items-start gap-4 w-full">
          <div className="relative flex-shrink-0">
            <img 
              src={locaionImg} 
              alt={location.name} 
              className="w-28 h-28 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
            />
            <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 pointer-events-none" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {location.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {location.address.province}, {location.address.district}
            </p>
            {location.address.details && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {location.address.details}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Level - Styled with better spacing */}
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Level</label>
    <div className="relative">
      <select
        name="level"
        value={eventData.level}
        onChange={handleInputChange}
        className="w-full border border-gray-300 dark:border-gray-600 dark:text-white dark:bg-gray-700 rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition duration-200 appearance-none"
        required
      >
        <option value="">-- Select Level --</option>
        <option value="beginner">Beginner</option>
        <option value="fighter">Fighter</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
</div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={eventData.description}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg dark:text-black py-3 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition duration-200"
          rows="4"
          placeholder="Enter event description"
        />
      </div>
  
      {/* Poster Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Poster</label>
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
                className="w-full h-80 object-cover rounded-lg border border-gray-300"
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
              className="flex flex-col items-center justify-center w-full max-w-2xl h-80 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary/50 transition-colors"
            >
              <PhotoIcon className="h-8 w-8 text-gray-500" />
              <p className="mt-2 text-sm text-gray-600">Click to upload a photo</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );  

  const renderDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input type="date" name="start_date" value={eventData.start_date} onChange={handleInputChange} className="w-full border rounded-lg py-2 px-3 dark:text-gray-900" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input type="date" name="end_date" value={eventData.end_date} onChange={handleInputChange}disabled={!eventData.start_date} min={eventData.start_date} className="w-full border rounded-lg py-2 px-3  dark:text-gray-900" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Event Type</label>
          <select name="event_type" value={eventData.event_type} onChange={handleInputChange} className="w-full border rounded-lg py-2 px-3  dark:text-gray-900">
            <option value="" className=" dark:text-gray-900">-- Select Event Type --</option>
            <option value="registration" className=" dark:text-gray-900">Open for Registration</option>
            <option value="ticket_sales" className=" dark:text-gray-900">Ticket Sale</option>
          </select>
        </div>
      </div>

      {eventData.event_type === "registration" ? (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-lg font-medium">Weight Classes</h3>
            <button onClick={() => handleAddWeightClass()} className="p-1 rounded-full bg-rose-500 text-white">
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
          <table className="w-full border-collapse border rounded-lg text-sm">
            <thead>
              <tr className="bg-gray-200  dark:text-gray-900">
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
                  <tr key={wc.id} className="text-center ">
                    <td className="p-2 border">{wc.type}</td>
                    <td className="p-2 border">{wc.weigh_name}</td>
                    <td className="p-2 border">{wc.min_weight}</td>
                    <td className="p-2 border">{wc.max_weight}</td>
                    <td className="p-2 border">{wc.max_enrollment}</td>
                    <td className="p-2 border">{wc.price ? new Intl.NumberFormat().format(wc.price) : "Free"}</td>
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
            <button onClick={() => handleAddSeat()} className="p-1 rounded-full bg-rose-500 text-white">
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
          <table className="w-full border-collapse border rounded-lg text-sm">
            <thead>
              <tr className="bg-gray-200  dark:text-gray-900">
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
                  <td className="p-2 border">{seat.price ? new Intl.NumberFormat().format(seat.price) : "Free"}</td>
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

  const [boxers, setBoxers] = useState([]); // ✅ ใช้ useState เก็บข้อมูลนักมวย

  // เรียก API โหลดรายชื่อนักมวย
  useEffect(() => {
    const fetchBoxers = async () => {
      try {
        const response = await getBoxers();
        // console.log("boxers:", response);
        if (response.success) {
          setBoxers(response.data); // ✅ กำหนดค่า boxers ให้เป็นอาร์เรย์ที่ได้จาก API
        } else {
          console.error("Failed to fetch boxers");
        }
      } catch (error) {
        console.error("Error fetching boxers:", error);
      }
    };

    fetchBoxers();
  }, []); // ✅ ทำงานครั้งเดียวตอน component mount
  
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
                      const boxer1 = boxers.find(boxer => boxer._id === match.boxer1_id);
                      const boxer2 = boxers.find(boxer => boxer._id === match.boxer2_id);
                      return (
                        <div key={matchIndex} className="flex items-center justify-between p-3 bg-white rounded-lg border dark:bg-gray-800">
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
          places.find(loc => loc.location_id === eventData.location_id)?.name || 
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
            const boxer1 = boxers.find(b => b._id === m.boxer1_id);
            const boxer2 = boxers.find(b => b._id === m.boxer2_id);
            
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
      <WeightClassModal
        isOpen={isWeightClassModalOpen}
        setIsOpen={setIsWeightClassModalOpen}
        weightClasses={weightClasses}
        setWeightClasses={setWeightClasses}
        editingWeightClass={editingWeightClass}
        setEditingWeightClass={setEditingWeightClass}
        isEditMode={isEditMode}  // ส่ง isEditMode ไป
      />

      <SeatZoneModal
        isOpen={isSeatModalOpen}
        setIsOpen={setIsSeatModalOpen}
        seatZones={seatZones}
        setSeatZones={setSeatZones}
        editingSeat={editingSeat}
        setEditingSeat={setEditingSeat}
        isEditMode={isEditMode}  // ส่ง isEditMode ไป
      />
       <PlaceModal places={places} 
        isOpen={isPlaceModalOpen}
        setIsOpen={setPlaceModalOpen}
        setPlaceModalOpen={setPlaceModalOpen}
        location={location}
        setLocation={setLocation}

       />
    </div>
  );
};

export default AddEventForm;