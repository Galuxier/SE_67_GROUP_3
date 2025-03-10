import { useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../../data/ProductsData";
import ProductCard from "../../components/ProductCard";

export default function ShopHome() {
  const [sortOrder, setSortOrder] = useState("");

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/6 bg-white p-4 shadow-md">
        <Link to="/shop/addShop">
          <button className="bg-rose-600 text-white px-4 py-2 rounded w-full mb-4">
            + Add shop
          </button>
        </Link>
        <Link to="/shop/addProduct">
          <button className="bg-rose-600 text-white px-4 py-2 rounded w-full mb-8">
            + Add product
          </button>
        </Link>
        <Link to="/shop/cart">
          <button className="bg-rose-600 text-white px-4 py-2 rounded w-full mb-8">
            Cart
          </button>
        </Link>

        <Link to="/shop/shopProfile/1">
          <button className="bg-rose-600 text-white px-4 py-2 rounded w-full mb-4">
            Shop Profile (Owner 1)
          </button>
        </Link>
        <Link to="/shop/shopProfile/2">
          <button className="bg-rose-600 text-white px-4 py-2 rounded w-full mb-8">
            Shop Profile (Owner 2)
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

      {/* ส่วนแสดงสินค้า */}
      <div className="flex-1 p-4">
        <div className="flex justify-end items-center gap-2 mb-4">
          <span>Sort by:</span>
          <button className="bg-gray-300 p-2 rounded">↑</button>
          <button className="bg-gray-300 p-2 rounded">↓</button>
        </div>

        {/* ส่ง products ไปให้ ProductCard */}
        <ProductCard products={products} />
      </div>
    </div>
  );
}
