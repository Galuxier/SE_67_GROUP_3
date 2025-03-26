import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddressForm from "../forms/AddressForm";

const PaymentForm = ({ type, DatafromOrder }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("promptpay");
  const [formStep, setFormStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [addressData, setAddressData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "", // เพิ่มฟิลด์ phone
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardHolder: "",
    order_id: DatafromOrder?.product?.product_id || "",
    user_id: "",
    amount: DatafromOrder?.total || 0,
    payment_status: "pending",
    paid_at: null,
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.email) {
        newErrors.email = "กรุณากรอกอีเมล";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
      }
      
      if (!formData.firstName) newErrors.firstName = "กรุณากรอกชื่อ";
      if (!formData.lastName) newErrors.lastName = "กรุณากรอกนามสกุล";
      
      // เพิ่มการตรวจสอบเบอร์โทรศัพท์เมื่อเป็น product
      if (type === "product" && !formData.phone) {
        newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
      } else if (type === "product" && !/^[0-9]{10}$/.test(formData.phone)) {
        newErrors.phone = "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก";
      }
    }
    
    if (step === 2 && paymentMethod === "card") {
      if (!formData.cardNumber) newErrors.cardNumber = "กรุณากรอกหมายเลขบัตร";
      if (!formData.expiry) newErrors.expiry = "กรุณากรอกวันหมดอายุ";
      if (!formData.cvc) newErrors.cvc = "กรุณากรอกรหัส CVC";
      if (!formData.cardHolder) newErrors.cardHolder = "กรุณากรอกชื่อผู้ถือบัตร";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createOrderData = () => {
    // เช็ค event_type ว่าเป็น ticket หรือไม่
    if (type === 'ticket') {
      return {
        user_id: formData.user_id,
        order_type: 'ticket',
        items: DatafromOrder.items.map(item => ({
          ref_id: item.ref_id,
          ref_model: item.refModel,
          seat_zone_id: item.seat_zone_id,
          price_at_order: item.price_at_order,
          quantity: item.quantity,
          date: item.date
        })),
        total_price: DatafromOrder.total_price,
        shipping_address: {
          receiver_name: `${formData.firstName} ${formData.lastName}`,
          receiver_phone: formData.phone,
          province: addressData.province || "",
          district: addressData.district || "",
          subdistrict: addressData.subdistrict || "",
          street: addressData.information || "",
          postal_code: addressData.postal_code || "",
          information: addressData.information || "",
        },
        status: "pending"
      };
    } else {
      // สำหรับกรณีอื่นๆ ที่ไม่ใช่ ticket (เช่น Product)
      return {
        user_id: formData.user_id,
        order_type: type,
        items: [{
          ref_id: DatafromOrder.product.product_id,
          ref_model: "Product",
          variant_id: DatafromOrder.product.variant_id,
          price_at_order: DatafromOrder.product.price,
          quantity: DatafromOrder.product.quantity,
        }],
        total_price: DatafromOrder.total,
        shipping_address: {
          receiver_name: `${formData.firstName} ${formData.lastName}`,
          receiver_phone: formData.phone, // ใช้ค่า phone จาก formData
          province: addressData.province || "",
          district: addressData.district || "",
          subdistrict: addressData.subdistrict || "",
          street: addressData.information || "",
          postal_code: addressData.postal_code || "",
          information: addressData.information || "",
        },
        status: "pending"
      };
    }
  };
  

  // ส่วนที่เหลือของฟังก์ชันไม่เปลี่ยนแปลง
  const createPaymentData = () => {
    return {
      order_id: formData.order_id,
      user_id: formData.user_id,
      amount: formData.amount,
      payment_method: paymentMethod,
      payment_status: "pending",
      paid_at: null
    };
  };

  const saveToLocalStorage = (orderData, paymentData) => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const payments = JSON.parse(localStorage.getItem("payments") || "[]");
    
    orders.push(orderData);
    payments.push(paymentData);
    
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.setItem("payments", JSON.stringify(payments));
    
    return { orders, payments };
  };

  const handlePayment = () => {
    if (!validateForm(2)) {
      toast.error("กรุณากรอกข้อมูลให้ถูกต้องครบถ้วน");
      return;
    }

    setIsProcessing(true);
    
    try {
      const orderData = createOrderData();
      const paymentData = createPaymentData();
      
      saveToLocalStorage(orderData, paymentData);
      
      setFormStep(3);
      toast.success("บันทึกข้อมูลการสั่งซื้อเรียบร้อย");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsProcessing(false);
    }
  };

  const updatePaymentStatus = (status) => {
    try {
      const payments = JSON.parse(localStorage.getItem("payments") || "[]");
      const lastPaymentIndex = payments.length - 1;
      
      if (lastPaymentIndex >= 0) {
        payments[lastPaymentIndex].payment_status = status;
        payments[lastPaymentIndex].paid_at = status === "completed" ? new Date().toISOString() : null;
        localStorage.setItem("payments", JSON.stringify(payments));
        
        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        const lastOrderIndex = orders.length - 1;
        
        if (lastOrderIndex >= 0) {
          orders[lastOrderIndex].status = status;
          localStorage.setItem("orders", JSON.stringify(orders));
        }
        
        toast.success(`อัพเดทสถานะเป็น ${status === "completed" ? "สำเร็จ" : "รอดำเนินการ"} แล้ว`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("เกิดข้อผิดพลาดในการอัพเดทสถานะ");
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 font-medium">อีเมล*</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"} p-2 rounded`}
          required
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium">ชื่อ*</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className={`w-full border ${errors.firstName ? "border-red-500" : "border-gray-300"} p-2 rounded`}
            required
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block mb-2 font-medium">นามสกุล*</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className={`w-full border ${errors.lastName ? "border-red-500" : "border-gray-300"} p-2 rounded`}
            required
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>

      {/* เพิ่มช่องกรอกเบอร์โทรศัพท์เมื่อเป็น product */}
      {type === "product" && (
        <div>
          <label className="block mb-2 font-medium">เบอร์โทรศัพท์*</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="0123456789"
            className={`w-full border ${errors.phone ? "border-red-500" : "border-gray-300"} p-2 rounded`}
            required
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
      )}

      {type === "product" && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">ที่อยู่จัดส่ง</h3>
          <AddressForm onChange={setAddressData} />
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">วิธีการชำระเงิน*</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 p-3 border border-gray-300 rounded hover:bg-gray-50">
            <input
              type="radio"
              checked={paymentMethod === "promptpay"}
              onChange={() => setPaymentMethod("promptpay")}
              className="h-4 w-4"
              required
            />
            <span>พร้อมเพย์</span>
          </label>
          <label className="flex items-center space-x-2 p-3 border border-gray-300 rounded hover:bg-gray-50">
            <input
              type="radio"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
              className="h-4 w-4"
            />
            <span>บัตรเครดิต/เดบิต</span>
          </label>
        </div>
      </div>

      <button
        onClick={() => {
          if (validateForm(1)) {
            setFormStep(2);
          } else {
            toast.error("กรุณากรอกข้อมูลให้ถูกต้องครบถ้วน");
          }
        }}
        className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded mt-4"
        disabled={isProcessing}
      >
        {isProcessing ? "กำลังประมวลผล..." : "ดำเนินการต่อ"}
      </button>
    </div>
  );

  // ส่วนที่เหลือของโค้ด (renderCardPayment, renderPromptPay, renderSuccess) ไม่เปลี่ยนแปลง
  const renderCardPayment = () => (
    <div className="space-y-4">
      <button
        onClick={() => setFormStep(1)}
        className="flex items-center text-rose-500 hover:text-rose-600"
      >
        <span className="mr-1">←</span> ย้อนกลับ
      </button>

      <h2 className="text-xl font-semibold">ข้อมูลบัตรเครดิต/เดบิต</h2>

      <div>
        <label className="block mb-2 font-medium">หมายเลขบัตร*</label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={formData.cardNumber}
          onChange={(e) => handleInputChange("cardNumber", e.target.value)}
          className={`w-full border ${errors.cardNumber ? "border-red-500" : "border-gray-300"} p-2 rounded`}
          required
        />
        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium">วันหมดอายุ (MM/YY)*</label>
          <input
            type="text"
            placeholder="MM/YY"
            value={formData.expiry}
            onChange={(e) => handleInputChange("expiry", e.target.value)}
            className={`w-full border ${errors.expiry ? "border-red-500" : "border-gray-300"} p-2 rounded`}
            required
          />
          {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
        </div>
        <div>
          <label className="block mb-2 font-medium">รหัส CVC*</label>
          <input
            type="text"
            placeholder="CVC"
            value={formData.cvc}
            onChange={(e) => handleInputChange("cvc", e.target.value)}
            className={`w-full border ${errors.cvc ? "border-red-500" : "border-gray-300"} p-2 rounded`}
            required
          />
          {errors.cvc && <p className="text-red-500 text-sm mt-1">{errors.cvc}</p>}
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium">ชื่อผู้ถือบัตร*</label>
        <input
          type="text"
          placeholder="ชื่อบนบัตร"
          value={formData.cardHolder}
          onChange={(e) => handleInputChange("cardHolder", e.target.value)}
          className={`w-full border ${errors.cardHolder ? "border-red-500" : "border-gray-300"} p-2 rounded`}
          required
        />
        {errors.cardHolder && <p className="text-red-500 text-sm mt-1">{errors.cardHolder}</p>}
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded mt-2"
        disabled={isProcessing}
      >
        {isProcessing ? "กำลังประมวลผล..." : "ชำระเงิน"}
      </button>
    </div>
  );

  const renderPromptPay = () => (
    <div className="space-y-4">
      <button
        onClick={() => setFormStep(1)}
        className="flex items-center text-rose-500 hover:text-rose-600"
      >
        <span className="mr-1">←</span> ย้อนกลับ
      </button>

      <h2 className="text-xl font-semibold">ชำระเงินด้วยพร้อมเพย์</h2>

      <div className="flex justify-center">
        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
          <div className="bg-white p-4 rounded">
            <p className="text-center mb-2">สแกน QR Code ด้านล่าง</p>
            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-500">QR Code</span>
            </div>
            <p className="text-center font-medium">จำนวนเงิน: ฿{DatafromOrder?.total?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded mt-4"
        disabled={isProcessing}
      >
        {isProcessing ? "กำลังประมวลผล..." : "บันทึกการชำระเงิน"}
      </button>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8 space-y-6">
      <div className="text-green-500 text-5xl mb-4">✓</div>
      <h2 className="text-2xl font-semibold mb-2">บันทึกการสั่งซื้อเรียบร้อย</h2>
      <p className="text-gray-600 mb-6">สถานะปัจจุบัน: {formData.payment_status === "completed" ? "สำเร็จ" : "รอดำเนินการ"}</p>
      
      <div className="flex justify-center gap-4">
        <button
          onClick={() => updatePaymentStatus("completed")}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded"
          disabled={formData.payment_status === "completed"}
        >
          เปลี่ยนสถานะเป็นสำเร็จ
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-rose-500 hover:bg-rose-600 text-white py-2 px-6 rounded"
        >
          กลับสู่หน้าหลัก
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {formStep === 1 && renderStep1()}
      {formStep === 2 && (
        paymentMethod === "card" ? renderCardPayment() : renderPromptPay()
      )}
      {formStep === 3 && renderSuccess()}
    </div>
  );
};

export default PaymentForm;
