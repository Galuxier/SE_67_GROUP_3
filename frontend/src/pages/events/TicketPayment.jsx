import { useState, useEffect } from "react"; // จาก React
import { useNavigate, useParams, useLocation } from "react-router-dom"; // จาก react-router-dom

import PaymentForm from "../../components/payment/paymentForm";

const TicketPayment = () => {
    const location = useLocation();
    const { orderData,event } = location.state || {};
  
    console.log(orderData,event);

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
                <PaymentForm type={orderData.order_type} DatafromOrder={orderData} />
              </div>
            </div>

            {/* Right Section - Order Summary */}
            <div className="md:w-1/3 p-6 bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">สรุปรายการสั่งซื้อ</h2>
              <h3 className="text-lg font-semibold mb-4">{event.event_name}</h3>
              {orderData.items && orderData.items.map((item, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-medium text-gray-700">โซนที่นั่ง: {item.zone_name}</h3>
                  <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.zone_name} - จำนวน {item.quantity} บัตร
                        </p>
                        <p className="text-sm text-gray-600">ราคา: ฿{item.price_at_order.toLocaleString()}</p>
                        <p className="text-gray-800">
                          ยอดรวม: ฿{(item.price_at_order * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="space-y-2 mt-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">ยอดรวมสินค้า</span>
                  <span>฿{orderData.total_price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPayment;
