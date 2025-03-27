/* eslint-disable react/prop-types */
const CourseFilter = ({ province, handleProvinceSelect, provinceData, district, handleDistrictSelect }) => {
  // Assuming we might want to filter by district as well since the API supports it
  return (
    <div className="p-4 border border-border rounded-lg">
      <label className="block mb-2 text-sm font-medium text-text">
        Province
      </label>
      <select
        className="border p-2 w-full bg-background text-text border-border rounded-md mb-4"
        value={province}
        onChange={(e) => handleProvinceSelect(e.target.value)}
      >
        <option value="">All Provinces</option>
        {provinceData
          .sort((a, b) => a.provinceNameTh.localeCompare(b.provinceNameTh))
          .map((province, index) => (
            <option key={index} value={province.provinceNameTh}>
              {province.provinceNameTh}
            </option>
          ))}
      </select>

      {/* Optional: Adding district filter since API supports it */}
      <label className="block mb-2 text-sm font-medium text-text">
        District
      </label>
      <input
        type="text"
        className="border p-2 w-full bg-background text-text border-border rounded-md"
        value={district || ''}
        onChange={(e) => handleDistrictSelect(e.target.value)}
        placeholder="Enter district"
      />
    </div>
  );
};

export default CourseFilter;