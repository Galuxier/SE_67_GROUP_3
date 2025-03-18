import { useState } from "react";

const ContactForm = ({ initialData = {}, onChange }) => {
  const [contactData, setContactData] = useState({
    email: initialData.email || "",
    tel: initialData.tel || "",
    line: initialData.line || "",
    facebook: initialData.facebook || ""
  });

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...contactData,
      [name]: value
    };
    
    setContactData(updatedData);
    if (onChange) onChange(updatedData);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <label className="w-24 text-gray-700">Email:</label>
        <input
          type="email"
          name="email"
          value={contactData.email}
          onChange={handleContactChange}
          className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-rose-500"
          placeholder="Enter email"
          required
        />
      </div>
      
      <div className="flex items-center">
        <label className="w-24 text-gray-700">Tel:</label>
        <input
          type="tel"
          name="tel"
          value={contactData.tel}
          onChange={handleContactChange}
          className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-rose-500"
          placeholder="Enter telephone number"
        />
      </div>
      
      <div className="flex items-center">
        <label className="w-24 text-gray-700">Line ID:</label>
        <input
          type="text"
          name="line"
          value={contactData.line}
          onChange={handleContactChange}
          className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-rose-500"
          placeholder="Enter Line ID (Optional)"
        />
      </div>
      
      <div className="flex items-center">
        <label className="w-24 text-gray-700">Facebook:</label>
        <input
          type="text"
          name="facebook"
          value={contactData.facebook}
          onChange={handleContactChange}
          className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-rose-500"
          placeholder="Enter Facebook (Optional)"
        />
      </div>
    </div>
  );
};

export default ContactForm;