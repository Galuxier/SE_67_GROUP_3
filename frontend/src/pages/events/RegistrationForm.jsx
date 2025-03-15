import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
function RegistrationForm() {
  const { eventId } = useParams(); // ✅ รับ eventId จาก URL
  const location = useLocation();
  const { event } = location.state || {}; // ✅ รับ event จาก navigate()

  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("kg"); // กิโลกรัมเริ่มต้น
  const [selectedWeightClass, setSelectedWeightClass] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();
  // แปลงน้ำหนักจากปอนด์เป็นกิโลกรัม (1 ปอนด์ ≈ 0.453592 kg)
  const convertWeightToKg = (weightValue, unit) => {
    return unit === "lb" ? weightValue * 0.453592 : weightValue;
  };

  // ตรวจสอบน้ำหนักว่าตรงกับหมวดไหน
  const handleCheckWeight = () => {
    const weightInKg = convertWeightToKg(parseFloat(weight), unit);
    const foundClass = event.weight_classes.find(
      (w) => weightInKg >= w.min_weight && weightInKg <= w.max_weight
    );
    setSelectedWeightClass(
      foundClass ? foundClass.weigh_name : "NOT IN RANGE"
    );
  };

  // ส่งฟอร์มสมัคร
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `สมัครสำเร็จ! \nชื่อ: ${fullName}\nน้ำหนัก: ${weight} ${unit}\nรุ่นที่สมัคร: ${selectedWeightClass}\nเบอร์โทร: ${phone}`
    );
  };
  const handleBack = () => navigate(-1);
  return (
    <div className="min-h-screen flex flex-col">
      {/* รูปภาพ */}
      <button
        onClick={handleBack}
        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 self-start"
      >
        ← Back
      </button>
      <div className="h-auto flex justify-center items-center">
        <img
          src={event.image_url}
          alt="Event"
          className="w-full max-w-3xl h-full object-cover rounded-lg"
        />
      </div>

      {/* ฟอร์ม */}
      <div className="flex-grow flex justify-center items-center">
        <div className="max-w-lg w-full p-2 shadow-lg rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* น้ำหนัก */}
            <div className="flex gap-2">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Weight"
                className="w-3/4 p-3 border rounded-lg dark:bg-gray-600"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-1/4 p-3 border rounded-lg dark:text-gray-400 dark:bg-gray-600 text-gray-400"
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>

            {/* เช็คน้ำหนัก */}
            <button
              type="button"
              onClick={handleCheckWeight}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white p-3 rounded-lg"
            >
              Check
            </button>

            {/* 🔹 รุ่นที่สมัคร */}
            <input
              type="text"
              value={selectedWeightClass}
              readOnly
              placeholder="Weight Class"
              className="w-full p-3 border rounded-lg dark:bg-gray-600 "
            />

            {/* 🔹 ชื่อ */}
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Name"
              className="w-full p-3 border rounded-lg dark:bg-gray-600"
              required
            />

            {/* 🔹 เบอร์โทรศัพท์ */}
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              className="w-full p-3 border rounded-lg dark:bg-gray-600"
              required
            />

            {/* 🔹 ปุ่มสมัคร */}
            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white p-3 rounded-lg text-lg font-semibold"
            >
              Regist
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
