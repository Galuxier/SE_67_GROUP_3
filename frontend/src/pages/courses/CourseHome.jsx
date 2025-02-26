import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const FilterMenu = ({ onFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({ location: '', priceRange: '', courseType: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    onFilter(filters);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 mb-6">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 border border-gray-300 rounded-md py-2 px-4 bg-white text-sm font-medium">
        <Filter size={16} />
        <span>Filter information</span>
      </button>
      {isOpen && (
        <div className="absolute top-12 left-4 right-4 bg-white shadow-lg rounded-md p-4 z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select name="location" value={filters.location} onChange={handleChange} className="w-full border rounded-md py-2 px-3 text-sm">
              <option value="">ทั้งหมด</option>
              <option value="phuket">ภูเก็ต</option>
              <option value="bangkok">กรุงเทพ</option>
              <option value="chiang-mai">เชียงใหม่</option>
            </select>
            <select name="priceRange" value={filters.priceRange} onChange={handleChange} className="w-full border rounded-md py-2 px-3 text-sm">
              <option value="">ทั้งหมด</option>
              <option value="0-1000">น้อยกว่า 1,000 บาท</option>
              <option value="1000-2000">1,000 - 2,000 บาท</option>
              <option value="2000+">มากกว่า 2,000 บาท</option>
            </select>
            <select name="courseType" value={filters.courseType} onChange={handleChange} className="w-full border rounded-md py-2 px-3 text-sm">
              <option value="">ทั้งหมด</option>
              <option value="muay-thai">มวยไทย</option>
              <option value="boxing">มวยสากล</option>
              <option value="mma">MMA</option>
            </select>
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <button onClick={() => setIsOpen(false)} className="border rounded-md py-2 px-4 text-sm">cancle</button>
            <button onClick={applyFilters} className="bg-blue-600 text-white rounded-md py-2 px-4 text-sm">ใช้ตัวกรอง</button>
          </div>
        </div>
      )}
    </div>
  );
};

FilterMenu.propTypes = {
  onFilter: PropTypes.func.isRequired,
};
const CourseCard = ({ image, title, subtitle, price }) => {
  return (
    <div className="bg-white rounded shadow overflow-hidden w-full flex flex-col">
      <img src={image} alt={title} className="h-48 w-full object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-sm text-gray-600 mt-1 flex-grow">{subtitle}</p>
        <p className="text-base font-semibold mt-2">{price}</p>
      </div>
    </div>
  );
};
CourseCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
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
  {title === "recommended courses" ? (
    <Link to="/course/courseTotal">
      <button className="border rounded py-2 px-6 text-sm">Total Course</button>
    </Link>
  ) : title === "recommended camp" ? (
    <Link to="/course/createCourse">
      <button className="border rounded py-2 px-6 text-sm">see more</button>
    </Link>
  ) : null}
</div>;

    </div>
  );
};CourseSection.propTypes = {
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
    <div className="bg-gray-100 min-h-screen">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="flex justify-end">
          <Link to="/course/courseFrom">
            <button className="px-6 py-4 rounded-full bg-rose-600 text-white">+</button>
          </Link>
        </div>
      </div>
      <CourseSection title="recommended courses" courses={filteredCourses || recommendedCourses} showFilter={true} onFilter={handleFilter} />
      <CourseSection title="recommended camp" courses={recommendedCourses} />
    </div>
  );
};

export default CourseHome;
