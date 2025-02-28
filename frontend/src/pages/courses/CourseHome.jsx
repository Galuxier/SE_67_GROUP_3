import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "คอร์สฝึกมวยไทยสำหรับเด็ก",
    gym: "Phuket Fight Club",
    level: "For Kid",
    price: "2,000",
    image: "https://source.unsplash.com/400x300/?muaythai,kid",
  },
  {
    id: 2,
    title: "คอร์สฝึกมวยไทย",
    gym: "Phuket Fight Club",
    level: "Beginner",
    price: "2,000",
    image: "https://source.unsplash.com/400x300/?muaythai,training",
  },
  {
    id: 3,
    title: "คอร์สฝึกมวยไทยขั้นสูง",
    gym: "Phuket Fight Club",
    level: "Advance",
    price: "2,000",
    image: "https://source.unsplash.com/400x300/?muaythai,advanced",
  },
];

const getLevelColor = (level) => {
  switch (level) {
    case "For Kid":
      return "text-blue-500";
    case "Beginner":
      return "text-green-500";
    case "Advance":
      return "text-red-500";
    default:
      return "text-gray-700";
  }
};

export default function MuayThaiCourses() {
  return (
    <div className="bg-white-500 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header with centered title */}
        <div className="flex justify-center relative mb-6">
          <h1 className="text-2xl font-bold text-gray-800">คอร์สเรียนมวยไทย</h1>
          <Link to ="/course/createCourse">
          <button className="bg-rose-600 hover:bg-rose-600 rounded-full w-8 h-8 flex items-center justify-center absolute right-0">
            <span className="text-xl text-white py-2 px-4">+</span>
          </button>
          </Link>
        </div>
        
        {/* Main content area with sidebar and courses */}
        <div className="flex flex-col md:flex-row gap-6  ">
          {/* Sidebar - Fixed position */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow-lg rounded-lg flex-shrink-0">
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
          
          {/* Course grid */}
          <div className="flex-grow   ">
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6  ">
              {courses.map((course) => (
                
                <div key={course.id} className="bg-white-500 rounded-lg shadow-lg p-1 p-1rounded-lg  overflow-hidden">
                  <Link to ="/course/courseDetail">
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 mb-1">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{course.gym}</p>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${getLevelColor(course.level)}`}>
                        {course.level}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {course.price} / คอร์ส
                      </span>
                    </div>
                 
                  </div>
                </Link>
                </div> 
                
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}