/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import AddressForm from "../forms/AddressForm";
import CropImageModal from "./CropImageModal";
import { updateShop } from "../../services/api/ShopApi";
import ContactForm from "../forms/ContactForm";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { getImage } from "../../services/api/ImageApi";

export default function EditShopModal({ show, onClose, shopData, onSave }) {
  const [formData, setFormData] = useState(() => ({
    shop_name: shopData.shop_name || "",
    description: shopData.description || "",
    contacts: { ...shopData.contacts },
    address: { ...shopData.address },
  }));

  const [logoFile, setLogoFile] = useState(null);
  const [tempFile, setTempFile] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null); // Will be set from shopData.logo_url
  const fileInputRef = useRef(null);

  // Initialize logoPreview with the existing logo URL from shopData
  useEffect(() => {
    const fetchImage = async () =>{
      try{
        const image = await getImage(shopData.logo_url);
        setLogoPreview(image);
      }catch(error){
        console.error("Error fetching image: ", error);
        throw new error;
      }
    }
      
    if (shopData.logo_url) {
      fetchImage();
    }
  }, [shopData.logo_url]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContactChange = (updatedContacts) => {
    setFormData((prev) => ({
      ...prev,
      contacts: updatedContacts,
    }));
  };

  const handleAddressChange = (addr) => {
    setFormData((prev) => ({ ...prev, address: addr }));
  };

  const handleFileSelect = (e) => {
    if (!e.target.files[0]) return;
    setTempFile(e.target.files[0]);
    setShowCrop(true);
  };

  const handleCropDone = (croppedBlob) => {
    setLogoFile(croppedBlob);
    const newPreview = URL.createObjectURL(croppedBlob);
    setLogoPreview(newPreview);
    setShowCrop(false);
  };

  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      fd.append("shop_name", formData.shop_name);
      fd.append("description", formData.description);
      fd.append("contacts", JSON.stringify(formData.contacts));
      fd.append("address", JSON.stringify(formData.address));

      if (logoFile) fd.append("logo_url", logoFile);

      const updatedShop = await updateShop(shopData._id, fd);{logoPreview} 
      onSave(updatedShop);
      onClose();
    } catch (error) {
      alert("Failed to update shop!");
      console.error(error);
    }
  };

  // Clean up preview URL only if it was created locally (not the original logo_url)
  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview !== shopData.logo_url) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview, shopData.logo_url]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Edit Shop</h2>

          {/* Shop Logo Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-2">Shop Logo</label>
            <div className="flex flex-col items-center">
              <div
                className="w-32 h-32 rounded-full overflow-hidden border border-border cursor-pointer mb-2"
                onClick={() => fileInputRef.current?.click()}
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors">
                    <PhotoIcon className="h-10 w-10 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">Add Logo</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
              />
              <p className="text-xs text-text/60 text-center max-w-xs mt-1">
                Upload a square logo image for your shop. This will be displayed to customers.
              </p>
            </div>
          </div>

          <label className="block font-semibold">Shop Name</label>
          <input
            name="shop_name"
            value={formData.shop_name}
            onChange={handleChange}
            className="mb-4 p-2 w-full border"
          />

          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mb-4 p-2 w-full border"
          />

          <label className="block text-lg font-medium mb-2">Contact</label>
          <div className="mb-4">
            <ContactForm
              initialData={formData.contacts}
              onChange={handleContactChange}
            />
          </div>

          <label className="block text-lg font-medium mb-2">Address</label>
          <AddressForm
            initialData={formData.address}
            onChange={handleAddressChange}
          />

          <button
            onClick={handleSubmit}
            className="bg-rose-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
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