import provinceData from "../../data/thailand/address/provinces.json";

const EventFilter = ({ province, handleProvinceSelect }) => {
  return (
    <div className="p-4 border border-border rounded-lg">
      <label className="block mb-2 text-sm font-medium text-text">Province</label>
      <select
        className="border p-2 w-full bg-background text-text border-border rounded-md"
        value={province}
        onChange={(e) => handleProvinceSelect(e.target.value)}
      >
        <option value="All">All</option>
        {provinceData
          .sort((a, b) => a.name_th.localeCompare(b.name_th)) // เรียงลำดับจังหวัดตามชื่อภาษาไทย
          .map((province) => (
            <option key={province.id} value={province.name_th}>
              {province.name_th}
            </option>
          ))}
      </select>
    </div>
  );
};

export default EventFilter;