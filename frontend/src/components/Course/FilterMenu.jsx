import { useState } from 'react';
import { Filter } from 'lucide-react';
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
            <button onClick={() => setIsOpen(false)} className="border rounded-md py-2 px-4 text-sm">cancel</button>
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

export default FilterMenu;