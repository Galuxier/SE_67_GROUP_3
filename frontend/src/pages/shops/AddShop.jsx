// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { registerShop } from '../../services/api/ShopApi';
// import AddressForm from "../../components/AddressForm";
// import { PlusCircleIcon } from "@heroicons/react/24/outline";
// import { PaperClipIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

// export default function AddShop() {
//   const navigate = useNavigate();
//   const logoInputRef = useRef(null);
//   const licenseInputRef = useRef(null);

//   const [shopData, setShopData] = useState({
//     shop_name: "",
//     license: "",
//     description: "",
//     logo_url: "",
//     contacts: {
//       email: "",
//       tel: "",
//       line: "",
//       facebook: "",
//     },
//     address: {},
//   });

//   const [logoFileName, setLogoFileName] = useState("");
//   const [licenseFileName, setLicenseFileName] = useState("");
//   const [logoPreview, setLogoPreview] = useState(null); // สำหรับแสดงผลรูปภาพ

//   useEffect(() => {
//     return () => {
//       if (logoPreview) {
//         URL.revokeObjectURL(logoPreview); // ลบ URL ชั่วคราวเมื่อ component unmount
//       }
//     };
//   }, [logoPreview]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setShopData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleContactChange = (e) => {
//     const { name, value } = e.target;
//     setShopData((prev) => ({
//       ...prev,
//       contacts: {
//         ...prev.contacts,
//         [name]: value,
//       },
//     }));
//   };

//   const handleAddressChange = (address) => {
//     setShopData((prev) => ({
//       ...prev,
//       address,
//     }));
//   };

//   const handleLogoIconClick = () => {
//     logoInputRef.current.click();
//   };

//   const handleLicenseIconClick = () => {
//     licenseInputRef.current.click();
//   };

//   const handleFileChange = (e, type) => {
//     if (!e.target.files[0]) return;
//     const file = e.target.files[0];

//     if (type === "license") {
//       setLicenseFileName(file.name);
//       setShopData((prev) => ({
//         ...prev,
//         license: file, // เก็บไฟล์แทน URL
//       }));
//     } else {
//       setLogoFileName(file.name);
//       setLogoPreview(URL.createObjectURL(file)); // สร้าง URL ชั่วคราว
//       setShopData((prev) => ({
//         ...prev,
//         logo_url: file, // เก็บไฟล์แทน URL
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       const owner_id = user?._id;

//       if (!owner_id) {
//         throw new Error("User not found in localStorage");
//       }

//       // สร้าง FormData object
//       const formData = new FormData();

//       // เพิ่มข้อมูลทีละฟิลด์ลงใน FormData
//       formData.append("owner_id", owner_id);
//       formData.append("shop_name", shopData.shop_name);
//       formData.append("description", shopData.description);

//       // เพิ่มไฟล์รูปภาพ (logo_url) ถ้ามี
//       if (shopData.logo_url instanceof File) {
//         formData.append("logo", shopData.logo_url);
//       }

//       // เพิ่มไฟล์ใบอนุญาต (license) ถ้ามี
//       if (shopData.license instanceof File) {
//         formData.append("license", shopData.license);
//       }

//       // เพิ่มข้อมูล contact เป็น JSON string
//       formData.append("contact", JSON.stringify(shopData.contacts));

//       // เพิ่มข้อมูล address เป็น JSON string
//       formData.append("address", JSON.stringify(shopData.address));

//       // เรียกใช้ registerShop และส่ง FormData
//       const response = await registerShop(formData);
//       console.log("Server response:", response);

//       navigate("/shop");
//     } catch (error) {
//       console.error("Error creating shop:", error);
//       alert("Failed to create shop!");
//     }
//   };

//   return (
//     <div className="flex justify-center items-start min-h-screen bg-gray-100 pt-10 pb-10">
//       <div className="w-full max-w-2xl p-6 shadow-lg bg-white rounded-md overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-rose-400 text-white px-4 py-2 rounded hover:bg-rose-500 transition"
//           >
//             Back
//           </button>
//           <h1 className="text-3xl font-semibold py-2">Shop Register</h1>
//           <div className="w-20"></div>
//         </div>
//         <hr className="mb-6" />

