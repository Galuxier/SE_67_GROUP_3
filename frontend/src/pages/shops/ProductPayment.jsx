import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentForm from "../../components/payment/paymentForm";
import { getProductById } from "../../services/api/ProductApi";
import { getVariantById } from "../../services/api/VariantApi";
import { getImage } from "../../services/api/ImageApi";
import { getShopById } from "../../services/api/ShopApi";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const ProductPayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [groupedProducts, setGroupedProducts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setIsLoading(true);
        
        if (!state?.formData) {
          throw new Error("Missing order data");
        }

        const { type, selectedProducts } = state.formData;

        if (type === "cart") {
          // 1. ดึงข้อมูลร้านค้าทั้งหมด
          const shopIds = [...new Set(selectedProducts.map(p => p.shop_id))];
          const shopsResponse = await Promise.all(
            shopIds.map(shopId => getShopById(shopId))
          );

          // 2. สร้าง Map ของร้านค้า
          const shopsMap = {};
          shopsResponse.forEach(response => {
            const shopData = response.data || response;
            if (shopData) {
              shopsMap[shopData._id] = {
                shop_name: shopData.shop_name || `ร้านค้า (${shopData._id})`
              };
            }
          });

          // 3. ดึงข้อมูลสินค้าและรูปภาพ
          const productsWithImages = await Promise.all(
            selectedProducts.map(async (item) => {
              const [productRes, variantRes] = await Promise.all([
                getProductById(item.product_id),
                getVariantById(item.variant_id)
              ]);

              // ดึงรูปภาพจาก variant ก่อน ถ้าไม่มีใช้จาก product
              let imageUrl = "";
              try {
                if (variantRes.data?.variant_image_url) {
                  imageUrl = await getImage(variantRes.data.variant_image_url);
                } else if (productRes.data?.product_image_urls?.[0]) {
                  imageUrl = await getImage(productRes.data.product_image_urls[0]);
                }
              } catch (imgError) {
                console.warn("Failed to load image:", imgError);
              }

              return {
                ...item,
                product_name: productRes.data?.product_name || "Unknown Product",
                attributes: variantRes.data?.attributes || {},
                image_url: imageUrl
              };
            })
          );

          // 4. จัดกลุ่มสินค้าโดยร้านค้า
          const productsByShop = {};
          productsWithImages.forEach(product => {
            if (!productsByShop[product.shop_id]) {
              productsByShop[product.shop_id] = {
                shopInfo: shopsMap[product.shop_id] || { 
                  shop_name: `ร้านค้า (${product.shop_id})`
                },
                products: []
              };
            }
            productsByShop[product.shop_id].products.push(product);
          });

          setGroupedProducts(Object.values(productsByShop));
        }
      } catch (error) {
        console.error("Failed to load order data:", error);
        toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูลคำสั่งซื้อ");
        navigate("/shop/cart");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, [state, navigate]);

  if (!state?.formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-500 mb-4">Order Error</h2>
          <p className="mb-6">Missing order information. Please try again from your cart.</p>
          <button
            onClick={() => navigate("/shop/cart")}
            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ClipLoader size={50} color="#E11D48" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Order Confirmation</h1>
          <p className="text-gray-600">Please complete your payment information</p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Payment Form Section */}
            <div className="md:w-2/3 p-6 border-r border-gray-200">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                <PaymentForm 
                  type={state.formData.type}
                  DatafromOrder={{
                    ...state.formData,
                    groupedProducts
                  }}
                  user={user} // ส่ง user เข้าไป
                />
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="md:w-1/3 p-6 bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              {groupedProducts.map((shopGroup, shopIndex) => (
                <div key={shopIndex} className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">
                    {shopGroup.shopInfo.shop_name}
                  </h3>

                  <div className="space-y-3">
                    {shopGroup.products.map((product, productIndex) => (
                      <div key={productIndex} className="p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-start space-x-3">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.product_name}
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
                              {product.product_name}
                            </p>
                            {product.attributes && Object.entries(product.attributes).map(([key, val]) => (
                              <p key={key} className="text-sm text-gray-600">
                                {key}: {val}
                              </p>
                            ))}
                            <p className="text-gray-800">
                              ฿{product.price?.toLocaleString()} x {product.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="space-y-2 mt-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>฿{state.formData.subTotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>฿{state.formData.shipping?.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>฿{state.formData.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPayment;