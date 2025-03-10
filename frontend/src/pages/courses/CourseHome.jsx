
import { Link } from "react-router-dom";
import { useState } from "react";
import CourseList from "../../components/CourseCard";

export default function MuayThaiCourses() {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [time, setTime] = useState("");

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white rounded-lg shadow-md p-4">
        <Link to="/course/createCourse" className="block mb-6 text-center bg-rose-600 text-white py-2 rounded-lg ">
          + Create Course
        </Link>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Filter</h3>
          
          <div className="mb-4">
            <label className="block mb-1">Location</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="nakhompathom">Nakhompathom</option>
              <option value="bangkok">Bangkok</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Type</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="forkid">For Kid</option>
              <option value="beginner">Beginner</option>
              <option value="advance">Advance</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1">Time</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-3/4">
        <CourseList />
      </div>
      
    </div>
  );
}