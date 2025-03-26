import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CourseList({ courses }) {
  const navigate = useNavigate();
  const [imageURLs, setImageURLs] = useState({}); // เก็บ URL ของภาพที่โหลด
  console.log(courses);
  // ฟังก์ชันสำหรับการเลือกสีของระดับคอร์ส
  const getLevelColor = (level) => {
    switch (level) {
      case "ForKids":
        return "text-green-500 dark:text-green-400";
      case "Beginner":
        return "text-orange-400 dark:text-orange-300";
      case "Advance":
        return "text-red-500 dark:text-red-400";
      default:
        return "text-text";
    }
  };

  // ฟังก์ชันที่จะถูกเรียกเมื่อคลิกที่คอร์ส
  const handleCourseClick = (course) => {
    navigate(`/course/courseDetail`, { state: { course } }); // ส่งข้อมูลคอร์สไปยัง CourseDetail
  };

  // ฟังก์ชันที่ใช้ในการโหลดภาพ
  const fetchImage = async (imageUrl, courseId) => {
    try {
      const response = await fetch(`/api/images/${imageUrl}`);
      const blob = await response.blob();
      const imageObjectURL = URL.createObjectURL(blob);
      setImageURLs((prevURLs) => ({ ...prevURLs, [courseId]: imageObjectURL }));
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  // ใช้ useEffect เพื่อโหลดภาพเมื่อคอร์สถูก render
  useEffect(() => {
    courses.forEach((course) => {
      if (course.course_image_url && course.course_image_url.length > 0) {
        fetchImage(course.course_image_url[0], course._id);
      }
    });
  }, [courses]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <button
          key={course._id}
          className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-card text-text cursor-pointer transition transform hover:scale-105 border border-border"
          onClick={() => handleCourseClick(course)} // เมื่อคลิกคอร์สจะไปที่หน้า CourseDetail
        >
          {/* แสดงภาพที่โหลดจาก Blob URL */}
          {imageURLs[course._id] ? (
            <img
              className="w-full aspect-[4/3] object-cover"
              src={imageURLs[course._id]} // ใช้ URL ของภาพที่ได้จาก Blob
              alt={course.course_name}
            />
          ) : (
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
              <span>Loading image...</span>
            </div>
          )}
          <div className="px-6 py-4">
            {/* Course Name */}
            <div className="font-semibold text-xl mb-2 text-text">
              {course.course_name}
            </div>

            {/* Level */}
            <div className={`font-medium mb-2 ${getLevelColor(course.level)}`}>
              {course.level}
            </div>

            {/* Price */}
            <div className="flex items-center font-normal text-sm text-text">
              <span>{course.price.toLocaleString()}</span>
              <span className="text-text text-sm ml-1 font-normal">฿/Person</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default CourseList;
