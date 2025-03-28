import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getImage } from "../../services/api/ImageApi";
import { useAuth } from "../../context/AuthContext";

function RegistrationForm() {
  const { eventId } = useParams(); 
  const location = useLocation();
  const { event } = location.state || {}; 
  const user = useAuth().user;
  console.log(user);
  
  console.log(event);

  const [gender, setGender] = useState(""); // State for gender
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("kg"); 
  const [selectedWeightClass, setSelectedWeightClass] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    async function fetchImage() {
      const url = await getImage(event.poster_url);
      setImageUrl(url); // Update state
    }
    fetchImage();
  }, [event.poster_url]);

  const convertWeightToKg = (weightValue, unit) => {
    return unit === "lb" ? weightValue * 0.453592 : weightValue;
  };

  const handleCheckWeight = () => {
    if (!gender) {
      alert("Please select gender before checking the weight class.");
      return;
    }

    const weightInKg = convertWeightToKg(parseFloat(weight), unit);
    const genderSpecificClasses = event.weight_classes.filter(w => w.gender === gender); // Filter by gender
    const foundClass = genderSpecificClasses.find(
      (w) => weightInKg >= w.min_weight && weightInKg <= w.max_weight
    );

    setSelectedWeightClass(
      foundClass ? foundClass.weigh_name : "NOT IN RANGE"
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const applicants = {
      applicant_id: user._id,
      first_name: first_name,
      last_name: last_name,
      weight: weight,
      applicate_at: Date.now(),
    }

    console.log(applicants);
    
    const formData = new FormData();

    formData.append("applicant_id", user._id);
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("weight", weight);
    formData.append("applicate_at", Date.now());

    console.log(formData);
    
    navigate('/event');
    alert(
      `สมัครสำเร็จ! \nชื่อ: ${first_name}\nน้ำหนัก: ${weight} ${unit}\nรุ่นที่สมัคร: ${selectedWeightClass}\nเบอร์โทร: ${phone}`
    );
  };
  
  const handleBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 mb-8 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
  
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Event Image Section */}
          <div className="lg:w-3/5 flex flex-col">
            <div className="relative overflow-hidden rounded-xl shadow-2xl">
              <img
                src={imageUrl}
                alt="Event"
                className="w-full h-96 object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h1 className="text-3xl font-bold text-white">{event.event_name}</h1>
                <p className="text-gray-200 mt-2">
                  {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
  
          {/* Registration Form */}
          <div className="lg:w-2/5">
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-600">
              <div className="bg-rose-500 dark:bg-rose-600 p-4">
                <h2 className="text-xl font-bold text-white text-center">Registration</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Gender Selection */}
                <div>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Weight and Unit */}
                <div className="flex gap-4">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Weight"
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="kg">kg</option>
                    <option value="lb">lb</option>
                  </select>
                </div>
  
                <button
                  type="button"
                  onClick={handleCheckWeight}
                  className="w-full bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Check Weight Class
                </button>
  
                <div>
                  <input
                    type="text"
                    value={selectedWeightClass}
                    readOnly
                    placeholder="Weight Class"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white bg-gray-50 dark:bg-gray-600 cursor-not-allowed"
                  />
                </div>
  
                {/* Other Inputs */}
                <div>
                  <input
                    type="text"
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    required
                  />
                </div>
  
                <button
                  type="submit"
                  className="w-full bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 text-white py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  Register Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
