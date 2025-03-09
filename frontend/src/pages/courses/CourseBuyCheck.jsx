import { useLocation } from "react-router-dom";


export default function CourseCheck() {
  const location = useLocation();
  const { course, quantity } = location.state || {};
//   const [paymentMethod, setPaymentMethod] = location.paymentMethod || "พร้อมเพย์";
 
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl flex flex-col md:flex-row gap-6">
        {/* Left Side - QR Code */}
        <div className="flex-1 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">ชำระเงิน</h2>
          <div className="flex justify-center items-center my-4">
            <img
              src="/api/placeholder/250/250" 
              alt="QR Code"
              className="w-64 h-64"
            />
          </div>
          <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg rounded-xl mt-6">
            ชำระเงินเสร็จสิ้น
          </button>
        </div>
        
        {/* Right Side - Order Summary */}
        <div className="w-full md:w-1/3 border-l pl-6">
          <h2 className="text-xl font-semibold">รายการสินค้า</h2>
          <div className="mt-4">
            <div className="flex justify-between">
              <span>{course?.course_name}</span>
              <span>x{quantity}</span>
            </div>
            <div className="flex justify-between">
              <span>{course?.gym}</span>
              <span>{course?.price?.toLocaleString()} บาท</span>
            </div>
          </div>
          
          <hr className="my-4" />
          <p className="text-lg font-semibold">รวมยอดสั่งซื้อ</p>
          <p className="text-gray-900 text-xl font-bold">
            {course?.price && quantity ? (course.price * quantity).toLocaleString() : 0} บาท
          </p>
        </div>
      </div>
    </div>
  );
}