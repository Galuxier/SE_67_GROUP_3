import { Link } from "react-router-dom";
import { PlusCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
// import { getAllCourses } from "../../services/api/CourseApi"; 
import CourseCard from "../../components/CourseCard"; // ใช้ Card สำหรับ Course
import provinceData from "../../data/thailand/address/provinces.json";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import CourseFilter from "../../components/courses/CourseFilter";

function CourseHome() {
  const [province, setProvince] = useState("All");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [visibleCourses, setVisibleCourses] = useState(30);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  // useEffect(() => {
  //   const fetchCourses = async () => {
  //     try {
  //       const response = await getAllCourses();
  //       setCourses(response);
  //       setFilteredCourses(response);
  //     } catch (error) {
  //       console.error("Failed to fetch courses:", error);
  //     }
  //   };

  //   fetchCourses();
  // }, []);

  useEffect(() => {
    filterCoursesByProvince(province);
  }, [province]);

  const filterCoursesByProvince = (provinceName) => {
    if (provinceName === "All") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(
        (course) => course.location.province === provinceName
      );
      setFilteredCourses(filtered);
    }
  };

  const handleProvinceSelect = (provinceNameTh) => {
    setProvince(provinceNameTh);
  };

  const loadMoreCourses = () => {
    setVisibleCourses((prevVisibleCourses) => prevVisibleCourses + 30);
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="container px-20 sm:px-0 pb-5 pt-5 mx-auto">
        {/* Header */}
        <div className="flex justify-center relative mb-6">
          <h1 className="text-3xl font-bold text-text">All Courses</h1>
          {user?.role?.includes("trainer") && (
            <Link to="/course/addcourse">
              <button className="bg-secondary hover:bg-primary rounded-full w-8 h-8 flex items-center justify-center absolute right-0">
                <PlusCircleIcon className="h-10 w-10 text-white" />
              </button>
            </Link>
          )}
        </div>

        {/* Sidebar and CourseList */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Filter Button สำหรับ Mobile */}
          <div className="md:hidden flex justify-center mb-4">
            <button
              onClick={toggleFilterModal}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Cog6ToothIcon className="h-5 w-5" />
              <span>Filter</span>
            </button>
          </div>

          {/* Sidebar */}
          <div className="hidden md:block w-full md:w-48 bg-background rounded-lg shadow-lg flex-shrink-0">
            <CourseFilter
              province={province}
              handleProvinceSelect={handleProvinceSelect}
              provinceData={provinceData}
            />
          </div>

          {/* CourseList */}
          <div className="flex-grow">
            <CourseCard courses={filteredCourses.slice(0, visibleCourses)} />
            {filteredCourses.length > visibleCourses && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={loadMoreCourses}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal สำหรับ Filter บน Mobile */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-11/12 max-w-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-text">Filter</h2>
              <button
                onClick={toggleFilterModal}
                className="text-text hover:text-primary"
              >
                &times;
              </button>
            </div>
              {/* <CourseFilter
                province={province}
                handleProvinceSelect={handleProvinceSelect}
                provinceData={provinceData}
              /> */}
              <CourseCard />
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseHome;
