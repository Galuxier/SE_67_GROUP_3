import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShopCart from "../../components/shops/ShopCart";

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState({
    shops: [
      {
        shop_id: "67e0fff642278417897930c6",
        shop_name: "Boxing Gear Shop",
        items: [
          {
            variant_id: "var1",
            product_id: "67e102f842278417897931f2",
            product_name: "Gloves",
            image_url: new URL("../../assets/images/Glove_red.jpg", import.meta.url).href,
            attribute: { Size: "L", Color: "Red" },
            price: 234,
            quantity: 2,
          },
          {
            variant_id: "var2",
            product_id: "67e1017c4227841789793100",
            product_name: "Test Gloves",
            image_url: new URL("../../assets/images/Glove_white.jpg", import.meta.url).href,
            attribute: { Size: "M", Color: "White" },
            price: 120,
            quantity: 1,
          },
        ],
      },
    ],
  });

  // State สำหรับเก็บสินค้าที่ถูกเลือก
  const [selectedItems, setSelectedItems] = useState({});

  // ฟังก์ชันจัดการเลือกสินค้า
  const handleSelectItem = (shopId, variantId, isSelected) => {
    setSelectedItems((prev) => ({
      ...prev,
      [`${shopId}-${variantId}`]: isSelected,
    }));
  };

  // ฟังก์ชันลบสินค้า
  const handleRemoveItem = (shopId, variantId) => {
    setCart((prevCart) => ({
      ...prevCart,
      shops: prevCart.shops.map((shop) =>
        shop.shop_id === shopId
          ? { ...shop, items: shop.items.filter((item) => item.variant_id !== variantId) }
          : shop
      ),
    }));
  };

  // ฟังก์ชันอัปเดตจำนวนสินค้า
  const handleUpdateQuantity = (shopId, variantId, newQuantity) => {
    setCart((prevCart) => ({
      ...prevCart,
      shops: prevCart.shops.map((shop) =>
        shop.shop_id === shopId
          ? {
              ...shop,
              items: shop.items.map((item) =>
                item.variant_id === variantId ? { ...item, quantity: newQuantity } : item
              ),
            }
          : shop
      ),
    }));
  };

  // คำนวณ subTotal (ราคาสินค้าเท่านั้น) สำหรับสินค้าที่ถูกเลือก
  let subTotal = 0;
  cart.shops.forEach((shop) => {
    shop.items.forEach((item) => {
      if (selectedItems[`${shop.shop_id}-${item.variant_id}`]) {
        subTotal += item.price * item.quantity;
      }
    });
  });

  const shippingCost = subTotal > 0 ? 50 : 0;
  const total = subTotal + shippingCost;

  const handleCheckout = () => {
    const hasSelected = cart.shops.some((shop) =>
      shop.items.some((item) => selectedItems[`${shop.shop_id}-${item.variant_id}`])
    );
    if (hasSelected) {
      navigate("/shop/productPayment", {
        state: { cart: { shops: cart.shops, subTotal } },
      });
    } else {
      alert("Please select at least one item before checkout.");
    }
  };

  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      {/* รายการสินค้า */}
      <div className="w-full md:w-2/3">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        {cart.shops.map((shop) => (
          <ShopCart
            key={shop.shop_id}
            shop={shop}
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
            onSelectItem={handleSelectItem}
            selectedItems={selectedItems}
          />
        ))}
      </div>

      {/* Order Summary ในหน้า Cart */}
      <div className="w-full md:w-1/3 bg-white p-4 shadow rounded">
        <h2 className="text-lg font-bold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>{subTotal.toLocaleString()} THB</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>{shippingCost.toLocaleString()} THB</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between mb-4">
          <span className="font-bold">Total</span>
          <span className="font-bold">{total.toLocaleString()} THB</span>
        </div>
        <button
          className="bg-rose-600 text-white px-4 py-2 w-full rounded"
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
