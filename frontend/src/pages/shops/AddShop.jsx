import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { registerShop } from '../../services/api/ShopApi';
import AddressForm from "../../components/AddressForm";
import { PaperClipIcon } from "@heroicons/react/24/solid";

export default function AddShop() {
  const navigate = useNavigate();
  const logoInputRef = useRef(null);
  const licenseInputRef = useRef(null);

  const [shopData, setShopData] = useState({
    shop_name: "",
    license: "",
    description: "",
    logo_url: "",
    contacts: {
      email: "",
      tel: "",
      line: "",
      facebook: "",
    },
    address: {},
  });

  const [logoFileName, setLogoFileName] = useState("");
  const [licenseFileName, setLicenseFileName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShopData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setShopData((prev) => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [name]: value,
      },
    }));
  };

  const handleAddressChange = (address) => {
    setShopData((prev) => ({ ...prev, address }));
  };

  const handleLogoIconClick = () => {
    logoInputRef.current.click();
  };
  const handleLicenseIconClick = () => {
    licenseInputRef.current.click();
  };

  const handleFileChange = (e, field) => {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];

    if (field === "logo_url") {
      setLogoFileName(file.name);
    } else if (field === "license") {
      setLicenseFileName(file.name);
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setShopData((prev) => ({
        ...prev,
        [field]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const owner_id = user?._id;

      if (!owner_id) {
        throw new Error("User not found in localStorage");
      }

      const dataToSend = {
        owner_id,
        shop_name: shopData.shop_name,
        license: shopData.license,
        description: shopData.description,
        logo_url: shopData.logo_url,
        contacts: shopData.contacts,
        address: shopData.address,
      };

      const response = await registerShop(dataToSend);
      console.log("Server response:", response);

      navigate("/shop");
    } catch (error) {
      console.error("Error creating shop:", error);
      alert("Failed to create shop!");
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 pt-10 pb-10">
      <div className="w-full max-w-2xl p-6 shadow-lg bg-white rounded-md overflow-y-auto">
        {/* ส่วนหัว */}
        <div className="flex justify-between items-center mb-4">
        <button
        onClick={() => navigate(-1)}
        className="bg-rose-400 text-white px-4 py-2 rounded hover:bg-rose-500 transition"
      >
        Back
      </button>
          <h1 className="text-3xl font-semibold py-2">Shop Register</h1>
          <div className="w-20"></div>
        </div>
        <hr className="mb-6" />

        {/* ฟอร์ม */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Shop Name</label>
            <input
              name="shop_name"
              value={shopData.shop_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-pink-500"
              placeholder="Enter shop name"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={shopData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
              placeholder="Enter shop description"
              rows="4"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Contact</label>
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="w-24 text-gray-700">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={shopData.contacts.email}
                  onChange={handleContactChange}
                  className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
                  placeholder="Enter email (Required)"
                  required
                />
              </div>

              <div className="flex items-center">
                <label className="w-24 text-gray-700">Tel:</label>
                <input
                  type="tel"
                  name="tel"
                  value={shopData.contacts.tel}
                  onChange={handleContactChange}
                  className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
                  placeholder="Enter telephone number (Required)"
                  required
                />
              </div>

              <div className="flex items-center">
                <label className="w-24 text-gray-700">Line ID:</label>
                <input
                  type="text"
                  name="line"
                  value={shopData.contacts.line}
                  onChange={handleContactChange}
                  className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
                  placeholder="Enter Line ID (Optional)"
                />
              </div>

              <div className="flex items-center">
                <label className="w-24 text-gray-700">Facebook:</label>
                <input
                  type="text"
                  name="facebook"
                  value={shopData.contacts.facebook}
                  onChange={handleContactChange}
                  className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
                  placeholder="Enter Facebook (Optional)"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Shop Logo</label>
            <div className="relative w-full">
              <input
                type="file"
                ref={logoInputRef}
                className="hidden"
                onChange={(e) => handleFileChange(e, "logo_url")}
                accept="image/*"
              />
              <button
                type="button"
                className="w-full border border-gray-300 rounded-lg py-2 px-4 flex items-center justify-between cursor-default"
                onClick={handleLogoIconClick}
              >
                <span className="text-gray-500 truncate pointer-events-none">
                  {logoFileName || "Choose a file"}
                </span>
                <PaperClipIcon className="h-5 w-5 text-gray-400 cursor-pointer" />
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">License</label>
            <div className="relative w-full">
              <input
                type="file"
                ref={licenseInputRef}
                className="hidden"
                onChange={(e) => handleFileChange(e, "license")}
                accept="image/*"
              />
              <button
                type="button"
                className="w-full border border-gray-300 rounded-lg py-2 px-4 flex items-center justify-between cursor-default"
                onClick={handleLicenseIconClick}
              >
                <span className="text-gray-500 truncate pointer-events-none">
                  {licenseFileName || "Choose a file"}
                </span>
                <PaperClipIcon className="h-5 w-5 text-gray-400 cursor-pointer" />
              </button>
            </div>
          </div>

          <div className="mb-6">
            <AddressForm onChange={handleAddressChange} />
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 border rounded-lg py-2 px-4 focus:outline-none hover:bg-rose-700 transition-colors"
          >
            <span className="text-white text-lg font-semibold">Submit</span>
          </button>
        </form>
      </div>
    </div>
  );
}
