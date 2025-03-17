import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { products } from "../../data/ProductsData";
import { shops } from "../../data/ShopsData";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

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
          className="bg-primary text-text px-4 py-2 rounded hover:bg-secondary transition"
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

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // สร้างอาเรย์รูปเพื่อความปลอดภัย
  const productImages = product.images || [product.image_url || ''];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 relative">
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => navigate(-1)}
          className="bg-primary text-text px-4 py-2 rounded hover:bg-secondary transition"
        >
          Back
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-card p-4 md:p-8 shadow-md rounded mt-12">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* ส่วนแสดงรูปภาพซ้าย */}
          <div className="md:w-1/2">
            {/* รูปภาพหลัก */}
            <div className="w-full bg-background rounded">
              <Swiper
                spaceBetween={10}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[Thumbs, Navigation]}
                navigation={true}
                className="product-main-swiper"
              >
                {productImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="flex items-center justify-center" style={{ height: '300px' }}>
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            
            {/* รูปภาพเล็ก (thumbnails) */}
            {productImages.length > 1 && (
              <div className="mt-4">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={8}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation]}
                  className="product-thumbs-swiper"
                >
                  {productImages.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="aspect-square cursor-pointer border border-border rounded overflow-hidden">
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          {/* กล่องรายละเอียดด้านขวา */}
          <div className="md:w-1/2 bg-card p-4 rounded-md shadow-sm">
            <div>
              {/* ชื่อสินค้า */}
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-text">{product.product_name}</h2>
              
              <p className="text-lg font-bold mb-2 text-text">Price: {displayPrice} THB</p>
              <p className="text-text mb-4">Stock: {displayStock}</p>

              {hasVariants && mainOption && (
                <div className="space-y-4">
                  {/* main option */}
                  <div>
                    <p className="font-semibold capitalize text-text">
                      {mainOption.name}:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {getMainOptionValues().map((val) => (
                        <button
                          key={val}
                          onClick={() => handleChangeAttr(mainOption.name, val)}
                          className={`px-3 py-1 rounded border border-border transition 
                            ${
                              selectedAttrs[mainOption.name] === val
                                ? "bg-primary text-text"
                                : "hover:bg-secondary"
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
                        <p className="font-semibold capitalize text-text">{opt.name}:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {possibleVals.map((val) => (
                            <button
                              key={val}
                              onClick={() => handleChangeAttr(opt.name, val)}
                              className={`px-3 py-1 rounded border border-border transition 
                                ${
                                  selectedAttrs[opt.name] === val
                                    ? "bg-primary text-text"
                                    : "hover:bg-secondary"
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

            {/* ปุ่ม */}
            <div className="mt-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="bg-primary text-text px-4 py-2 rounded hover:bg-secondary transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="bg-primary text-text px-4 py-2 rounded hover:bg-secondary transition"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ข้อมูลร้านค้า */}
        {shop && (
          <div className="mt-8">
            <Link
              to={`/shop/profile/${shop.owner_id}`}
              className="block p-4 border border-border rounded bg-card hover:bg-border transition"
            >
              <div className="flex items-center">
                <img
                  src={shop.logo_url}
                  alt="Shop logo"
                  className="w-12 h-12 object-cover rounded-full mr-3 border border-border"
                />
                <div>
                  <p className="font-semibold text-text">{shop.shop_name}</p>
                </div>
              </div>
            </Link>
          </div>
        )}
        
        {/* รายละเอียดสินค้า */}
        <div className="mt-8">
          <h4 className="text-lg font-bold mb-2 text-text">Description</h4>
          <p className="text-text">{product.description}</p>
        </div>
      </div>
    </div>
  );
}