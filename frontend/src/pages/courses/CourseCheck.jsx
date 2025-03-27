import { useLocation } from "react-router-dom";
import PaymentForm from "../../components/payment/paymentForm";

export default function Checkout() {
    const location = useLocation();
    const course = location.state?.course || {};
    const quantity = location.state?.quantity || 1;
    const total_price = location.state?.total_price || course.price * quantity;

    // เตรียมข้อมูลสำหรับ PaymentForm
    const orderData = {
        course_id: course.id,
        price: course.price,
        quantity,
        total_price
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-6xl flex flex-col md:flex-row gap-8">
                {/* Left Side - Payment Form */}
                <div className="w-full md:w-2/3 md:pr-8">
                    <PaymentForm type="course" DatafromOrder={orderData} />
                </div>

                {/* Right Side - Order Summary */}
                <div className="w-full md:w-1/3 md:border-l md:pl-8 mt-8 md:mt-0">
                    <h2 className="text-2xl font-semibold mb-4">รายการสินค้า</h2>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h3 className="font-medium text-lg mb-1">{course.course_name || "คอร์สฝึกมวยไทยเริ่มต้น"}</h3>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-600">{course.gym || "Phuket Fight Club"}</p>
                            <p className="text-gray-800 font-medium">x{quantity}</p>
                        </div>
                        <p className="text-gray-900 font-semibold mt-2">
                            {typeof course.price === "number" ? course.price.toLocaleString() : "1,200"} บาท
                        </p>
                    </div>

                    <hr className="my-6 border-gray-200" />
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-gray-600">ราคาสินค้า</p>
                        <p className="text-gray-800">
                            {typeof course.price === "number" ? course.price.toLocaleString() : "1,200"} บาท
                        </p>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-600">จำนวน</p>
                        <p className="text-gray-800">x{quantity}</p>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <p className="text-xl font-semibold">รวมยอดสั่งซื้อ</p>
                        <p className="text-red-500 text-xl font-bold">
                            {typeof total_price === "number" ? total_price.toLocaleString() : "2,400"} บาท
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}