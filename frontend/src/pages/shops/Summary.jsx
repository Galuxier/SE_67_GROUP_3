import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import VariantModal from "../../components/shops/VariantModal";
import { createProduct } from "../../services/api/ShopApi";

export default function Summary() {
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || {});
  const hasOptions = product.options && product.options.length > 0;
  const [showModal, setShowModal] = useState(false);
  
  const [imagePreviews, setImagePreviews] = useState([]);
  useEffect(() => {
    if (product.image_url && Array.isArray(product.image_url)) {
      const urls = product.image_url.map((file) => URL.createObjectURL(file));
      setImagePreviews(urls);
      return () => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [product.image_url]);

  const handleDeleteVariant = (index) => {
    const updatedVariants = (product.variants || []).filter((_, idx) => idx !== index);
    setProduct((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const handleOpenModal = () => {
    if (!hasOptions) {
      alert("This product has no options!");
      return;
    }
    setShowModal(true);
  };

  const handleSubmitVariant = (variantData) => {
    const oldVars = product.variants || [];
    const updated = { ...product, variants: [...oldVars, variantData] };
    setProduct(updated);
    setShowModal(false);
  };

  const handleConfirm = async () => {
    try {
      const formData = new FormData();
      formData.append("shop_id", "dummyShopId");
      formData.append("product_name", product.product_name || "");
      formData.append("category", product.category || "");
      formData.append("description", product.description || "");

      // Append product images (image_url array)
      const files = product.image_url || [];
      files.forEach((file, idx) => {
        formData.append(`image_url_${idx}`, file);
      });

      if (!hasOptions) {
        formData.append("price", String(product.price || 0));
        formData.append("stock", String(product.stock || 0));
      } else {
        formData.append("options", JSON.stringify(product.options || []));
        const vars = product.variants || [];
        formData.append("variantsLength", String(vars.length));
        vars.forEach((v, idx) => {
          if (v.image_url) {
            formData.append(`variant_image_url_${idx}`, v.image_url);
          }
          formData.append(
            `variant_data_${idx}`,
            JSON.stringify({
              price: v.price,
              stock: v.stock,
              attribute: v.attribute,
            })
          );
        });
      }

      const debugJSON = {
        shop_id: "dummyShopId",
        product_name: product.product_name,
        category: product.category,
        description: product.description,
        image_url: (product.image_url || []).map((f) => f.name),
        ...(hasOptions
          ? {
              options: product.options,
              variants: (product.variants || []).map((v) => ({
                price: v.price,
                stock: v.stock,
                attribute: v.attribute,
                image_url: v.image_url ? v.image_url.name : "",
              })),
            }
          : { price: product.price, stock: product.stock }),
      };
      console.log("=== Debug JSON (no files) ===");
      console.log(JSON.stringify(debugJSON, null, 2));
      console.log("=== Actual FormData content ===");
      formData.forEach((val, key) => {
        console.log(key, val);
      });
      console.log("=============================");

      const res = await createProduct(formData);
      console.log("Create Product Success:", res);
      navigate("/shop");
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate(-1)}
        className="bg-rose-400 text-white px-4 py-2 rounded hover:bg-rose-500"
      >
        Back
      </button>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow mt-4 space-y-6">
        <h2 className="text-3xl font-bold">{product.product_name || "No Name"}</h2>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Description:</strong> {product.description}</p>

        {!hasOptions && (
          <>
            <p><strong>Price:</strong> {product.price}</p>
            <p><strong>Stock:</strong> {product.stock}</p>
          </>
        )}

        {imagePreviews.length > 0 && (
          <div>
            <strong>Uploaded Images:</strong>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
              {imagePreviews.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Preview ${idx}`}
                  className="w-24 h-24 object-cover rounded border"
                />
              ))}
            </div>
          </div>
        )}

        {hasOptions && (
          <>
            <div>
              <p className="font-semibold">Options:</p>
              <ul className="list-disc list-inside">
                {product.options.map((o, idx) => (
                  <li key={idx}>
                    {o.name} {o.isMain && "(main)"}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2">Variants</h3>
              {(product.variants || []).map((v, idx) => (
                <div key={idx} className="border p-4 rounded relative">
                  <button
                    onClick={() => handleDeleteVariant(idx)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <p><strong>Price:</strong> {v.price}</p>
                  <p><strong>Stock:</strong> {v.stock}</p>
                  {Object.entries(v.attribute || {}).map(([k, val]) => (
                    <p key={k}>
                      <strong>{k}:</strong> {val}
                    </p>
                  ))}
                  {v.image_url && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(v.image_url)}
                        alt={`Variant ${idx}`}
                        className="w-24 h-24 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex gap-4">
          {hasOptions && (
            <button
              onClick={handleOpenModal}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Variant
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700"
          >
            Sell
          </button>
        </div>
      </div>

      <VariantModal
        show={showModal && hasOptions}
        onClose={() => setShowModal(false)}
        productOptions={product.options || []}
        onSubmitVariant={handleSubmitVariant}
      />
    </div>
  );
}
