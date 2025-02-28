import { useState } from 'react';
import { Link } from 'react-router-dom';


import FilterMenu from '../../components/Course/FilterMenu';
import CourseCard from '../../components/Course/CourseCard';
import PropTypes from 'prop-types';

const CourseSection = ({ title, courses, showFilter = false, onFilter }) => {
  return (
    <div className="py-6">
      <h2 className="text-center text-xl font-medium mb-6">{title}</h2>
      {showFilter && <FilterMenu onFilter={onFilter} />}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {courses.map((course, index) => (
          <CourseCard key={index} {...course} />
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
        {title === "recommended courses" ? (
          <Link to="/course/MuayThaiCourses">
            <button className="border rounded py-2 px-6 text-sm">Total Course</button>
          </Link>
        ) : title === "recommended camp" ? (
          <Link to="/course/MuayThaiCourses">
            <button className="border rounded py-2 px-6 text-sm">see more</button>
          </Link>
        ) : null}
      </div>
    </div>
  );
};

CourseSection.propTypes = {
  title: PropTypes.string.isRequired,
  courses: PropTypes.arrayOf(PropTypes.object).isRequired,
  showFilter: PropTypes.bool,
  onFilter: PropTypes.func,
};

const CourseHome = () => {
  const [filteredCourses, setFilteredCourses] = useState(null);
  
  
  
  const recommendedCourses = [
    { image: "/api/placeholder/240/180", title: "คอร์สมวยไทยเบื้องต้น", subtitle: "Phuket fight club", price: "2,000 / Week" }
  ];
  
  const handleFilter = (filters) => {
    console.log("Applied filters:", filters);
    setFilteredCourses(recommendedCourses);
  };
  
  return (
    <div className="bg-white-100 min-h-screen">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="flex justify-end">
          <Link to="/course/createCourse"> 
          <button 
            className="px-5 py-3 rounded-full bg-rose-600 text-white"
          >
            +
          </button>
          </Link>
        </div>
      </div>

    
      
      <Link to="/course/CourseDetail">
        <CourseSection 
          title="recommended courses" 
          courses={filteredCourses || recommendedCourses} 
          showFilter={true} 
          onFilter={handleFilter} 
        />
        </Link>
      
        <Link to="/course/CourseDetail">
      <CourseSection 
        title="recommended camp" 
        courses={recommendedCourses} 
      />
      </Link>
    
    </div>
  );
};

export default CourseHome;