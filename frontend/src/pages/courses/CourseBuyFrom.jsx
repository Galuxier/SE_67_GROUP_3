import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function CourseBuyFrom() {
    const navigate = useNavigate();
    const location = useLocation();
    const course = location.state?.course || {};

    const [quantity, setQuantity] = useState(1);

    const back = () => navigate(-1);

    return (
        <div className="flex items-center justify-center min-h-screen bg-white-100">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-semibold">{course.course_name || "คอร์สฝึกมวยไทยเริ่มต้น"}</h2>
                <p className="text-gray-600">{course.gym || "Phuket Fight Club"}</p>

                <div className="mt-4">
                    <p className="font-semibold">ระยะเวลา</p>
                    <p className="text-gray-700">{course.duration || "1 กุมภาพันธ์ - 6 กุมภาพันธ์ 2568"}</p>
                </div>

                <div className="mt-4">
                    <p className="font-semibold">ราคา</p>
                    <p className="text-gray-700">{course.price.toLocaleString()} บาท / คอร์ส / คน</p>
                </div>

                <div className="mt-4 flex items-center gap-4">
                    <p className="font-semibold">จำนวน</p>
                    <div className="flex items-center gap-2 border rounded-lg p-2">
                        <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                            <Minus className="w-5 h-5 text-gray-700" />
                        </button>
                        <span className="w-8 text-center text-lg">{quantity}</span>
                        <button onClick={() => setQuantity((q) => q + 1)}>
                            <Plus className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    <Link
                        to="/payment/course"
                        state={{ course, quantity, total_price: course.price * quantity }}
                    >
                        <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg rounded-xl">
                            ซื้อคอร์ส
                        </button>
                    </Link>
                    <button
                        onClick={back}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 text-lg rounded-xl mt-4"
                    >
                        ยกเลิก
                    </button>
                </div>
            </div>
        </div>
    );
}