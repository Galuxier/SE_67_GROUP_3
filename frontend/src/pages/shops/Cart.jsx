import ShopCart from "../../components/shops/ShopCart";
import { useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState([
    {
      shop_id: "shop01",
      shop_name: "Phuket Fight Club",
      items: [
        {
          product_id: "p001",
          variant_id: "v001",
          product_name: "Boxing Gloves",
          price: 800,
          attribute: { color: "Black", size: "M" },
          quantity: 1,
          image_url: new URL("../../assets/images/Glove_black.jpg", import.meta.url).href,
        },
        {
          product_id: "p002",
          variant_id: "v002",
          product_name: "Muay Thai Shorts",
          price: 550,
          attribute: { color: "Black", size: "M" },
          quantity: 2,
          image_url: new URL("../../assets/images/product-002.webp", import.meta.url).href,
        }
      ]
    },
    {
      shop_id: "shop02",
      shop_name: "Bangkok Fight Store",
      items: [
        {
          product_id: "p003",
          variant_id: "v003",
          product_name: "Shin Guards",
          price: 400,
          attribute: { color: "White", size: "M" },
          quantity: 1,
          image_url: new URL("../../assets/images/product-003.webp", import.meta.url).href,
        },
  
      ]
    }
  ]);
  

  const [selectedItems, setSelectedItems] = useState({});

  const subTotal = cart.reduce((acc, shop) => {
    const shopTotal = shop.items.reduce((shopAcc, item) => {
      const key = `${shop.shop_id}-${item.variant_id}`;
      if (selectedItems[key]) {
        return shopAcc + item.price * item.quantity;
      }
      return shopAcc;
    }, 0);
    return acc + shopTotal;
  }, 0);

  const shipping = 50;
  const total = subTotal + shipping;

  const handleRemoveItem = (shopId, variantId) => {
    setCart((prevCart) => {
      const newCart = prevCart.map((shop) => {
        if (shop.shop_id !== shopId) return shop;
  
        let removed = false;
        const updatedItems = shop.items.filter((it) => {
          if (!removed && it.variant_id === variantId) {
            removed = true;
            return false;
          }
          return true;
        });
        return { ...shop, items: updatedItems };
      });
  
      return newCart.filter((shop) => shop.items.length > 0);
    });
  
    const key = `${shopId}-${variantId}`;
    setSelectedItems((prev) => {
      const newSel = { ...prev };
      delete newSel[key];
      return newSel;
    });
  };
  

  const handleUpdateQuantity = (shopId, variantId, newQty) => {
    setCart((prevCart) =>
      prevCart.map((shop) => {
        if (shop.shop_id !== shopId) return shop;
        const updatedItems = shop.items.map((it) => {
          if (it.variant_id !== variantId) return it;
          return { ...it, quantity: newQty };
        });
        return { ...shop, items: updatedItems };
      })
    );
  };

  const handleSelectItem = (shopId, variantId, checked) => {
    const key = `${shopId}-${variantId}`;
    setSelectedItems((prev) => ({ ...prev, [key]: checked }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">My Cart</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Shop List */}
        <div className="flex-1">
          {cart.map((shop) => (
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

        {/* Order Summary */}
        <div className="w-full md:w-1/3 bg-white p-4 shadow rounded">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>{subTotal.toLocaleString()} THB</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>{shipping.toLocaleString()} THB</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between mb-4">
            <span className="font-bold">Total</span>
            <span className="font-bold">{total.toLocaleString()} THB</span>
          </div>
          <button className="bg-rose-600 text-white px-4 py-2 w-full rounded">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
