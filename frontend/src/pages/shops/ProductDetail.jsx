import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { products } from "../../data/ProductsData";
import { shops } from "../../data/ShopsData";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // หา product จาก id
  const productId = parseInt(id, 10);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="p-4">
        <p>Product not found!</p>
        <button
          onClick={() => navigate("/shop")}
          className="bg-rose-400 text-white px-4 py-2 rounded hover:bg-rose-500 transition"
        >
          Back
        </button>
      </div>
    );
  }

  // หา shop ของสินค้านี้ (shop_owner_id)
  const shop = shops.find((s) => s.owner_id === product.shop_owner_id);

  // ตรวจว่าเป็นสินค้ามี variants ?
  const hasVariants = !!product.variants && !!product.options && product.options.length > 0;
  
  // หาตัวเลือกหลัก, ตัวเลือกอื่น ๆ
  let mainOption = null;
  let secondaryOptions = [];
  if (hasVariants) {
    mainOption = product.options.find((opt) => opt.isMain);
    secondaryOptions = product.options.filter((opt) => !opt.isMain);
  }

  // เก็บ attribute ที่ผู้ใช้เลือก
  const [selectedAttrs, setSelectedAttrs] = useState(() => {
    if (!hasVariants) return {};
    return { ...product.variants[0].attribute };
  });

  // หา variant ปัจจุบัน
  const findCurrentVariant = () => {
    if (!hasVariants) return null;
    return product.variants.find((variant) =>
      Object.entries(selectedAttrs).every(([k, v]) => variant.attribute[k] === v)
    );
  };
  const currentVariant = hasVariants ? findCurrentVariant() : null;

  // ข้อมูลที่จะแสดง
  const displayImage = hasVariants
    ? currentVariant?.variantImage_url || product.image_url
    : product.image_url;
  const displayPrice = hasVariants
    ? currentVariant?.price ?? 0
    : product.price ?? 0;
  const displayStock = hasVariants
    ? currentVariant?.stock ?? 0
    : product.stock ?? 0;

  // ฟังก์ชันเปลี่ยนค่าตัวเลือก
  const handleChangeAttr = (attrName, value) => {
    setSelectedAttrs((prev) => ({
      ...prev,
      [attrName]: value,
    }));
  };

  const getMainOptionValues = () => {
    if (!hasVariants || !mainOption) return [];
    const mainKey = mainOption.name; 
    const vals = product.variants.map((v) => v.attribute[mainKey]);
    return Array.from(new Set(vals));
  };

  const getPossibleValues = (attrKey) => {
    if (!hasVariants || !mainOption) return [];
    const mainKey = mainOption.name;
    const mainVal = selectedAttrs[mainKey];
    const filtered = product.variants.filter(
      (v) => v.attribute[mainKey] === mainVal
    );
    const vals = filtered.map((v) => v.attribute[attrKey]);
    return Array.from(new Set(vals));
  };

  const handleAddToCart = () => alert("Add to Cart!");
  const handleBuyNow = () => alert("Buy Now!");

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

      <div className="max-w-3xl mx-auto bg-white p-8 shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4">{product.product_name}</h2>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="w-full max-w-md h-96 overflow-hidden mx-auto">
              <img
                src={displayImage}
                alt={product.product_name}
                className="w-full h-full object-cover rounded"
              />
            </div>
          </div>

          {/* กล่องรายละเอียดด้านขวา */}
          <div className="md:w-1/3 bg-white p-4 shadow-md flex flex-col justify-between">
            <div>
              <p className="text-lg font-bold mb-2">Price: {displayPrice} THB</p>
              <p className="text-gray-600 mb-4">Stock: {displayStock}</p>

              {hasVariants && mainOption && (
                <div className="space-y-4">
                  {/* main option */}
                  <div>
                    <p className="font-semibold capitalize">
                      {mainOption.name}:
                    </p>
                    <div className="flex gap-2 mt-1">
                      {getMainOptionValues().map((val) => (
                        <button
                          key={val}
                          onClick={() => handleChangeAttr(mainOption.name, val)}
                          className={`px-3 py-1 rounded border transition 
                            ${
                              selectedAttrs[mainOption.name] === val
                                ? "bg-rose-600 text-white"
                                : "hover:bg-gray-100"
                            }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* secondary options */}
                  {secondaryOptions.map((opt) => {
                    const possibleVals = getPossibleValues(opt.name);
                    return (
                      <div key={opt.name}>
                        <p className="font-semibold capitalize">{opt.name}:</p>
                        <div className="flex gap-2 mt-1">
                          {possibleVals.map((val) => (
                            <button
                              key={val}
                              onClick={() => handleChangeAttr(opt.name, val)}
                              className={`px-3 py-1 rounded border transition 
                                ${
                                  selectedAttrs[opt.name] === val
                                    ? "bg-rose-600 text-white"
                                    : "hover:bg-gray-100"
                                }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ปุ่ม + กรอบโปรไฟล์ร้าน */}
            <div className="mt-4">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={handleAddToCart}
                  className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700 transition"
                >
                  Buy Now
                </button>
              </div>

              {shop && (
                <Link
                  to={`/shop/profile/${shop.owner_id}`}
                  className="block p-4 border rounded bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center">
                    <img
                      src={shop.logo_url}
                      alt="Shop logo"
                      className="w-12 h-12 object-cover rounded-full mr-3 border"
                    />
                    <div>
                      <p className="font-semibold">{shop.shop_name}</p>
                      
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-bold mb-2">Description</h4>
          <p className="text-gray-700">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
