
import { ChevronDown } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "คอร์สฝึกมวยไทยระดับต้น",
    gym: "Phuket Fight Club",
    level: "For Kid",
    price: "2,000",
    image: "https://source.unsplash.com/400x300/?muaythai,gym"
  },
  {
    id: 2,
    title: "คอร์สฝึกมวยไทย",
    gym: "Krabi Fight Club",
    level: "Beginner",
    price: "2,000",
    image: "https://source.unsplash.com/400x300/?muaythai,training"
  },
  {
    id: 3,
    title: "คอร์สฝึกมวยไทยระดับสูง",
    gym: "Korntor Fight Club",
    level: "Advance",
    price: "2,000",
    image: "https://source.unsplash.com/400x300/?muaythai,advanced"
  }
];

export default function MuayThaiCourses() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-center text-3xl font-bold mb-6">คอร์สเรียนมวยไทย</h1>
      <div className="flex gap-6">
        {/* Sidebar Filter */}
        <div className="w-1/4 bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Filter</h2>
          {['จังหวัด', 'ประเภท', 'ระยะเวลา'].map((filter) => (
            <div key={filter} className="mb-4">
              <button className="w-full flex justify-between items-center p-3 border rounded-lg text-left">
                {filter} <ChevronDown size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Course Cards */}
        <div className="flex-1 grid grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <p className="text-gray-600">{course.gym}</p>
                <p className="text-sm text-gray-500">{course.level}</p>
                <p className="text-red-500 font-bold mt-2">{course.price} / คอร์ส</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
