import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerShop } from "../../services/api/ShopApi";
import AddressForm from "../../components/AddressForm";
import CropImageModal from "../../components/shops/CropImageModal";

export default function AddShop() {
  const navigate = useNavigate();

  const [shopData, setShopData] = useState({
    shop_name: "",
    description: "",
    contacts: { email: "", tel: "", line: "", facebook: "" },
    address: {},
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoFileName, setLogoFileName] = useState("");

  const [licenseFile, setLicenseFile] = useState(null);
  const [licenseFileName, setLicenseFileName] = useState("");

  const [showCrop, setShowCrop] = useState(false);
  const [tempFile, setTempFile] = useState(null);

  const handleChange = (e) => {
    setShopData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContactChange = (e) => {
    setShopData((prev) => ({
      ...prev,
      contacts: { ...prev.contacts, [e.target.name]: e.target.value },
    }));
  };

  const handleAddressChange = (addr) => {
    setShopData((prev) => ({ ...prev, address: addr }));
  };

  const handleLogoFileSelect = (e) => {
    if (!e.target.files[0]) return;
    setTempFile(e.target.files[0]);
    setShowCrop(true);
  };

  const handleCropDone = (croppedBlob) => {
    setShowCrop(false);
  
    // แปลง Blob เป็น File object
    const croppedFile = new File([croppedBlob], "logo_cropped.png", {
      type: "image/png",
    });
  
    setLogoFile(croppedFile);
    setLogoFileName(croppedFile.name);
  };

  const handleLicenseFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLicenseFile(file);
    setLicenseFileName(file.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const owner_id = user?._id || "demoUserId";

      const formData = new FormData();
      formData.append("owner_id", owner_id);
      formData.append("shop_name", shopData.shop_name);
      formData.append("description", shopData.description);

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      if (licenseFile) {
        formData.append("license", licenseFile);
      }

      formData.append("contacts", JSON.stringify(shopData.contacts));
      formData.append("address", JSON.stringify(shopData.address));

      const response = await registerShop(formData);
      console.log("Server response:", response);
      navigate("/shop");
    } catch (error) {
      console.error("Error creating shop:", error);
      alert("Failed to create shop!");
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 pt-10 pb-10">
      <div className="w-full max-w-2xl p-6 shadow-lg bg-white rounded-md">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-rose-400 text-white px-4 py-2 rounded hover:bg-rose-500"
          >
            Back
          </button>
          <h1 className="text-3xl font-semibold">Shop Register</h1>
          <div className="w-20" />
        </div>
        <hr className="mb-6" />

        <form onSubmit={handleSubmit}>
          {/* วงกลมสำหรับเลือกรูปและแสดงผล */}
          <label className="block font-medium mb-1">Shop Profile</label>
          <div className="flex justify-center mb-6">
            <label
              htmlFor="logo-upload"
              className="cursor-pointer w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300 hover:border-rose-400 transition-all"
            >
              {logoFile ? (
                <img
                  src={URL.createObjectURL(logoFile)}
                  alt="Cropped Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-sm text-center">
                  Click to upload logo
                </span>
              )}
            </label>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleLogoFileSelect}
              className="hidden"
            />
            
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Shop Name</label>
            <input
              name="shop_name"
              value={shopData.shop_name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows="3"
              value={shopData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Contact</label>
            <div className="space-y-2">
              <div>
                <span className="mr-2">Email:</span>
                <input
                  type="email"
                  name="email"
                  value={shopData.contacts.email}
                  onChange={handleContactChange}
                  className="border rounded px-2 py-1 w-60"
                  required
                />
              </div>
              <div>
                <span className="mr-2">Tel:</span>
                <input
                  type="tel"
                  name="tel"
                  value={shopData.contacts.tel}
                  onChange={handleContactChange}
                  className="border rounded px-2 py-1 w-60"
                  required
                />
              </div>
              <div>
                <span className="mr-2">Line:</span>
                <input
                  type="text"
                  name="line"
                  value={shopData.contacts.line}
                  onChange={handleContactChange}
                  className="border rounded px-2 py-1 w-60"
                />
              </div>
              <div>
                <span className="mr-2">Facebook:</span>
                <input
                  type="text"
                  name="facebook"
                  value={shopData.contacts.facebook}
                  onChange={handleContactChange}
                  className="border rounded px-2 py-1 w-60"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">License (No Crop)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLicenseFileSelect}
            />
            {licenseFileName && (
              <p className="text-sm text-gray-600">File: {licenseFileName}</p>
            )}
          </div>

          <div className="mb-6">
            <AddressForm onChange={handleAddressChange} />
          </div>

          <button
            type="submit"
            className="bg-rose-600 text-white px-4 py-2 rounded w-full hover:bg-rose-700"
          >
            Submit
          </button>
        </form>
      </div>

      <CropImageModal
        show={showCrop}
        onClose={() => setShowCrop(false)}
        file={tempFile}
        onCropDone={handleCropDone}
      />
    </div>
  );
}