//         <form onSubmit={handleSubmit}>
//           <div className="mb-6 flex flex-col items-center">
//             <label className="block text-lg font-medium mb-2">Shop Logo</label>
//             <div className="relative flex items-center justify-center">
//               {/* วงกลมรูปภาพ */}
//               <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center">
//                 {logoPreview ? (
//                   <>
//                     <img
//                       src={logoPreview} // ใช้ logoPreview แทน shopData.logo_url
//                       alt="Shop Logo"
//                       className="w-full h-full object-cover"
//                     />
//                     {/* ปุ่ม "x" เพื่อลบรูปภาพ */}
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setShopData((prev) => ({ ...prev, logo_url: "" }));
//                         setLogoPreview(null); // ลบ URL ชั่วคราว
//                         setLogoFileName("");
//                       }}
//                       className="absolute top-5 right-5 p-1 bg-white rounded-full shadow-md hover:bg-red-600 transition-colors"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 text-gray-600"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </button>
//                   </>
//                 ) : (
//                   <button
//                     type="button"
//                     onClick={handleLogoIconClick}
//                     className="p-2 bg-gray-100 rounded-full"
//                   >
//                     <PlusCircleIcon className="h-8 w-8 text-gray-400" />
//                   </button>
//                 )}
//               </div>

//               {/* ปุ่มแก้ไข (แสดงเมื่อเลือกรูปแล้ว) */}
//               {logoPreview && (
//                 <button
//                   type="button"
//                   onClick={handleLogoIconClick}
//                   className="absolute left-full ml-4 p-2 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
//                 >
//                   <PencilSquareIcon className="h-5 w-5 text-gray-600" />
//                 </button>
//               )}
//             </div>

//             {/* Input file ที่ซ่อนอยู่ */}
//             <input
//               type="file"
//               ref={logoInputRef}
//               className="hidden"
//               onChange={(e) => handleFileChange(e, "logo")}
//               accept="image/*"
//             />
//           </div>


//           <div className="mb-6">
//             <label className="block text-lg font-medium mb-2">Shop Name</label>
//             <input
//               name="shop_name"
//               value={shopData.shop_name}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-pink-500"
//               placeholder="Enter shop name"
//               required
//             />
//           </div>

//           <div className="mb-6">
//             <label className="block text-lg font-medium mb-2">Description</label>
//             <textarea
//               name="description"
//               value={shopData.description}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
//               placeholder="Enter shop description"
//               rows="4"
//               required
//             />
//           </div>

//           <div className="mb-6">
//             <label className="block text-lg font-medium mb-2">Contact</label>
//             <div className="space-y-4">
//               <div className="flex items-center">
//                 <label className="w-24 text-gray-700">Email:</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={shopData.contacts.email}
//                   onChange={handleContactChange}
//                   className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
//                   placeholder="Enter email (Required)"
//                   required
//                 />
//               </div>

//               <div className="flex items-center">
//                 <label className="w-24 text-gray-700">Tel:</label>
//                 <input
//                   type="tel"
//                   name="tel"
//                   value={shopData.contacts.tel}
//                   onChange={handleContactChange}
//                   className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
//                   placeholder="Enter telephone number (Required)"
//                   required
//                 />
//               </div>

//               <div className="flex items-center">
//                 <label className="w-24 text-gray-700">Line ID:</label>
//                 <input
//                   type="text"
//                   name="line"
//                   value={shopData.contacts.line}
//                   onChange={handleContactChange}
//                   className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
//                   placeholder="Enter Line ID (Optional)"
//                 />
//               </div>

//               <div className="flex items-center">
//                 <label className="w-24 text-gray-700">Facebook:</label>
//                 <input
//                   type="text"
//                   name="facebook"
//                   value={shopData.contacts.facebook}
//                   onChange={handleContactChange}
//                   className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-red-500"
//                   placeholder="Enter Facebook (Optional)"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="mb-6">
//             <label className="block text-lg font-medium mb-2">License</label>
//             <div className="relative w-full">
//               <input
//                 type="file"
//                 ref={licenseInputRef}
//                 className="hidden"
//                 onChange={(e) => handleFileChange(e, "license")}
//                 accept="image/*"
//               />
//               <button
//                 type="button"
//                 className="w-full border border-gray-300 rounded-lg py-2 px-4 flex items-center justify-between cursor-default"
//                 onClick={handleLicenseIconClick}
//               >
//                 <span className="text-gray-500 truncate pointer-events-none">
//                   {licenseFileName || "Choose a file"}
//                 </span>
//                 <PaperClipIcon className="h-5 w-5 text-gray-400 cursor-pointer" />
//               </button>
//             </div>
//           </div>

//           <div className="mb-6">
//             <AddressForm onChange={handleAddressChange} />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-rose-600 border rounded-lg py-2 px-4 focus:outline-none hover:bg-rose-700 transition-colors"
//           >
//             <span className="text-white text-lg font-semibold">Submit</span>
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

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
        // logo_url: shopData.logo_url,
        contacts: shopData.contacts,
        address: shopData.address,
      };

      const response = await registerShop(dataToSend);
      console.log("Server response:", response);

      navigate("/shop");
    } catch (error) {
      console.error("Error creating shop:", error);
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