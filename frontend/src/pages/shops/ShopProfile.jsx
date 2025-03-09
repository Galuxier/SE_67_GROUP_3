import { useState } from "react";
import { useParams } from "react-router-dom";
import { BsShop } from "react-icons/bs";
import ProductCard from "../../components/ProductCard";
import EditShopModal from "../../components/shops/EditShopModal";

export default function ShopProfile() {
  const { id } = useParams(); 
  const shops = [
    {
      owner_id: "1",
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
        information: "Open at 9 to 5",
      },
    },
    {
      owner_id: "2",
      shop_name: "Thai Boxing Gear",
      logo_url: new URL("../../assets/images/Shop_logo2.jpg", import.meta.url).href,
      description: "Your one-stop shop for Thai Boxing equipment.",
      contacts: {
        email: "boxinggear@gmail.com",
        tel: "090-xxx-xxxx",
        line: "boxingline",
        facebook: "boxingFB",
      },
      address: {
        province: "Bangkok",
        district: "Siam",
        subdistrict: "Siam Square",
        street: "Boxing St.",
        postal_code: "10110",
        latitude: "13.7563",
        longitude: "100.5018",
        information: "Open 24 hours",
      },
    },
  ];

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
            <p className="text-gray-500 text-sm mt-1">Owner ID: {shop.owner_id}</p>
          </div>
          <div className="ml-auto bg-gray-100 px-5 py-3 rounded-lg shadow-md max-w-sm">
            <p className="text-gray-700 font-semibold mb-2">Contact</p>
            <div className="text-gray-600 text-sm space-y-1">
              {shop.contacts.email && <p>Email: {shop.contacts.email}</p>}
              {shop.contacts.tel && <p>Tel: {shop.contacts.tel}</p>}
              {shop.contacts.line && <p>Line: {shop.contacts.line}</p>}
              {shop.contacts.facebook && <p>FB: {shop.contacts.facebook}</p>}
              {shop.contacts.information && <p>Information: {shop.contacts.information}</p>}
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
