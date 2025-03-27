/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  getUserCart, 
  removeItemFromCart, 
  updateCartItemQuantity 
} from "../../services/api/CartApi";
import { getShopById } from "../../services/api/ShopApi";
import { getImage } from "../../services/api/ImageApi";
import { toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState({ shops: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});

  const fetchShopDetails = async (shopId) => {
    try {
      const shop = await getShopById(shopId);
      return {
        name: shop.shop_name || "Unknown Shop",
        logo: shop.logo_url || ""
      };
    } catch (error) {
      console.error('Error fetching shop:', error);
      return { name: "Unknown Shop", logo: "" };
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const response = await getUserCart(user._id);
        if (!response.success || !response.data?.shops) {
          throw new Error("Invalid cart data structure");
        }

        const shopsWithDetails = await Promise.all(
          response.data.shops.map(async (shop) => {
            const shopDetails = await fetchShopDetails(shop.shop_id);
            const itemsWithImages = await Promise.all(
              shop.items.map(async (item) => {
                let imageUrl = item.variant_id?.variant_image_url || 
                              item.product_id?.product_image_urls?.[0] || 
                              '/placeholder-image.jpg';
                try {
                  if (imageUrl && !imageUrl.startsWith('blob:')) {
                    imageUrl = await getImage(imageUrl);
                  }
                } catch (error) {
                  console.error('Error loading image:', error);
                  imageUrl = '/placeholder-image.jpg';
                }
                return {
                  ...item,
                  variant_id: item.variant_id?._id || item.variant_id,
                  product_id: item.product_id?._id || item.product_id,
                  shop_id: shop.shop_id, // เพิ่ม shop_id เข้าไปใน item
                  product_name: item.product_id?.product_name || "Unknown Product",
                  price: item.variant_id?.price || item.product_id?.base_price || 0,
                  image_url: imageUrl,
                  attributes: item.variant_id?.attributes || {}
                };
              })
            );
            return {
              ...shop,
              shop_name: shopDetails.name,
              logo_url: shopDetails.logo,
              items: itemsWithImages
            };
          })
        );

        setCart({ shops: shopsWithDetails });
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error(error.response?.data?.message || "ไม่สามารถโหลดข้อมูลตะกร้าได้");
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
      await removeItemFromCart({ user_id: user._id, shop_id: shopId, variant_id: variantId });
      setCart(prev => ({
        ...prev,
        shops: prev.shops
          .map(shop => 
            shop.shop_id === shopId
              ? { ...shop, items: shop.items.filter(item => item.variant_id !== variantId) }
              : shop
          )
          .filter(shop => shop.items.length > 0)
      }));
      setSelectedItems(prev => {
        const newSelected = { ...prev };
        delete newSelected[`${shopId}-${variantId}`];
        return newSelected;
      });
      toast.success("ลบสินค้าสำเร็จ");
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error(error.response?.data?.message || "ไม่สามารถลบสินค้าได้");
    }
  };

  const handleUpdateQuantity = async (shopId, variantId, newQuantity) => {
    try {
      if (isNaN(newQuantity) || newQuantity < 1) {
        toast.error("จำนวนต้องมากกว่า 0");
        return;
      }
      await updateCartItemQuantity({ user_id: user._id, shop_id: shopId, variant_id: variantId, quantity: newQuantity });
      setCart(prev => ({
        ...prev,
        shops: prev.shops.map(shop => 
          shop.shop_id === shopId
            ? {
                ...shop,
                items: shop.items.map(item => 
                  item.variant_id === variantId ? { ...item, quantity: newQuantity } : item
                )
              }
            : shop
        )
      }));
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(error.response?.data?.message || "ไม่สามารถอัปเดตจำนวนได้");
    }
  };

  const calculateTotals = () => {
    let subTotal = 0;
    cart.shops.forEach(shop => {
      shop.items.forEach(item => {
        if (selectedItems[`${shop.shop_id}-${item.variant_id}`]) {
          subTotal += item.price * item.quantity;
        }
      });
    });
    const shippingCost = subTotal > 0 ? 50 : 0;
    return { subTotal, shippingCost, total: subTotal + shippingCost };
  };

  const { subTotal, shippingCost, total } = calculateTotals();

  const handleCheckout = () => {
    const hasSelectedItems = Object.values(selectedItems).some(Boolean);
    if (!hasSelectedItems) {
      toast.error("กรุณาเลือกสินค้าอย่างน้อย 1 ชิ้น");
      return;
    }

    const selectedProducts = cart.shops.flatMap(shop => 
      shop.items
        .filter(item => selectedItems[`${shop.shop_id}-${item.variant_id}`])
        .map(item => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          shop_id: shop.shop_id, // เพิ่ม shop_id เข้าไป
          price: item.price,
          quantity: item.quantity
        }))
    );

    const orderData = {
      type: "cart",
      DatafromOrder: {
        selectedProducts,
        total: subTotal
      }
    };

    navigate("/shop/productPayment", { state: orderData });
  };

  const CartItem = ({ shopId, item, selected }) => {
    const handleIncrease = () => handleUpdateQuantity(shopId, item.variant_id, item.quantity + 1);
    const handleDecrease = () => {
      if (item.quantity > 1) handleUpdateQuantity(shopId, item.variant_id, item.quantity - 1);
    };
    const handleRemove = () => handleRemoveItem(shopId, item.variant_id);
    const handleCheckboxChange = (e) => handleSelectItem(shopId, item.variant_id, e.target.checked);

    return (
      <tr className="border-b">
        <td className="py-2 text-center">
          <input type="checkbox" checked={selected} onChange={handleCheckboxChange} />
        </td>
        <td className="py-2 flex items-center gap-2">
          <img
            src={item.image_url}
            alt={item.product_name}
            className="w-16 h-16 object-cover rounded"
            onError={(e) => { e.target.src = '/placeholder-image.jpg'; e.target.onerror = null; }}
          />
          <div>
            <p className="font-medium">{item.product_name}</p>
            {Object.entries(item.attributes || {}).map(([key, val]) => (
              <p key={key} className="text-sm text-gray-600">{key}: {val}</p>
            ))}
          </div>
        </td>
        <td className="py-2">{item.price.toLocaleString()} THB</td>
        <td className="py-2">
          <div className="flex items-center gap-2">
            <button
              className="border px-2 py-1"
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button className="border px-2 py-1" onClick={handleIncrease}>+</button>
          </div>
        </td>
        <td className="py-2 text-right">
          <button onClick={handleRemove} className="text-red-500 hover:text-red-700">🗑</button>
        </td>
      </tr>
    );
  };

  const ShopCart = ({ shop }) => {
    if (!shop?.items?.length) {
      return (
        <div className="bg-white p-4 shadow rounded mb-4">
          <h2 className="text-lg font-bold mb-4">{shop.shop_name || "ร้านค้าไม่ระบุชื่อ"}</h2>
          <p>ไม่มีสินค้าในตะกร้าของร้านค้านี้</p>
        </div>
      );
    }

    return (
      <div className="bg-white p-4 shadow rounded mb-4">
        <h2 className="text-lg font-bold mb-4">{shop.shop_name || "ร้านค้าไม่ระบุชื่อ"}</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 w-10 text-center">เลือก</th>
              <th className="text-left py-2">สินค้า</th>
              <th className="text-left py-2">ราคา</th>
              <th className="text-left py-2">จำนวน</th>
              <th className="text-left py-2"></th>
            </tr>
          </thead>
          <tbody>
            {shop.items.map(item => (
              <CartItem
                key={item.variant_id}
                shopId={shop.shop_id}
                item={item}
                selected={selectedItems[`${shop.shop_id}-${item.variant_id}`] || false}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-4 flex justify-center"><p>กำลังโหลดตะกร้าสินค้า...</p></div>;
  }

  if (!cart.shops.length) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-64">
        <p className="text-lg text-gray-600">ตะกร้าสินค้าของคุณว่างเปล่า</p>
        <button 
          onClick={() => navigate('/shop')}
          className="mt-4 bg-rose-600 text-white px-4 py-2 rounded"
        >
          ช็อปปิ้งต่อ
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-2/3">
        <h1 className="text-2xl font-bold mb-4">ตะกร้าสินค้า</h1>
        {cart.shops.map(shop => (
          <ShopCart key={shop.shop_id} shop={shop} />
        ))}
      </div>
      <div className="w-full md:w-1/3 bg-white p-4 shadow rounded">
        <h2 className="text-lg font-bold mb-4">สรุปคำสั่งซื้อ</h2>
        <div className="flex justify-between mb-2">
          <span>ยอดรวมสินค้า</span>
          <span>{subTotal.toLocaleString()} THB</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>ค่าจัดส่ง</span>
          <span>{shippingCost.toLocaleString()} THB</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between mb-4">
          <span className="font-bold">ยอดรวมทั้งสิ้น</span>
          <span className="font-bold">{total.toLocaleString()} THB</span>
        </div>
        <button
          className={`bg-rose-600 text-white px-4 py-2 w-full rounded ${
            subTotal === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleCheckout}
          disabled={subTotal === 0}
        >
          ชำระเงิน
        </button>
      </div>
    </div>
  );
};

export default Cart;