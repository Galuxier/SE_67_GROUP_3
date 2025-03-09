import { useLocation, useNavigate,Link } from "react-router-dom";
import { useState } from "react";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const course = location.state?.course || {};
  const quantity = location.state?.quantity || 1;
  const [paymentMethod, setPaymentMethod] = useState("พร้อมเพย์");

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
  };
  const ClickBack = () => {
    navigate(-2);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl flex flex-col md:flex-row gap-6">
        {/* Left Side - Form */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">กรอกข้อมูลผู้ซื้อ</h2>
          <label className="block text-gray-700">Email</label>
          <input type="email" className="w-full p-2 border rounded mb-4" />

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700">ชื่อ</label>
              <input type="text" className="w-full p-2 border rounded" />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700">นามสกุล</label>
              <input type="text" className="w-full p-2 border rounded" />
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-6">วิธีการชำระเงิน</h3>
          <div className="border p-4 rounded-lg mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={paymentMethod === "พร้อมเพย์"}
                onChange={() => handlePaymentChange("พร้อมเพย์")}
              />
              พร้อมเพย์
            </label>
            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <input
                type="radio"
                checked={paymentMethod === "บัตรเครดิต/เดบิต"}
                onChange={() => handlePaymentChange("บัตรเครดิต/เดบิต")}
              />
              บัตรเครดิต/เดบิต
            </label>
          </div>
            <Link to = "/course/courseBuyCheckout" state={{ course, quantity,paymentMethod}}> 
          <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg rounded-xl mt-6">
            ดำเนินการต่อ
          </button>
            </Link>
          <button
            onClick={ClickBack}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 text-lg rounded-xl mt-4"
            >
            ย้อนกลับ
            </button>
        </div>

        {/* Right Side - Order Summary */}
        <div className="w-full md:w-1/3 border-l pl-6">
          <h2 className="text-xl font-semibold">รายการสินค้า</h2>
          <p className="text-gray-700 mt-2">{course.course_name}</p>
          <p className="text-gray-600">{course.gym}</p>
          <p className="text-gray-800 mt-2">x{quantity}</p>
          <p className="text-gray-900 font-semibold">
            {course.price.toLocaleString()} บาท
          </p>

          <hr className="my-4" />
          <p className="text-lg font-semibold">รวมยอดสั่งซื้อ</p>
          <p className="text-gray-900 text-xl font-bold">
            {(course.price * quantity).toLocaleString()} บาท
          </p>
        </div>
      </div>
    </div>
  );
}
