import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BsShop } from "react-icons/bs";
import EditShopModal from "../../components/shops/EditShopModal";
import ProductCard from "../../components/ProductCard";
import { shops } from "../../data/ShopsData";
import { products } from "../../data/ProductsData";

export default function ShopProfile() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  // หา shop ตาม owner_id
  const foundShop = shops.find((shop) => shop.owner_id === id);
  const initialShopData = foundShop || {
    owner_id: id,
    shop_name: "",
    logo_url: "",
    description: "",
    contacts: {},
    address: {},
  };

  const [shop, setShop] = useState(initialShopData);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleOpenModal = () => setShowEditModal(true);
  const handleCloseModal = () => setShowEditModal(false);
  const handleSaveShop = (newShopData) => {
    setShop((prev) => ({ ...prev, ...newShopData }));
    setShowEditModal(false);
  };

  if (!shop.shop_name) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
        <h1 className="text-2xl font-semibold">Shop not found</h1>
      </div>
    );
  }

  // filter products ของร้านนี้
  const shopProducts = products.filter((p) => p.shop_owner_id === shop.owner_id);

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-rose-400 text-white px-4 py-2 rounded hover:bg-rose-500 transition"
        >
          Back
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-white shadow-md rounded p-6 relative">
        {/* ปุ่มแก้ไข */}
        <button
          onClick={handleOpenModal}
          className="absolute top-4 right-4 bg-rose-600 text-white px-4 py-2 rounded"
        >
          Edit
        </button>

        {/* ข้อมูลร้าน */}
        <div className="flex items-center space-x-6">
          {shop.logo_url ? (
            <img
              alt="Shop Logo"
              src={shop.logo_url}
              className="shadow-xl rounded-full h-32 w-32 border-4 border-white object-cover"
            />
          ) : (
            <BsShop className="h-32 w-32 text-gray-400" />
          )}
          <div className="flex-1">
            <h3 className="text-3xl font-semibold text-gray-800">
              {shop.shop_name || "No Shop Name"}
            </h3>
            <p className="text-gray-600 mt-1">{shop.description}</p>
            <p className="text-gray-500 text-sm mt-1">
              Owner ID: {shop.owner_id}
            </p>
          </div>
          <div className="ml-auto bg-gray-100 px-5 py-3 rounded-lg shadow-md max-w-sm">
            <p className="text-gray-700 font-semibold mb-2">Contact</p>
            <div className="text-gray-600 text-sm space-y-1">
              {shop.contacts.email && <p>Email: {shop.contacts.email}</p>}
              {shop.contacts.tel && <p>Tel: {shop.contacts.tel}</p>}
              {shop.contacts.line && <p>Line: {shop.contacts.line}</p>}
              {shop.contacts.facebook && <p>FB: {shop.contacts.facebook}</p>}
              {shop.contacts.information && (
                <p>Information: {shop.contacts.information}</p>
              )}
            </div>
          </div>
        </div>

        {/* แสดงสินค้าในร้าน */}
        <div className="mt-6 border-t border-gray-300 pt-4">
          <h4 className="text-xl font-semibold mb-4">Products</h4>
          {shopProducts.length > 0 ? (
            <ProductCard products={shopProducts} />
          ) : (
            <p className="text-gray-500">No products found in this shop.</p>
          )}
        </div>
      </div>

      <EditShopModal
        show={showEditModal}
        onClose={handleCloseModal}
        shopData={shop}
        onSave={handleSaveShop}
      />
    </div>
  );
}
