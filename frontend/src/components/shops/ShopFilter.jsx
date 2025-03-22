const ShopFilter = ({
    categoryFilter,
    setCategoryFilter,
    priceFilter,
    setPriceFilter,
    sortOrder,
    setSortOrder,
  }) => {
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
            <option>-- Select --</option>
            <option>Glove</option>
            <option>Sandbag</option>
          </select>
        </div>
  
        {/* Price Filter */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-text">Price</label>
          <select
            className="border p-2 w-full bg-background text-text border-border rounded-md"
            value={priceFilter}
            onChange={(e) => {
              const value = e.target.value;
              setPriceFilter(value);
              if (value === "Low - High") setSortOrder("low-to-high");
              if (value === "High - Low") setSortOrder("high-to-low");
              if (value === "-- Select --") setSortOrder("");
            }}
          >
            <option>-- Select --</option>
            <option>Low - High</option>
            <option>High - Low</option>
          </select>
        </div>
  
        {/* Sort By */}
        {/* <div>
          <label className="block mb-2 text-sm font-medium text-text">Sort By</label>
          <div className="flex gap-2">
            <button
              className={`p-2 rounded ${
                sortOrder === "low-to-high" ? "bg-gray-400" : "bg-gray-300"
              } dark:bg-gray-600`}
              onClick={() => setSortOrder("low-to-high")}
            >
              ↑ Low to High
            </button>
            <button
              className={`p-2 ro    unded ${
                sortOrder === "high-to-low" ? "bg-gray-400" : "bg-gray-300"
              } dark:bg-gray-600`}
              onClick={() => setSortOrder("high-to-low")}
            >
              ↓ High to Low
            </button>
          </div>
        </div> */}
      </div>
    );
  };
  
  export default ShopFilter;