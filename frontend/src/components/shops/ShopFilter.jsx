const ShopFilter = ({
  categoryFilter,
  setCategoryFilter,
  priceFilter,
  setPriceFilter,
  sortOrder,
  setSortOrder,
}) => {
  // รายการ categories ที่กำหนดไว้
  const predefinedCategories = [
    'training_gloves',
    'bag_gloves',
    'competition_gloves',
    'hand_wraps',
    'shorts',
    'shin_guards',
    'ankle_supports',
    'mouth_guard',
    'groin_protector',
    'elbow_pads',
    'headgear',
    'heavy_bag',
    'kick_pads',
    'speed_bag',
    'jump_rope',
    'pra_jiad_mongkol',
    'focus_mitts',
    'belly_pad',
    'freestanding_bag',
    'knee_guards',
    'abdominal_protector',
    'medicine_ball',
    'bell',
    'stopwatch',
    'dumbbell',
    'barbell',
    'other',
  ];

  // ฟังก์ชันแปลง snake_case เป็น Title Case
  const toTitleCase = (str) => {
    if (!str || str === "All") return str;
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="p-4 border border-border rounded-lg">
      <h2 className="text-lg font-semibold mb-4 text-text">Filter</h2>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-text">
          Category
        </label>
        <select
          className="border p-2 w-full bg-background text-text border-border rounded-md"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All</option>
          {predefinedCategories.map((category) => (
            <option key={category} value={category}>
              {toTitleCase(category)}
            </option>
          ))}
        </select>
      </div>

      {/* Price Filter */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-text">Price Range</label>
        <select
          className="border p-2 w-full bg-background text-text border-border rounded-md"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
        >
          <option value="">All Prices</option>
          <option value="0-100">0 - 100</option>
          <option value="100-500">100 - 500</option>
          <option value="500-1000">500 - 1000</option>
          <option value="1000-5000">1000 - 5000</option>
          <option value="5000-10000">5000 - 10000</option>
        </select>
      </div>

      {/* Sort Order */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-text">Sort By</label>
        <select
          className="border p-2 w-full bg-background text-text border-border rounded-md"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Default</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default ShopFilter;