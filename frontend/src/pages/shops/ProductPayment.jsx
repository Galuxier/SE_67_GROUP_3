import { useLocation } from "react-router-dom";
import PaymentForm from "../../components/payment/paymentForm";

const ProductPayment = () => {
  const location = useLocation();
  const orderData = location.state || {};

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
                      <img
                        src={orderData.product.image_url}
                        alt={orderData.product.product_name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = "path-to-fallback-image.jpg";
                        }}
                      />
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