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
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [orderSummary, setOrderSummary] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setIsLoading(true);

        if (!state || !state.type || !state.DatafromOrder) {
          throw new Error("Missing order data");
        }

        const { type, DatafromOrder } = state;

        let summaryData = {
          items: [],
          total: DatafromOrder.total || 0,
          shipping: 0
        };

        if (type === "product") {
          const { product } = DatafromOrder;
          const productRes = await getProductById(product.product_id);
          const variantRes = await getVariantById(product.variant_id);
          const shopRes = await getShopById(productRes.data.shop_id);

          let imageUrl = "";
          try {
            imageUrl = variantRes.data?.variant_image_url 
              ? await getImage(variantRes.data.variant_image_url)
              : productRes.data?.product_image_urls?.[0]
              ? await getImage(productRes.data.product_image_urls[0])
              : "";
          } catch (imgError) {
            console.warn("Failed to load image:", imgError);
          }

          summaryData.items = [{
            product_id: product.product_id, // ใช้ product_id
            variant_id: product.variant_id,
            product_name: productRes.data?.product_name || "Unknown Product",
            price: product.price, // ใช้ price
            quantity: product.quantity,
            attributes: variantRes.data?.attributes || {},
            image_url: imageUrl,
            shop_name: shopRes.data?.shop_name || "Unknown Shop"
          }];
        } else if (type === "cart") {
          const { selectedProducts } = DatafromOrder;

          const productsWithDetails = await Promise.all(
            selectedProducts.map(async (item) => {
              const [productRes, variantRes, shopRes] = await Promise.all([
                getProductById(item.product_id),
                getVariantById(item.variant_id),
                getShopById(item.shop_id)
              ]);

              let imageUrl = "";
              try {
                imageUrl = variantRes.data?.variant_image_url 
                  ? await getImage(variantRes.data.variant_image_url)
                  : productRes.data?.product_image_urls?.[0]
                  ? await getImage(productRes.data.product_image_urls[0])
                  : "";
              } catch (imgError) {
                console.warn("Failed to load image:", imgError);
              }

              return {
                product_id: item.product_id, // ใช้ product_id
                variant_id: item.variant_id,
                product_name: productRes.data?.product_name || "Unknown Product",
                price: item.price, // ใช้ price
                quantity: item.quantity,
                attributes: variantRes.data?.attributes || {},
                image_url: imageUrl,
                shop_name: shopRes.data?.shop_name || "Unknown Shop"
              };
            })
          );

          summaryData.items = productsWithDetails;
        }

        summaryData.shipping = summaryData.items.length > 0 ? 50 : 0;
        summaryData.total += summaryData.shipping;

        setOrderSummary(summaryData);
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

  if (!state || !state.type || !state.DatafromOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-500 mb-4">ข้อผิดพลาดคำสั่งซื้อ</h2>
          <p className="mb-6">ไม่พบข้อมูลคำสั่งซื้อ กรุณาลองใหม่จากตะกร้าสินค้า</p>
          <button
            onClick={() => navigate("/shop/cart")}
            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded"
          >
            กลับไปที่ตะกร้า
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
          <h1 className="text-2xl font-bold text-gray-800">ยืนยันคำสั่งซื้อ</h1>
          <p className="text-gray-600">กรุณากรอกข้อมูลการชำระเงินให้ครบถ้วน</p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-2/3 p-6 border-r border-gray-200">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">ข้อมูลการชำระเงิน</h2>
                <PaymentForm
                  type={state.type}
                  DatafromOrder={
                    state.type === "product"
                      ? {
                          product: {
                            product_id: state.DatafromOrder.product.product_id, // ใช้ product_id
                            variant_id: state.DatafromOrder.product.variant_id,
                            price: state.DatafromOrder.product.price, // ใช้ price
                            quantity: state.DatafromOrder.product.quantity
                          },
                          total: orderSummary.total
                        }
                      : {
                          selectedProducts: state.DatafromOrder.selectedProducts.map(item => ({
                            product_id: item.product_id, // ใช้ product_id
                            variant_id: item.variant_id,
                            price: item.price, // ใช้ price
                            quantity: item.quantity
                          })),
                          total: orderSummary.total
                        }
                  }
                  user={user}
                />
              </div>
            </div>

            <div className="md:w-1/3 p-6 bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">สรุปคำสั่งซื้อ</h2>
              {orderSummary.items.reduce((acc, item) => {
                const shopGroup = acc.find(g => g.shop_name === item.shop_name);
                if (shopGroup) {
                  shopGroup.products.push(item);
                } else {
                  acc.push({
                    shop_name: item.shop_name,
                    products: [item]
                  });
                }
                return acc;
              }, []).map((shopGroup, shopIndex) => (
                <div key={shopIndex} className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">
                    {shopGroup.shop_name}
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
                                e.target.src = "/images/product-placeholder.jpg";
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-500 text-xs">ไม่มีรูปภาพ</span>
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
                              ฿{product.price.toLocaleString()} x {product.quantity}
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
                  <span className="text-gray-600">ยอดรวมสินค้า</span>
                  <span>฿{(orderSummary.total - orderSummary.shipping).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ค่าจัดส่ง</span>
                  <span>฿{orderSummary.shipping.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>ยอดรวมทั้งสิ้น</span>
                  <span>฿{orderSummary.total.toLocaleString()}</span>
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