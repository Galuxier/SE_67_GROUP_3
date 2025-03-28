/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddressForm from "../forms/AddressForm";
import { createProductOrder, createTicketOrder, createCourseOrder, createPackageOrder, updateOrderStatus } from "../../services/api/OrderApi";
import { createPayment, updatePaymentStatus } from "../../services/api/PaymentApi";

const PaymentForm = ({ type, DatafromOrder, user }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("promptpay");
  const [formStep, setFormStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [addressData, setAddressData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardHolder: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.email) newErrors.email = "กรุณากรอกอีเมล";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) 
        newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
      
      if (!formData.firstName) newErrors.firstName = "กรุณากรอกชื่อ";
      if (!formData.lastName) newErrors.lastName = "กรุณากรอกนามสกุล";
      
      if (!formData.phone) newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
      else if (!/^[0-9]{10}$/.test(formData.phone)) 
        newErrors.phone = "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก";

      if (!addressData.province) newErrors.province = "กรุณาเลือกจังหวัด";
      if (!addressData.district) newErrors.district = "กรุณาเลือกอำเภอ";
      if (!addressData.subdistrict) newErrors.subdistrict = "กรุณาเลือกตำบล";
      if (!addressData.postal_code) newErrors.postal_code = "กรุณากรอกรหัสไปรษณีย์";
      else if (!/^[0-9]{5}$/.test(addressData.postal_code)) 
        newErrors.postal_code = "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก";
      if (!addressData.information) newErrors.information = "กรุณากรอกข้อมูลที่อยู่เพิ่มเติม";
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

  const getOrderData = () => {
    const shippingAddress = {
      receiver_name: `${formData.firstName} ${formData.lastName}`,
      receiver_phone: formData.phone,
      province: addressData.province || "",
      district: addressData.district || "",
      subdistrict: addressData.subdistrict || "",
      street: addressData.information || "",
      postal_code: addressData.postal_code || "",
      information: addressData.information || ""
    };

    switch (type) {
      case "product":
        return {
          user_id: user?._id,
          items: [{
            product_id: DatafromOrder.product.product_id,
            variant_id: DatafromOrder.product.variant_id,
            price: DatafromOrder.product.price,
            quantity: DatafromOrder.product.quantity
          }],
          total_price: DatafromOrder.total,
          shippingAddress,
          payment_method: paymentMethod
        };
      case "cart":
        return {
          user_id: user?._id,
          items: DatafromOrder.selectedProducts.map(item => ({
            product_id: item.product_id,
            variant_id: item.variant_id,
            price: item.price,
            quantity: item.quantity
          })),
          total_price: DatafromOrder.total,
          shippingAddress,
          payment_method: paymentMethod
        };
      case "ticket":
        return {
          user_id: user?._id,
          tickets: DatafromOrder.items.map(item => ({
            event_id: item.ref_id,
            seat_zone_id: item.seat_zone_id,
            price: item.price_at_order,
            quantity: item.quantity,
            date: item.date
          })),
          total_price: DatafromOrder.total_price,
          shippingAddress,
          payment_method: paymentMethod
        };
      case "course":
        return {
          user_id: user?._id,
          course_id: DatafromOrder.course_id,
          quantity: DatafromOrder.quantity || 1,
          price: DatafromOrder.price,
          shippingAddress,
          payment_method: paymentMethod
        };
      case "ads_package":
        return {
          user_id: user?._id,
          package_id: DatafromOrder.package_id,
          quantity: DatafromOrder.quantity || 1,
          price: DatafromOrder.price,
          shippingAddress,
          payment_method: paymentMethod
        };
      default:
        throw new Error("Invalid order type");
    }
  };

  const handlePayment = async () => {
    if (!validateForm(2)) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง");
      return;
    }

    if (!user?._id) {
      toast.error("กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ");
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = getOrderData();
      let result;

      switch (type) {
        case "product":
        case "cart":
          result = await createProductOrder(orderData);
          break;
        case "ticket":
          result = await createTicketOrder(orderData);
          break;
        case "course":
          result = await createCourseOrder(orderData);
          break;
        case "ads_package":
          result = await createPackageOrder(orderData);
          break;
        default:
          throw new Error("Unsupported order type");
      }

      setOrderData(result.order);
      setPaymentData(result.payment.data);
      setFormStep(3);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    setIsProcessing(true);
    try {
      console.log(paymentData._id);
      
      await updateOrderStatus(orderData._id, "completed");
      await updatePaymentStatus(paymentData._id, "completed");
      toast.success("การชำระเงินสำเร็จ");
      navigate("/");
    } catch (error) {
      console.error("Error in handlePaymentSuccess:", error);
      toast.error("เกิดข้อผิดพลาดในการอัพเดทสถานะ");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentFailed = async () => {
    setIsProcessing(true);
    try {
      await updateOrderStatus(orderData._id, "failed");
      await updatePaymentStatus(paymentData._id, "failed");
      toast.error("การชำระเงินล้มเหลว");
      navigate("/");
    } catch (error) {
      console.error("Error in handlePaymentFailed:", error);
      toast.error("เกิดข้อผิดพลาดในการอัพเดทสถานะ");
    } finally {
      setIsProcessing(false);
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

      <div>
        <label className="block mb-2 font-medium">เบอร์โทรศัพท์*</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          className={`w-full border ${errors.phone ? "border-red-500" : "border-gray-300"} p-2 rounded`}
          required
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">ที่อยู่จัดส่ง*</h3>
        <AddressForm onChange={setAddressData} />
        {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
        {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
        {errors.subdistrict && <p className="text-red-500 text-sm mt-1">{errors.subdistrict}</p>}
        {errors.postal_code && <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>}
        {errors.information && <p className="text-red-500 text-sm mt-1">{errors.information}</p>}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">วิธีการชำระเงิน*</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 p-3 border border-gray-300 rounded hover:bg-gray-50">
            <input
              type="radio"
              checked={paymentMethod === "promptpay"}
              onChange={() => setPaymentMethod("promptpay")}
              className="h-4 w-4"
            />
            <span>พร้อมเพย์</span>
          </label>
          {/* <label className="flex items-center space-x-2 p-3 border border-gray-300 rounded hover:bg-gray-50">
            <input
              type="radio"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
              className="h-4 w-4"
            />
            <span>บัตรเครดิต/เดบิต</span>
          </label> */}
        </div>
      </div>

      <button
        onClick={() => validateForm(1) ? setFormStep(2) : toast.error("กรุณากรอกข้อมูลให้ครบถ้วน")}
        className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded mt-4"
        disabled={isProcessing}
      >
        {isProcessing ? "กำลังประมวลผล..." : "ดำเนินการต่อ"}
      </button>
    </div>
  );

  const renderCardPayment = () => (
    <div className="space-y-4">
      <button onClick={() => setFormStep(1)} className="flex items-center text-rose-500 hover:text-rose-600">
        <span className="mr-1">←</span> ย้อนกลับ
      </button>
      <h2 className="text-xl font-semibold">ข้อมูลบัตรเครดิต/เดบิต</h2>
      <div>
        <label className="block mb-2 font-medium">หมายเลขบัตร*</label>
        <input
          type="text"
          value={formData.cardNumber}
          onChange={(e) => handleInputChange("cardNumber", e.target.value)}
          className={`w-full border ${errors.cardNumber ? "border-red-500" : "border-gray-300"} p-2 rounded`}
          required
        />
        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium">วันหมดอายุ*</label>
          <input
            type="text"
            value={formData.expiry}
            onChange={(e) => handleInputChange("expiry", e.target.value)}
            className={`w-full border ${errors.expiry ? "border-red-500" : "border-gray-300"} p-2 rounded`}
            placeholder="MM/YY"
            required
          />
          {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
        </div>
        <div>
          <label className="block mb-2 font-medium">CVC*</label>
          <input
            type="text"
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
      <button onClick={() => setFormStep(1)} className="flex items-center text-rose-500 hover:text-rose-600">
        <span className="mr-1">←</span> ย้อนกลับ
      </button>
      <h2 className="text-xl font-semibold">ชำระเงินด้วยพร้อมเพย์</h2>
      <button
        onClick={handlePayment}
        className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded mt-4"
        disabled={isProcessing}
      >
        {isProcessing ? "กำลังประมวลผล..." : "บันทึกการชำระเงิน"}
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center py-8 space-y-6">
      <h2 className="text-2xl font-semibold mb-2">คำสั่งซื้อและการชำระเงินถูกสร้างแล้ว</h2>
      <p className="text-gray-600">Order ID: {orderData?._id}</p>
      <p className="text-gray-600">Payment ID: {paymentData?._id}</p>
      <p className="text-gray-600">สถานะ: รอดำเนินการ</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={handlePaymentSuccess}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded"
          disabled={isProcessing}
        >
          {isProcessing ? "กำลังประมวลผล..." : "จำลองชำระเงินสำเร็จ"}
        </button>
        <button
          onClick={handlePaymentFailed}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded"
          disabled={isProcessing}
        >
          {isProcessing ? "กำลังประมวลผล..." : "จำลองชำระเงินล้มเหลว"}
        </button>
      </div>
      <button
        onClick={() => navigate("/")}
        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded mt-4"
      >
        กลับสู่หน้าหลัก
      </button>
    </div>
  );

  return (
    <div>
      {formStep === 1 && renderStep1()}
      {formStep === 2 && (paymentMethod === "card" ? renderCardPayment() : renderPromptPay())}
      {formStep === 3 && renderStep3()}
    </div>
  );
};

export default PaymentForm;