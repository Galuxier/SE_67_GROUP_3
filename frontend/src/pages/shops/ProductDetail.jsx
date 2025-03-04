import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { products } from "./ProductsData";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // หา product จาก id
  const productId = parseInt(id, 10);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="p-4">
        <p>Product not found!</p>
        <button
          onClick={() => navigate("/shop")}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  // ตรวจว่าเป็นสินค้ามี variants ?
  const hasVariants = !!product.variants && !!product.options;

  // แยก mainOption / secondaryOptions
  let mainOption = null;
  let secondaryOptions = [];
  if (hasVariants) {
    mainOption = product.options.find((opt) => opt.isMain);
    secondaryOptions = product.options.filter((opt) => !opt.isMain);
  }

  const [selectedAttrs, setSelectedAttrs] = useState(() => {
    if (!hasVariants) return {};
    return { ...product.variants[0].attribute };
  });

  const findCurrentVariant = () => {
    if (!hasVariants) return null;
    return (
      product.variants.find((variant) =>
        Object.entries(selectedAttrs).every(
          ([k, v]) => variant.attribute[k] === v
        )
      ) || product.variants[0]
    );
  };

  const currentVariant = hasVariants ? findCurrentVariant() : null;

  const displayImage = hasVariants
    ? currentVariant.variantImage_url
    : product.image_url;
  const displayPrice = hasVariants ? currentVariant.price : product.price;
  const displayStock = hasVariants ? currentVariant.stock : product.stock;

  const handleChangeAttr = (attrKey, attrValue) => {
    setSelectedAttrs((prev) => {
      const newAttrs = { ...prev, [attrKey]: attrValue };

      if (mainOption && attrKey === mainOption.name) {
        for (const opt of secondaryOptions) {
          const possibleVals = getPossibleValues(opt.name, {
            ...newAttrs,
            [attrKey]: attrValue,
          });
          
          if (!possibleVals.includes(newAttrs[opt.name])) {
            if (possibleVals.length > 0) {
              newAttrs[opt.name] = possibleVals[0];
            } else {
              delete newAttrs[opt.name];
            }
          }
        }
      }
      return newAttrs;
    });
  };

  const getMainOptionValues = () => {
    if (!hasVariants || !mainOption) return [];
    const mainKey = mainOption.name;
    const setVal = new Set(
      product.variants.map((v) => v.attribute[mainKey])
    );
    return Array.from(setVal);
  };

  const getPossibleValues = (attrKey, testAttrs = selectedAttrs) => {
    if (!hasVariants || !mainOption) return [];
    const mainKey = mainOption.name;
    const mainVal = testAttrs[mainKey];
    const filtered = product.variants.filter(
      (v) => v.attribute[mainKey] === mainVal
    );
    const setVal = new Set(filtered.map((v) => v.attribute[attrKey]));
    return Array.from(setVal);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <div className="absolute top-4 left-4">
      <button
        onClick={() => navigate(-1)}
        className="bg-rose-400 text-white px-4 py-2 rounded hover:bg-rose-500 transition"
      >
        Back
      </button>
    </div>

      <div className="max-w-3xl mx-auto bg-white p-8 shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4">{product.product_name}</h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* รูปหลัก */}
          <div className="flex-1">
            <div className="w-full max-w-md h-96 overflow-hidden mx-auto">
              <img
                src={displayImage}
                alt={product.product_name}
                className="w-full h-full object-cover rounded"
              />
            </div>
          </div>

          {/* กล่องขวา */}
          <div className="md:w-1/3 bg-white p-4 shadow-md flex flex-col justify-between">
            <div>
              <p className="text-lg font-bold mb-2">Price: {displayPrice} THB</p>
              <p className="text-gray-600 mb-4">Stock: {displayStock}</p>

              {hasVariants && mainOption && (
                <>
                  {/* แสดง main option */}
                  <div className="mb-4">
                    <p className="font-semibold capitalize">{mainOption.name}:</p>
                    <div className="flex gap-2 mt-1">
                      {getMainOptionValues().map((val) => (
                        <button
                          key={val}
                          onClick={() => handleChangeAttr(mainOption.name, val)}
                          className={`px-3 py-1 rounded border ${
                            selectedAttrs[mainOption.name] === val
                              ? "bg-rose-600 text-white"
                              : ""
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* แสดง secondary options */}
                  {secondaryOptions.map((opt) => {
                    const possibleVals = getPossibleValues(opt.name);
                    return (
                      <div key={opt.name} className="mb-4">
                        <p className="font-semibold capitalize">{opt.name}:</p>
                        <div className="flex gap-2 mt-1">
                          {possibleVals.map((val) => (
                            <button
                              key={val}
                              onClick={() => handleChangeAttr(opt.name, val)}
                              className={`px-3 py-1 rounded border ${
                                selectedAttrs[opt.name] === val
                                  ? "bg-rose-600 text-white"
                                  : ""
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                          {possibleVals.length === 0 && (
                            <span className="text-sm text-gray-500">
                              No {opt.name} available
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            <div className="mt-4">
              <div className="flex gap-2">
                <button className="bg-rose-600 text-white px-4 py-2 rounded">
                  Add to Cart
                </button>
                <button className="bg-rose-600 text-white px-4 py-2 rounded">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-bold mb-2">Description</h4>
          <p className="text-gray-700">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
