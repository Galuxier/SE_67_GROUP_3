import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BsShop } from "react-icons/bs";
import ProductCard from "../../components/ProductCard";
import EditShopModal from "../../components/shops/EditShopModal";
import { getShopFromId } from "../../services/api/ShopApi"; // นำเข้า API service

export default function ShopProfile() {
  const { id } = useParams(); // ดึง ID จาก URL
  const [shop, setShop] = useState(null); // เก็บข้อมูลร้านค้า
  const [showEditModal, setShowEditModal] = useState(false);

  // ดึงข้อมูลร้านค้า
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await getShopFromId(id); // เรียก API
        setShop(response); // ตั้งค่าข้อมูลร้านค้า
      } catch (error) {
        console.error("Error fetching shop:", error);
      }
    };
    fetchShop();
  }, [id]);

  const handleOpenModal = () => setShowEditModal(true);
  const handleCloseModal = () => setShowEditModal(false);

  const handleSaveShop = (newShopData) => {
    setShop((prev) => ({ ...prev, ...newShopData })); // อัปเดตข้อมูลร้านค้า
    setShowEditModal(false);
  };

  if (!shop) return <div>Loading...</div>; // แสดง Loading ถ้ายังไม่ได้รับข้อมูล

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
              src={new URL("../../assets/images/Shop_logo.jpg", import.meta.url).href} // แสดงรูปภาพจาก API
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

        {/* ที่อยู่ */}
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h4 className="text-xl font-semibold mb-2">Address</h4>
          <div className="text-gray-600 text-sm">
            <p>
              {shop.address.street}, {shop.address.subdistrict},{" "}
              {shop.address.district}, {shop.address.province},{" "}
              {shop.address.postal_code}
            </p>
            <p>
              Latitude: {shop.address.latitude}, Longitude: {shop.address.longitude}
            </p>
            <p>Information: {shop.address.information}</p>
          </div>
        </div>

        {/* สินค้า */}
        <div className="mt-6 border-t border-gray-300 pt-4">
          <h4 className="text-xl font-semibold mb-4">Products</h4>
          {/* <ProductCard /> */}
        </div>
      </div>

      {/* Modal สำหรับแก้ไข */}
      <EditShopModal
        show={showEditModal}
        onClose={handleCloseModal}
        shopData={shop}
        onSave={handleSaveShop}
      />
    </div>
  );
}