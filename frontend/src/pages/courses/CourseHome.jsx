import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import CourseList from "../../components/CourseCard";




export default function MuayThaiCourses() {
  return (
    <div className="bg-white-500 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-center relative mb-6">
          <h1 className="text-2xl font-bold text-gray-800">คอร์สเรียนมวยไทย</h1>
          <Link to="/course/createCourse">
            <button className="bg-rose-600 hover:bg-rose-600 rounded-full w-8 h-8 flex items-center justify-center absolute right-0">
              <span className="text-xl text-white py-2 px-4">+</span>
            </button>
          </Link>
        </div>

        {/* Sidebar and CourseList */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow-lg flex-shrink-0">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-medium text-gray-700">Filter</h2>
            </div>
            <div className="p-2">
              {["ประเภท", "Model", "ระดับ"].map((filter) => (
                <div key={filter} className="py-2 px-2 border-b border-gray-100">
                  <button className="flex justify-between items-center w-full text-left">
                    <span className="text-gray-700">{filter}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          
          <div className="flex-grow">
            <Link to ="/course/courseDetail">
            <CourseList />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
