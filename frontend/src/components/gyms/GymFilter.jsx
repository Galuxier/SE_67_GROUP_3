function GymFilter({
  province,
  district,
  facility,
  handleProvinceSelect,
  handleDistrictSelect,
  handleFacilitySelect,
  provinceData,
}) {
  const districts =
    province !== "All"
      ? provinceData.find((p) => p.provinceNameTh === province)?.districts || []
      : [];

  // const facilityOptions = ["Air Conditioning", "Shower", "Locker", "Parking", "Free Trial"]; // Example facilities

  return (
    <div className="space-y-4">
      {/* Province Filter */}
      <div>
        <label className="block mb-2 text-sm font-medium text-text">Province</label>
        <select
          className="border p-2 w-full bg-background text-text border-border rounded-md"
          value={province}
          onChange={(e) => handleProvinceSelect(e.target.value)}
        >
          <option value="All">All</option>
          {provinceData
            .sort((a, b) => a.provinceNameTh.localeCompare(b.provinceNameTh))
            .map((prov, index) => (
              <option key={index} value={prov.provinceNameTh}>
                {prov.provinceNameTh}
              </option>
            ))}
        </select>
      </div>

      {/* District Filter */}
      {/* {province !== "All" && (
        <div>
          <label className="block mb-2 text-sm font-medium text-text">District</label>
          <select
            className="border p-2 w-full bg-background text-text border-border rounded-md"
            value={district}
            onChange={(e) => handleDistrictSelect(e.target.value)}
          >
            <option value="All">All</option>
            {districts
              .sort((a, b) => a.districtNameTh.localeCompare(b.districtNameTh))
              .map((dist, index) => (
                <option key={index} value={dist.districtNameTh}>
                  {dist.districtNameTh}
                </option>
              ))}
          </select>
        </div>
      )} */}

      {/* Facility Filter */}
      {/* <div>
        <label className="block mb-2 text-sm font-medium text-text">Facility</label>
        <select
          className="border p-2 w-full bg-background text-text border-border rounded-md"
          value={facility}
          onChange={(e) => handleFacilitySelect(e.target.value)}
        >
          <option value="">Any</option>
          {facilityOptions.map((fac, index) => (
            <option key={index} value={fac}>
              {fac}
            </option>
          ))}GymIn
        </select>
      </div> */}
    </div>
  );
}

export default GymFilter;