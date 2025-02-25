import { useState } from 'react';
import { Filter } from 'lucide-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const FilterMenu = ({ onFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    courseType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    onFilter(filters);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 mb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 border border-gray-300 rounded-md py-2 px-4 bg-white text-sm font-medium"
      >
        <Filter size={16} />
        <span>กรองข้อมูล</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-12 left-4 right-4 bg-white shadow-lg rounded-md p-4 z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">สถานที่</label>
              <select 
                name="location" 
                value={filters.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
              >
                <option value="">ทั้งหมด</option>
                <option value="phuket">ภูเก็ต</option>
                <option value="bangkok">กรุงเทพ</option>
                <option value="chiang-mai">เชียงใหม่</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">ช่วงราคา</label>
              <select 
                name="priceRange" 
                value={filters.priceRange}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
              >
                <option value="">ทั้งหมด</option>
                <option value="0-1000">น้อยกว่า 1,000 บาท</option>
                <option value="1000-2000">1,000 - 2,000 บาท</option>
                <option value="2000+">มากกว่า 2,000 บาท</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">ประเภทคอร์ส</label>
              <select 
                name="courseType" 
                value={filters.courseType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
              >
                <option value="">ทั้งหมด</option>
                <option value="muay-thai">มวยไทย</option>
                <option value="boxing">มวยสากล</option>
                <option value="mma">MMA</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4 gap-2">
            <button 
              onClick={() => setIsOpen(false)}
              className="border border-gray-300 rounded-md py-2 px-4 text-sm"
            >
              ยกเลิก
            </button>
            <button 
              onClick={applyFilters}
              className="bg-blue-600 text-white rounded-md py-2 px-4 text-sm"
            >
              ใช้ตัวกรอง
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

FilterMenu.propTypes = {
  onFilter: PropTypes.func.isRequired
};

const CourseCard = ({ image, title, subtitle, price }) => {
  return (
    <div className="bg-white rounded shadow overflow-hidden max-w-xs">
      <div className="h-48 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-xs text-gray-600 mt-1">{subtitle}</p>
        <p className="text-sm mt-2">{price}</p>
      </div>
    </div>
  );
};

CourseCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired
};

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
        <button className="border border-gray-300 rounded py-2 px-6 text-sm">
          {title === "คอร์สแนะนำ" ? "คอร์สทั้งหมด" : "ดูเพิ่มเติม"}
        </button>
      </div>
    </div>
  );
};

CourseSection.propTypes = {
  title: PropTypes.string.isRequired,
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      location: PropTypes.string,
      type: PropTypes.string
    })
  ).isRequired,
  showFilter: PropTypes.bool,
  onFilter: PropTypes.func
};

CourseSection.defaultProps = {
  showFilter: false,
  onFilter: () => {}
};

const CourseHome = () => {
  const [filteredCourses, setFilteredCourses] = useState(null);
  
  // Sample course data
  const recommendedCourses = [
    {
      image: "/api/placeholder/240/180",
      title: "คอร์สมวยไทยเบื้องต้น",
      subtitle: "Phuket fight club",
      price: "2,000 / Week",
      location: "phuket",
      type: "muay-thai"
    },
    {
      image: "/api/placeholder/240/180",
      title: "คอร์สมวยไทยเบื้องต้น",
      subtitle: "Phuket fight club",
      price: "2,000 / Week",
      location: "phuket",
      type: "muay-thai"
    },
    {
      image: "/api/placeholder/240/180", 
      title: "คอร์สมวยไทยเบื้องต้น",
      subtitle: "Phuket fight club",
      price: "2,000 / Week",
      location: "phuket",
      type: "muay-thai"
    }
  ];

  const handleFilter = (filters) => {
    console.log("Applied filters:", filters);
    // In a real app, you would filter the courses based on the selected filters
    // For demo purposes, we're just logging the filters
    setFilteredCourses(recommendedCourses);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      
      <div class="w-full max-w-6xl mx-auto px-4">
        <div class="flex justify-end">
          <Link to = "/course/courseFrom">
          <button className="px-6 py-4 rounded-full bg-rose-600 text-white">
           +
          </button>
          </Link>
        </div>
    </div>
      <CourseSection 
        title="คอร์สแนะนำ" 
        courses={filteredCourses || recommendedCourses}
        showFilter={true}
        onFilter={handleFilter}
      />
       
      <CourseSection title="ค่ายแนะนำ" courses={recommendedCourses} />
      
    </div>
  );
};

export default CourseHome;