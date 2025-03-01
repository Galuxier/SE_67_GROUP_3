import { useState } from "react";
import { Link } from "react-router-dom";

export default function ShopHome() {
  const [sortOrder, setSortOrder] = useState("");

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="w-1/6 bg-white p-4 shadow-md">
        <Link to="/shop/addShop">
          <button className="bg-red-500 text-white px-4 py-2 rounded w-full mb-4">
            + Add shop
          </button>
        </Link>
        <Link to="/shop/addProduct">
          <button className="bg-red-500 text-white px-4 py-2 rounded w-full mb-8">
            + Add product
          </button>
        </Link>

        <h2 className="font-bold text-lg mb-4">Filter</h2>
        <div className="mb-4">
          <label className="block mb-1">Category</label>
          <select className="border p-2 w-full">
            <option>-- Select --</option>
            <option>Glove</option>
            <option>Sandbag</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Price</label>
          <select className="border p-2 w-full">
            <option>-- Select --</option>
            <option>Low - High</option>
            <option>High - Low</option>
          </select>
        </div>
      </div>

      <div className="flex-1 p-4">
        
        <div className="flex justify-end items-center gap-2 mb-4">
          <span>Sort by:</span>
          <button className="bg-gray-300 p-2 rounded">↑</button>
          <button className="bg-gray-300 p-2 rounded">↓</button>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full min-h-[calc(100vh-6rem)]">
          
          <div className="bg-gray-300 flex items-center justify-center">
            {/* <p className="text-gray-600">แถว 1</p> */}
          </div>
          <div className="bg-gray-300 flex items-center justify-center">
            {/* <p className="text-gray-600">แถว 2</p> */}
          </div>
          <div className="bg-gray-300 flex items-center justify-center">
            {/* <p className="text-gray-600">แถว 3</p> */}
          </div>
        </div>
      </div>
    </div>
  );
}