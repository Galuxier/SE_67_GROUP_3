import  { useState } from 'react';


const PaymentForm = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formStep, setFormStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    cardHolder: ''
  });
  
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };
  
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'กรุณากรอกอีเมล';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'กรุณากรอกอีเมลให้ถูกต้อง';
    }
    
    if (!formData.firstName) {
      newErrors.firstName = 'กรุณากรอกชื่อ';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'กรุณากรอกนามสกุล';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateCardPayment = () => {
    const newErrors = {};
    
    if (!formData.cardNumber) {
      newErrors.cardNumber = 'กรุณากรอกหมายเลขบัตร';
    }
    
    if (!formData.expiry) {
      newErrors.expiry = 'กรุณากรอกวันหมดอายุ';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) {
      newErrors.expiry = 'กรุณากรอกในรูปแบบ MM/YY';
    }
    
    if (!formData.cvc) {
      newErrors.cvc = 'กรุณากรอกรหัส CVC';
    }
    
    if (!formData.cardHolder) {
      newErrors.cardHolder = 'กรุณากรอกชื่อผู้ถือบัตร';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleContinue = () => {
    if (validateStep1()) {
      setFormStep(formStep + 1);
    }
  };
  
  const handlePayment = () => {
    if (paymentMethod === 'card') {
      if (validateCardPayment()) {
        setFormStep(formStep + 1);
      }
    } else {
      setFormStep(formStep + 1);
    }
  };
  
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  
  const renderStep1 = () => (
    <div className="w-full">
      <div className="mb-4">
        <label className="block mb-2 font-medium">Email</label>
        <input 
          type="email" 
          className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-2 h-10 rounded`}
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      
      <div className="flex gap-4 mb-4">
        <div className="w-1/2">
          <label className="block mb-2 font-medium">ชื่อ</label>
          <input 
            type="text" 
            className={`w-full border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} p-2 h-10 rounded`}
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>
        <div className="w-1/2">
          <label className="block mb-2 font-medium">นามสกุล</label>
          <input 
            type="text" 
            className={`w-full border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} p-2 h-10 rounded`}
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 font-medium">วิธีการชำระเงิน</label>
        <div className="border border-gray-300 rounded">
          <div className="p-4 border-b border-gray-300 flex items-center">
            <input 
              type="checkbox" 
              id="prompt-pay"
              className="mr-2"
              checked={paymentMethod === 'promptpay'}
              onChange={() => handlePaymentMethodChange('promptpay')}
            />
            <label htmlFor="prompt-pay">พร้อมเพย์</label>
          </div>
          <div className="p-4 flex items-center">
            <input 
              type="checkbox" 
              id="credit-card"
              className="mr-2"
              checked={paymentMethod === 'card'}
              onChange={() => handlePaymentMethodChange('card')}
            />
            <label htmlFor="credit-card">บัตรเครดิต/เดบิต</label>
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleContinue}
        className="w-full bg-red-500 hover:bg-red-600 transition-colors text-white p-3 rounded font-medium"
      >
        ดำเนินการต่อ
      </button>
    </div>
  );
  
  const renderCardPayment = () => (
    <div className="w-full">
      <button 
        onClick={() => setFormStep(1)} 
        className="mb-4 text-black p-2 rounded flex items-center font-medium hover:bg-gray-100 transition-colors"
      >
        <span className="mr-1">←</span> วิธีการชำระเงิน
      </button>

      <div className="mb-4">
        <label className="block mb-2 font-medium">หมายเลขบัตร</label>
        <input 
          type="text" 
          placeholder="หมายเลขบัตร"
          className={`w-full border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} p-2 h-10 rounded`}
          value={formData.cardNumber}
          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
        />
        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
      </div>
      
      <div className="flex gap-4 mb-4">
        <div className="w-1/2">
          <label className="block mb-2 font-medium">Expiry</label>
          <input 
            type="text" 
            placeholder="MM/YY"
            className={`w-full border ${errors.expiry ? 'border-red-500' : 'border-gray-300'} p-2 h-10 rounded`}
            value={formData.expiry}
            onChange={(e) => handleInputChange('expiry', e.target.value)}
          />
          {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
        </div>
        <div className="w-1/2">
          <label className="block mb-2 font-medium">Security Code</label>
          <div className="flex">
            <div className="w-full relative">
              <input 
                type="text" 
                placeholder="CVC"
                className={`w-full border ${errors.cvc ? 'border-red-500' : 'border-gray-300'} p-2 h-10 rounded`}
                value={formData.cvc}
                onChange={(e) => handleInputChange('cvc', e.target.value)}
              />
              {errors.cvc && <p className="text-red-500 text-sm mt-1">{errors.cvc}</p>}
            </div>
            <button className="bg-white border border-gray-300 w-10 h-10 flex items-center justify-center ml-1 rounded">
              ?
            </button>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 font-medium">ชื่อผู้ถือบัตร</label>
        <input 
          type="text" 
          placeholder="ชื่อผู้ถือบัตร"
          className={`w-full border ${errors.cardHolder ? 'border-red-500' : 'border-gray-300'} p-2 h-10 rounded`}
          value={formData.cardHolder}
          onChange={(e) => handleInputChange('cardHolder', e.target.value)}
        />
        {errors.cardHolder && <p className="text-red-500 text-sm mt-1">{errors.cardHolder}</p>}
      </div>
      
      <button 
        onClick={handlePayment}
        className="w-full bg-red-500 hover:bg-red-600 transition-colors text-white p-3 rounded font-medium"
      >
        ชำระเงิน
      </button>
    </div>
  );
  
  const renderQRPayment = () => (
    <div className="w-full">
      <button 
        onClick={() => setFormStep(1)} 
        className="mb-4 text-black p-2 rounded flex items-center font-medium hover:bg-gray-100 transition-colors"
      >
        <span className="mr-1">←</span> วิธีการชำระเงิน
      </button>
      <div className="flex justify-center mb-4">
        <div className="w-64 h-64 bg-white border border-gray-300 rounded flex items-center justify-center">
          {/* QR Code placeholder */}
          <div className="w-56 h-56 bg-gray-900 text-white flex items-center justify-center">
            QR Code
          </div>
        </div>
      </div>
      
      <button 
        onClick={handlePayment}
        className="w-full bg-red-500 hover:bg-red-600 transition-colors text-white p-3 rounded font-medium"
      >
        ชำระเงินเสร็จสิ้น
      </button>
    </div>
  );
  
  const renderContent = () => {
    if (formStep === 1) {
      return renderStep1();
    } else if (formStep === 2) {
      if (paymentMethod === 'card') {
        return renderCardPayment();
      } else {
        return renderQRPayment();
      }
    } else {
      return (
        <div className="w-full text-center py-8">
          <div className="text-green-500 text-6xl mb-6">✓</div>
          <h2 className="text-2xl mb-4 font-semibold">การชำระเงินเสร็จสมบูรณ์</h2>
          <p className="text-gray-600">ขอบคุณสำหรับการสั่งซื้อ</p>
        </div>
      );
    }
  };
  
  return renderContent();
};

export default PaymentForm;