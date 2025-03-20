/* eslint-disable react/prop-types */
const CourseFilter = ({ province, handleProvinceSelect, provinceData }) => {
  return (
    <div className="p-4 border border-border rounded-lg">
      <label className="block mb-2 text-sm font-medium text-text">
        Province
      </label>
      <select
        className="border p-2 w-full bg-background text-text border-border rounded-md"
        value={province}
        onChange={(e) => handleProvinceSelect(e.target.value)}
      >
        <option value="All">All</option>
        {provinceData
          .sort((a, b) => a.provinceNameTh.localeCompare(b.provinceNameTh))
          .map((province, index) => (
            <option key={index} value={province.provinceNameTh}>
              {province.provinceNameTh}
            </option>
          ))}
      </select>
    </div>
  );
};

export default CourseFilter;
