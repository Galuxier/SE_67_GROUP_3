import { useLocation } from "react-router-dom";

const ProductPayment = () => {
  const location = useLocation();
  const cart = location.state?.cart || { shops: [], subTotal: 0 };

  const shippingCost = cart.subTotal > 0 ? 50 : 0;
  const totalWithShipping = cart.subTotal + shippingCost;

  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">

      <div className="w-full md:w-2/3"></div>

      <div className="w-full md:w-1/3 bg-white p-4 shadow rounded">
        <h2 className="text-lg font-bold mb-4">Order Summary</h2>

        {/* รายการสินค้าที่เลือก */}
        {cart.shops.map((shop) => (
          <div key={shop.shop_id} className="mb-4">
            <h3 className="text-md font-semibold mb-2">{shop.shop_name}</h3>
            {shop.items.map((item) => (
              <div key={item.variant_id} className="border p-2 mb-2 flex items-center gap-4">
                <img src={item.image_url} alt={item.product_name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  {Object.entries(item.attribute || {}).map(([key, val]) => (
                    <p key={key} className="text-sm text-gray-600">
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {val}
                    </p>
                  ))}
                  <p>Price: {item.price.toLocaleString()} THB</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* คำนวณราคารวม */}
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>{cart.subTotal.toLocaleString()} THB</span>
        </div>

        {/* คำนวณค่าจัดส่ง */}
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>{shippingCost.toLocaleString()} THB</span>
        </div>

        <hr className="my-2" />

        {/* คำนวณราคารวมทั้งหมด */}
        <div className="flex justify-between mb-4">
          <span className="font-bold">Total</span>
          <span className="font-bold">{totalWithShipping.toLocaleString()} THB</span>
        </div>

        <button className="bg-green-600 text-white px-4 py-2 w-full rounded mt-4">
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default ProductPayment;
