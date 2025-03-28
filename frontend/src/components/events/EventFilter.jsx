// EventFilter.jsx
function EventFilter({ province, handleProvinceSelect, provinceData = [] }) {
  const cleanedProvinceData = Array.isArray(provinceData) 
    ? provinceData.filter(item => item !== undefined) 
    : [];

  return (
    <div className="p-4 border border-border rounded-lg">
      <label className="block mb-2 text-sm font-medium text-text">Province</label>
      <select
        className="border p-2 w-full bg-background text-text border-border rounded-md"
        value={province}
        onChange={(e) => handleProvinceSelect(e.target.value)}
      >
        <option value="All">All</option>
        {cleanedProvinceData.length > 0 
          ? cleanedProvinceData.map((province, index) => {
              const provinceName = province.provinceNameTh || province.province_name_th || province.name;
              if (!provinceName) return null;
              
              return (
                <option key={index} value={provinceName}>
                  {provinceName}
                </option>
              );
            }).filter(Boolean)
          : <option value="" disabled>No provinces available</option>
        }
      </select>
    </div>
  );
}

export default EventFilter;