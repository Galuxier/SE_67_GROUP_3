import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PaymentForm from "../../components/payment/paymentForm";
import { getProductById } from "../../services/api/ProductApi";
import { getVariantById } from "../../services/api/VariantApi";
import { getImage } from "../../services/api/ImageApi";

const ProductPayment = () => {
  const location = useLocation();
  const orderData = location.state || {};
  const [productImage, setProductImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductImage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 1. ดึงข้อมูล variant ก่อน
        const variantResponse = await getVariantById(orderData.product?.variant_id);
        const variant = variantResponse.data; // ตามโครงสร้าง API ที่มี
        
        // 2. ตรวจสอบว่ามี variant_image_url หรือไม่
        if (variant?.variant_image_url) {
          try {
            const imageUrl = await getImage(variant.variant_image_url);
            setProductImage(imageUrl);
            return;
          } catch (imgError) {
            console.warn("Failed to load variant image, trying product image...", imgError);
          }
        }
        
        // 3. ถ้า variant ไม่มีรูปหรือโหลดไม่สำเร็จ ให้ดึงรูปจาก product
        const productResponse = await getProductById(orderData.product?.product_id);
        const product = productResponse.data;
        
        if (product?.product_image_urls?.length > 0) {
          const imageUrl = await getImage(product.product_image_urls[0]);
          setProductImage(imageUrl);
        }
      } catch (error) {
        console.error("Failed to fetch product image:", error);
        setError("ไม่สามารถโหลดรูปภาพได้");
      } finally {
        setIsLoading(false);
      }
    };

    if (orderData.product?.product_id && orderData.product?.variant_id) {
      fetchProductImage();
    } else {
      setIsLoading(false);
    }
  }, [orderData]);

  // ฟังก์ชันทำความสะอาด URL เมื่อคอมโพเนนต์ถูกยกเลิก
  useEffect(() => {
    return () => {
      if (productImage) {
        URL.revokeObjectURL(productImage);
      }
    };
  }, [productImage]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">ยืนยันการสั่งซื้อ</h1>
          <p className="text-gray-600">กรุณากรอกข้อมูลการชำระเงิน</p>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Left Section - Payment Form */}
            <div className="md:w-2/3 p-6 border-r border-gray-200">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">ข้อมูลการชำระเงิน</h2>
                <PaymentForm type={orderData.type} DatafromOrder={orderData} />
              </div>
            </div>

            {/* Right Section - Order Summary */}
            <div className="md:w-1/3 p-6 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">สรุปรายการสั่งซื้อ</h2>
          
          {orderData.product && (
            <>
              <div className="mb-4">
                <h3 className="font-medium text-gray-700">
                  {orderData.product.shop_name}
                </h3>
                <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-start space-x-3">
                  {isLoading ? (
                    <div className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>
                  ) : productImage ? (
                    <img
                      src={productImage}
                      alt={orderData.product?.product_name || "Product"}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/product-placeholder.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No Image</span>
                    </div>
                  )}
                    <div>
                      <p className="font-medium text-gray-800">
                        {orderData.product.product_name}
                      </p>
                          {orderData.product.attributes && Object.entries(orderData.product.attributes).map(([key, val]) => (
                            <p key={key} className="text-sm text-gray-600">
                              {key}: {val}
                            </p>
                          ))}
                          <p className="text-gray-800">
                            ฿{orderData.product.price?.toLocaleString()} x {orderData.product.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ยอดรวมสินค้า</span>
                      <span>฿{orderData.subTotal?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ค่าจัดส่ง</span>
                      <span>฿{orderData.shipping?.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>รวมทั้งหมด</span>
                      <span>฿{orderData.total?.toLocaleString()}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPayment;