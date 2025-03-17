import { useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../../data/ProductsData";
import ProductCard from "../../components/ProductCard";
import ShopFilter from "../../components/shops/ShopFilter";
import { PlusCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../context/ThemeContext";

export default function ShopHome() {
  const [sortOrder, setSortOrder] = useState(""); // State สำหรับเรียงลำดับ
  const [categoryFilter, setCategoryFilter] = useState(""); // State สำหรับกรองประเภท
  const [priceFilter, setPriceFilter] = useState(""); // State สำหรับกรองราคา
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // State สำหรับเปิด/ปิด filter modal
  const { isDarkMode } = useTheme();

  // กรองสินค้าโดยใช้ category และเรียงลำดับราคา
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

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="container px-5 sm:px-0 pb-5 pt-5 mx-auto">
        {/* Header */}
        <div className="flex justify-center relative mb-6">
          <h1 className="text-3xl font-bold text-text">All Products</h1>
          <div className="flex gap-2 absolute right-0">
            <Link to="/shop/addShop">
              <button className="bg-secondary hover:bg-primary rounded-full w-8 h-8 flex items-center justify-center">
                <PlusCircleIcon className="h-6 w-6 text-white" />
              </button>
            </Link>
            <Link to="/shop/addProduct">
              <button className="bg-secondary hover:bg-primary rounded-full w-8 h-8 flex items-center justify-center">
                <PlusCircleIcon className="h-6 w-6 text-white" />
              </button>
            </Link>
          </div>
        </div>

        {/* Sidebar and Product Display */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Filter Button สำหรับ Mobile */}
          <div className="md:hidden flex justify-center mb-4">
            <button
              onClick={toggleFilterModal}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Cog6ToothIcon className="h-5 w-5" />
              <span>Filter</span>
            </button>
          </div>

          {/* Sidebar */}
          <div className="hidden md:block w-full md:w-48 bg-background rounded-lg shadow-lg flex-shrink-0">
            <ShopFilter
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              priceFilter={priceFilter}
              setPriceFilter={setPriceFilter}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </div>

          {/* Product Display */}
          <div className="flex-grow">
            {/* ส่ง products ที่กรองและเรียงแล้วไปให้ ProductCard */}
            <ProductCard products={filteredProducts} />
          </div>
        </div>
      </div>

      {/* Modal สำหรับ Filter บน Mobile */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-11/12 max-w-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-text">Filter</h2>
              <button
                onClick={toggleFilterModal}
                className="text-text hover:text-primary"
              >
                &times;
              </button>
            </div>
            <ShopFilter
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              priceFilter={priceFilter}
              setPriceFilter={setPriceFilter}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </div>
        </div>
      )}
    </div>
  );
}