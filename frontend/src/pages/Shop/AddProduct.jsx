import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    baseImage: "",  // รูปหลักสินค้า
    hasOptions: false,
    // ถ้าผู้ใช้เลือก No => จะกรอก price, stock ในหน้านี้โดยตรง
    price: "", // เพิ่มช่องเก็บราคาสำหรับกรณี No
    stock: "", // เพิ่มช่องเก็บสต็อกสำหรับกรณี No
    options: [], // [{ name: "Color", isMain: false, values: [] }, ...]
    variants: []
  });

  const [newOption, setNewOption] = useState("");
  const [showModal, setShowModal] = useState(false);

  // ข้อมูล Variant แรกในกรณีเลือก Yes
  const [tempVariant, setTempVariant] = useState({
    image_url: "",
    price: "",
    stock: "",
    attribute: {}
  });

  // อัปโหลดรูปหลัก
  const handleBaseImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProduct((prev) => ({ ...prev, baseImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // เพิ่ม Option (เช่น "Color", "Size")
  const addOption = () => {
    if (!newOption.trim()) return;
    setProduct((prev) => ({
      ...prev,
      options: [...prev.options, { name: newOption, isMain: false, values: [] }]
    }));
    setNewOption("");
  };

  // เลือก Main Option
  const setAsMainOption = (index) => {
    setProduct((prev) => {
      const updatedOptions = prev.options.map((opt, i) => ({
        ...opt,
        isMain: i === index
      }));
      return { ...prev, options: updatedOptions };
    });
  };

  // กด Next
  const openModal = () => {
    // ถ้าเลือก No => สร้าง Variant หลักตัวเดียวจาก price, stock (เพราะ user ใส่ในหน้าปกติ)
    if (!product.hasOptions) {
      const mainVariant = {
        attribute: {},
        image_url: product.baseImage,
        price: parseFloat(product.price) || 0,
        stock: parseInt(product.stock) || 0
      };

      const updatedProduct = {
        ...product,
        variants: [mainVariant] // มี Variant เดียว
      };
      navigate("/summary", { state: { product: updatedProduct } });
      return;
    }

    // ถ้า Yes => เปิด Modal สร้าง Variant แรก
    setShowModal(true);
  };

  // อัปโหลดรูป Variant ใน Modal
  const handleVariantImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempVariant((prev) => ({ ...prev, image_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Submit ใน Modal => ใส่ Variant นี้เข้าไปใน product แล้วไป Summary
  const handleSubmit = () => {
    // บังคับให้ต้องมีรูป Variant ถ้าเลือก Yes
    if (!tempVariant.image_url) {
      alert("Please upload a variant image!");
      return;
    }

    const newVar = {
      attribute: { ...tempVariant.attribute },
      image_url: tempVariant.image_url || product.baseImage,
      price: parseFloat(tempVariant.price) || 0,
      stock: parseInt(tempVariant.stock) || 0
    };

    const updatedProduct = {
      ...product,
      variants: [...product.variants, newVar]
    };

    navigate("/summary", { state: { product: updatedProduct } });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center p-4">
      <div className="bg-white p-6 shadow-lg rounded-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Add Product</h2>

        {/* ชื่อสินค้า */}
        <label className="block mb-1">Product Name</label>
        <input
          type="text"
          className="border p-2 w-full mb-4"
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />

        {/* หมวดหมู่ */}
        <label className="block mb-1">Category</label>
        <input
          type="text"
          className="border p-2 w-full mb-4"
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
        />

        {/* คำอธิบาย */}
        <label className="block mb-1">Description</label>
        <textarea
          className="border p-2 w-full mb-4"
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
        />

        {/* รูปหลัก */}
        <label className="block font-semibold">Product Image</label>
        <input
          type="file"
          accept="image/*"
          className="mb-4 p-2 w-full border"
          onChange={handleBaseImageUpload}
        />

        {/* เลือก Yes/No Product Options */}
        <label className="block mb-1">Product Options</label>
        <div className="mb-4 flex items-center gap-4">
          <label>
            <input
              type="radio"
              name="hasOptions"
              onChange={() => setProduct({ ...product, hasOptions: true })}
            />{" "}
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="hasOptions"
              onChange={() =>
                setProduct({
                  ...product,
                  hasOptions: false,
                  options: [],
                  // ล้างค่า price, stock กรณีเพิ่งสลับ
                  price: "",
                  stock: ""
                })
              }
            />{" "}
            No
          </label>
        </div>

        {/* ถ้าเลือก No => ใส่ price, stock ตั้งแต่หน้านี้ */}
        {!product.hasOptions && (
          <div className="mb-4 border p-2 rounded">
            <label className="block mb-1">Price</label>
            <input
              type="number"
              className="border p-2 w-full mb-4"
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
            />

            <label className="block mb-1">Stock Quantity</label>
            <input
              type="number"
              className="border p-2 w-full mb-4"
              onChange={(e) => setProduct({ ...product, stock: e.target.value })}
            />
          </div>
        )}

        {/* ถ้าเลือก Yes => เพิ่ม Options */}
        {product.hasOptions && (
          <div className="mb-4">
            <div className="flex gap-2 mb-2">
              <label className="block mb-1">Add Option</label>
              <input
                type="text"
                className="border p-2 flex-grow"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
              />
              <button onClick={addOption} className="bg-blue-500 text-white px-4 py-2 rounded">
                ➕
              </button>
            </div>

            {product.options.map((opt, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <p>{opt.name}</p>
                <input
                  type="radio"
                  name="mainOption"
                  onChange={() => setAsMainOption(index)}
                  checked={opt.isMain}
                /> Main Option
              </div>
            ))}
          </div>
        )}

        <button onClick={openModal} className="w-full bg-pink-500 text-white py-2 rounded-lg">
          Next
        </button>
      </div>

      {/* Modal => ถ้าเลือก Yes => กรอก Variant แรก */}
      {showModal && product.hasOptions && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add Product Details</h2>

            {/* Upload Variant Image */}
            <label className="block font-semibold">Upload Variant Image</label>
            <input
              type="file"
              accept="image/*"
              className="border p-2 w-full mb-4"
              onChange={handleVariantImageUpload}
            />

            {/* ใส่ attribute ตาม Options */}
            {product.options.map((opt, index) => (
              <div key={index}>
                <label className="block font-semibold mb-2">{opt.name}</label>
                <input
                  type="text"
                  className="border p-2 w-full mb-4"
                  placeholder={`Enter ${opt.name}`}
                  onChange={(e) => {
                    setTempVariant((prev) => ({
                      ...prev,
                      attribute: { ...prev.attribute, [opt.name]: e.target.value }
                    }));
                  }}
                />
              </div>
            ))}

            <label className="block mb-1">Price</label>
            <input
              type="number"
              className="border p-2 w-full mb-4"
              onChange={(e) => setTempVariant((prev) => ({ ...prev, price: e.target.value }))}
            />

            <label className="block mb-1">Stock Quantity</label>
            <input
              type="number"
              className="border p-2 w-full mb-4"
              onChange={(e) => setTempVariant((prev) => ({ ...prev, stock: e.target.value }))}
            />

            <button onClick={handleSubmit} className="w-full bg-pink-500 text-white py-2 rounded-lg">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
