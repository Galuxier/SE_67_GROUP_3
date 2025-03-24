import { useState, useEffect, Fragment } from "react";
import AddressForm from "../../../components/forms/AddressForm";
import ContactForm from "../../../components/forms/ContactForm";
import { Dialog, Transition } from "@headlessui/react";

export default function ShopInfo() {
  // Dummy ข้อมูลร้านค้า
  const [shop, setShop] = useState({
    shop_name: "My Awesome Shop",
    owner: "John Doe",
    description: "A professional online store selling high-quality products.",
    address: {
      province: "Bangkok",
      district: "Pathum Wan",
      subdistrict: "Lumphini",
      postal_code: "10330",
      information: "123/4 Central Road",
    },
    contact: {
      email: "shop@email.com",
      tel: "0812345678",
      line: "@myshop",
      facebook: "facebook.com/myshop",
    },
  });

  // Modal state สำหรับ Address, Contact และ General Information
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isGeneralModalOpen, setIsGeneralModalOpen] = useState(false);

  // Local form states สำหรับแต่ละ modal
  const [addressFormData, setAddressFormData] = useState(shop.address);
  const [contactFormData, setContactFormData] = useState(shop.contact);
  const [generalFormData, setGeneralFormData] = useState({
    shop_name: shop.shop_name,
    owner: shop.owner,
    description: shop.description,
  });

  // เมื่อ modal เปิด ให้ initialize form data ใหม่จาก shop state
  useEffect(() => {
    if (isAddressModalOpen) {
      setAddressFormData(shop.address);
    }
  }, [isAddressModalOpen, shop.address]);

  useEffect(() => {
    if (isContactModalOpen) {
      setContactFormData(shop.contact);
    }
  }, [isContactModalOpen, shop.contact]);

  useEffect(() => {
    if (isGeneralModalOpen) {
      setGeneralFormData({
        shop_name: shop.shop_name,
        owner: shop.owner,
        description: shop.description,
      });
    }
  }, [isGeneralModalOpen, shop]);

  // Handlers สำหรับการบันทึกข้อมูลจากแต่ละ modal
  const handleSaveAddress = () => {
    setShop((prev) => ({ ...prev, address: addressFormData }));
    setIsAddressModalOpen(false);
  };

  const handleSaveContact = () => {
    setShop((prev) => ({ ...prev, contact: contactFormData }));
    setIsContactModalOpen(false);
  };

  const handleSaveGeneral = () => {
    setShop((prev) => ({ ...prev, ...generalFormData }));
    setIsGeneralModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Shop Information</h1>
      
      <div className="space-y-6">
        {/* General Information */}
        <div className="border border-gray-200 rounded-lg p-4 shadow-sm flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">General Information</h2>
            <p><strong>Shop Name:</strong> {shop.shop_name}</p>
            <p><strong>Owner:</strong> {shop.owner}</p>
            <p><strong>Description:</strong> {shop.description}</p>
          </div>
          <button
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
            onClick={() => setIsGeneralModalOpen(true)}
          >
            Edit
          </button>
        </div>

        {/* Address */}
        <div className="border border-gray-200 rounded-lg p-4 shadow-sm flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Address</h2>
            <p>
              {shop.address.information}, {shop.address.subdistrict},{" "}
              {shop.address.district}, {shop.address.province} {shop.address.postal_code}
            </p>
          </div>
          <button
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
            onClick={() => setIsAddressModalOpen(true)}
          >
            Edit
          </button>
        </div>

        {/* Contact */}
        <div className="border border-gray-200 rounded-lg p-4 shadow-sm flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Contact</h2>
            <p><strong>Email:</strong> {shop.contact.email}</p>
            <p><strong>Tel:</strong> {shop.contact.tel}</p>
            <p><strong>Line:</strong> {shop.contact.line}</p>
            <p><strong>Facebook:</strong> {shop.contact.facebook}</p>
          </div>
          <button
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
            onClick={() => setIsContactModalOpen(true)}
          >
            Edit
          </button>
        </div>
      </div>

      {/* Modal สำหรับแก้ไข General Information */}
      <Transition appear show={isGeneralModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsGeneralModalOpen(false)}>
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-96">
              <Dialog.Title className="text-lg font-semibold">Edit General Information</Dialog.Title>
              <div className="space-y-4 mt-4">
                <div className="flex flex-col">
                  <label className="mb-1">Shop Name</label>
                  <input
                    type="text"
                    value={generalFormData.shop_name}
                    onChange={(e) =>
                      setGeneralFormData({ ...generalFormData, shop_name: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1">Owner</label>
                  <input
                    type="text"
                    value={generalFormData.owner}
                    onChange={(e) =>
                      setGeneralFormData({ ...generalFormData, owner: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1">Description</label>
                  <textarea
                    value={generalFormData.description}
                    onChange={(e) =>
                      setGeneralFormData({ ...generalFormData, description: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={() => setIsGeneralModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                  onClick={handleSaveGeneral}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Modal สำหรับแก้ไข Address */}
      <Transition appear show={isAddressModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsAddressModalOpen(false)}>
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-150">
              <Dialog.Title className="text-lg font-semibold">Edit Address</Dialog.Title>
              <div className="mt-4">
                <AddressForm
                  initialData={addressFormData}
                  onChange={(data) => setAddressFormData(data)}
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={() => setIsAddressModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                  onClick={handleSaveAddress}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Modal สำหรับแก้ไข Contact */}
      <Transition appear show={isContactModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsContactModalOpen(false)}>
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-96">
              <Dialog.Title className="text-lg font-semibold">Edit Contact</Dialog.Title>
              <div className="mt-4">
                <ContactForm
                  initialData={contactFormData}
                  onChange={(data) => setContactFormData(data)}
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={() => setIsContactModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                  onClick={handleSaveContact}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
