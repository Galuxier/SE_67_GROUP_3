import { useState } from "react";
import { BsShop } from "react-icons/bs";
import ProductCard from "../../components/ProductCard";
import EditShopModal from "../../components/shops/EditShopModal";

export default function ShopProfile() {
    const [shop, setShop] = useState({
        shop_name: "Muay Thai Shop",
        logo_url: new URL("../../assets/images/Shop_logo.jpg", import.meta.url).href,
        description: "We offer the best Muay Thai gear in Phuket.",
        contacts: {
          email: "muaythaishop@gmail.com",
          tel: "089-xxx-xxxx",
          line: "muaythailine",
          facebook: "muaythaiFB",
        },
        address: {
          province: "Phuket",
          district: "Mueang",
          subdistrict: "Talad Yai",
          street: "Fight St.",
          postal_code: "83000",
          latitude: "7.884",
          longitude: "98.391",
        },
      });

  const [showEditModal, setShowEditModal] = useState(false);
  const handleOpenModal = () => setShowEditModal(true);
  const handleCloseModal = () => setShowEditModal(false);

  const handleSaveShop = (newShopData) => {
    setShop((prev) => ({ ...prev, ...newShopData }));
    setShowEditModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded p-6 relative">
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
          </div>
          <div className="ml-auto bg-gray-100 px-5 py-3 rounded-lg shadow-md max-w-sm">
            <p className="text-gray-700 font-semibold mb-2">Contact</p>
            <div className="text-gray-600 text-sm space-y-1">
              {shop.contacts.email && <p>Email: {shop.contacts.email}</p>}
              {shop.contacts.tel && <p>Tel: {shop.contacts.tel}</p>}
              {shop.contacts.line && <p>Line: {shop.contacts.line}</p>}
              {shop.contacts.facebook && <p>FB: {shop.contacts.facebook}</p>}
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-300 pt-4">
          <h4 className="text-xl font-semibold mb-4">Products</h4>
          <ProductCard />
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
