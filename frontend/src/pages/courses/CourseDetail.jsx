import { useLocation, Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import Trainer from "../../components/Trainer";
import { Dialog } from "@headlessui/react";

export default function CourseDetail() {
  const location = useLocation();
  const course = location.state?.course || {};
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const applicants = course.applicants || ["สมชาย", "สมหญิง", "สมปอง", "สมศรี"];

  const handleToEditCourse = () => {
      navigate("/course/editCourse", { state: { course } });
  }
  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{course.course_name}</h1>
          <p className="text-lg text-gray-600 mt-1">{course.gym}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-rose-600 text-white text-lg px-6 py-3 rounded-xl "
          >
            ดูรายชื่อผู้สมัคร
          </button>
          <button 
          onClick={handleToEditCourse}
          className="bg-rose-600 text-white text-lg px-8 py-3 rounded-xl hover:bg-rose-600" >
           edit

          </button>
          <Link to="/course/courseBuyFrom" state={{ course }}>
            <button className="bg-rose-600 text-white text-lg px-8 py-3 rounded-xl hover:bg-rose-600">
              ซื้อคอร์ส
            </button>
          </Link>
        </div>
      </div>

      <div>
        <img
          src={course.image_url}
          alt={course.course_name}
          className="w-full h-100 object-cover mt-4 rounded-lg"
        />
      </div>

      <h2 className="mt-12 text-2xl font-semibold">รายละเอียดคอร์ส</h2>
      <div className="mt-5 h-auto text-base text-gray-600 bg-gray-100 p-4 rounded-lg">
        <span>
          ราคา: {course.price} บาท <br />
          ระดับ: {course.level} <br />
          เราจะมาบอกว่าเราทำอะไรบ้างใน course นี้
          <br />
          1. สอนมวยไทย 2. สอนมวยไทย 3. สอนมวยไทย 4. สอนมวยไทย
        </span>
      </div>

      <div className="mt-8">
        <Trainer />
      </div>
      <div className="mt-8">สถานที่ตั้ง {course.gym}</div>

      {/* Modal แสดงรายชื่อผู้สมัคร */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-auto h-auto min-w-[300px] min-h-[200px] relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          >
            ✖
          </button>
          <Dialog.Title className="text-xl font-semibold">รายชื่อผู้สมัคร</Dialog.Title>
          <ul className="mt-4 list-disc pl-6 text-gray-700">
            {applicants.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      </Dialog>
    </div>
  );
}
