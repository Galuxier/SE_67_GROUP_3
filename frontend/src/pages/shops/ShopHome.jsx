import { useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../../data/ProductsData";
import ProductCard from "../../components/ProductCard";

export default function ShopHome() {
  const [sortOrder, setSortOrder] = useState(""); // State สำหรับเรียงลำดับ
  const [categoryFilter, setCategoryFilter] = useState(""); // State สำหรับกรองประเภท
  const [priceFilter, setPriceFilter] = useState(""); // State สำหรับกรองราคา

  // กรองสินค้าโดยใช้ category
  const filteredProducts = products
    .filter((p) => {
      if (!categoryFilter || categoryFilter === "-- Select --") return true;
      return p.category === categoryFilter;
    })
    .sort((a, b) => {
      if (sortOrder === "low-to-high") return a.price - b.price;
      if (sortOrder === "high-to-low") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-1/6 bg-white dark:bg-gray-800 p-4 shadow-md">
        {/* Add Shop Button */}
        <Link to="/shop/addShop">
          <button className="bg-rose-600 text-white px-4 py-2 rounded w-full mb-4">
            + Add shop
          </button>
        </Link>
        {/* Add Product Button */}
        <Link to="/shop/addProduct">
          <button className="bg-rose-600 text-white px-4 py-2 rounded w-full mb-8">
            + Add product
          </button>
        </Link>
        {/* Cart Button */}
        <Link to="/shop/cart">
          <button className="bg-rose-600 text-white px-4 py-2 rounded w-full mb-8">
            Cart
          </button>
        </Link>

        {/* Filter */}
        <h2 className="font-bold text-lg mb-4 text-gray-700 dark:text-white">Filter</h2>
        {/* Category Filter */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-600 dark:text-gray-300">Category</label>
          <select
            className="border p-2 w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option>-- Select --</option>
            <option>Glove</option>
            <option>Sandbag</option>
          </select>
        </div>

        {/* Price Filter */}
        <div>
          <label className="block mb-1 text-gray-600 dark:text-gray-300">Price</label>
          <select
            className="border p-2 w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
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
      </div>

      {/* Product Display */}
      <div className="flex-1 p-4">
        {/* Sort Buttons */}
        <div className="flex justify-end items-center gap-2 mb-4">
          <span className="text-gray-600 dark:text-gray-300">Sort by:</span>
          <button
            className={`p-2 rounded ${
              sortOrder === "low-to-high" ? "bg-gray-400" : "bg-gray-300"
            } dark:bg-gray-600`}
            onClick={() => setSortOrder("low-to-high")}
          >
            ↑
          </button>
          <button
            className={`p-2 rounded ${
              sortOrder === "high-to-low" ? "bg-gray-400" : "bg-gray-300"
            } dark:bg-gray-600`}
            onClick={() => setSortOrder("high-to-low")}
          >
            ↓
          </button>
        </div>

        {/* ส่ง products ที่กรองและเรียงแล้วไปให้ ProductCard */}
        <ProductCard products={filteredProducts} />
      </div>
    </div>
  );
}
