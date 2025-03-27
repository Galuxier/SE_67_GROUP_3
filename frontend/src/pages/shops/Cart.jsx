import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ShopCart from "../../components/shops/ShopCart";
import { 
  getUserCart, 
  removeItemFromCart, 
  updateCartItemQuantity 
} from "../../services/api/CartApi";
import { getShopById } from "../../services/api/ShopApi";
import { toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState({ shops: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});

  // ฟังก์ชันดึงข้อมูลร้านค้า
  const fetchShopDetails = async (shopId) => {
    try {
      const shop = await getShopById(shopId);
      return {
        name: shop.shop_name || "Unknown Shop",
        logo: shop.logo_url || ""
      };
    } catch (error) {
      console.error('Error fetching shop:', error);
      return {
        name: "Unknown Shop",
        logo: ""
      };
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const response = await getUserCart(user._id);
        console.log("Cart API Response:", response);

        if (!response.success || !response.data?.shops) {
          throw new Error("Invalid cart data structure");
        }

        // ดึงข้อมูลร้านค้าพร้อมกันทั้งหมด
        const shopsWithDetails = await Promise.all(
          response.data.shops.map(async (shop) => {
            const shopDetails = await fetchShopDetails(shop.shop_id);
            return {
              ...shop,
              shop_name: shopDetails.name,
              logo_url: shopDetails.logo,
              items: shop.items.map(item => ({
                ...item,
                variant_id: item.variant_id?._id || item.variant_id,
                product_id: item.product_id?._id || item.product_id,
                product_name: item.product_id?.product_name || "Unknown Product",
                price: item.variant_id?.price || item.product_id?.base_price || 0,
                image_url: item.variant_id?.variant_image_url || 
                         (item.product_id?.product_image_urls?.[0] || ""),
                attribute: item.variant_id?.attributes || {}
              }))
            };
          })
        );

        setCart({ shops: shopsWithDetails });
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error(error.response?.data?.message || "Failed to load cart data");
        setCart({ shops: [] });
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      fetchCart();
    }
  }, [user]);

  const handleSelectItem = (shopId, variantId, isSelected) => {
    setSelectedItems(prev => ({
      ...prev,
      [`${shopId}-${variantId}`]: isSelected
    }));
  };

  const handleRemoveItem = async (shopId, variantId) => {
    try {
      await removeItemFromCart({
        user_id: user._id,
        shop_id: shopId,
        variant_id: variantId
      });

      setCart(prev => ({
        ...prev,
        shops: prev.shops
          .map(shop => 
            shop.shop_id === shopId
              ? { 
                  ...shop, 
                  items: shop.items.filter(item => item.variant_id !== variantId) 
                }
              : shop
          )
          .filter(shop => shop.items.length > 0)
      }));

      // ลบออกจาก selectedItems
      setSelectedItems(prev => {
        const newSelected = {...prev};
        delete newSelected[`${shopId}-${variantId}`];
        return newSelected;
      });

      toast.success("Item removed successfully");
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };

  const handleUpdateQuantity = async (shopId, variantId, newQuantity) => {
    try {
      if (isNaN(newQuantity) || newQuantity < 1) {
        toast.error("Quantity must be at least 1");
        return;
      }

      await updateCartItemQuantity({
        user_id: user._id,
        shop_id: shopId,
        variant_id: variantId,
        quantity: newQuantity
      });

      setCart(prev => ({
        ...prev,
        shops: prev.shops.map(shop => 
          shop.shop_id === shopId
            ? {
                ...shop,
                items: shop.items.map(item => 
                  item.variant_id === variantId 
                    ? { ...item, quantity: newQuantity }
                    : item
                )
              }
            : shop
        )
      }));

      toast.success("Quantity updated successfully");
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(error.response?.data?.message || "Failed to update quantity");
    }
  };

  // คำนวณยอดรวม
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
        state: { 
          cart: { 
            shops: cart.shops, 
            subTotal,
            shippingCost,
            total
          } 
        },
      });
    } else {
      toast.error("Please select at least one item before checkout.");
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <p>Loading cart...</p>
      </div>
    );
  }

  if (!cart.shops || cart.shops.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-64">
        <p className="text-lg text-gray-600">Your cart is empty</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 bg-rose-600 text-white px-4 py-2 rounded"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

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

      {/* Order Summary */}
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
          className={`bg-rose-600 text-white px-4 py-2 w-full rounded ${
            subTotal === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleCheckout}
          disabled={subTotal === 0}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;