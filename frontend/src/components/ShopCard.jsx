import { useNavigate } from "react-router-dom";

function ShopCard({ shops }) {
  const navigate = useNavigate();

  const handleShopClick = (shop) => {
    console.log("Navigating to:", `/shop/profile/${shop._id}`);
    navigate(`/shop/profile/${shop._id}`);
  };

  return (
    <div className="flex gap-4"> {/* เรียง ShopCardItem แนวนอน */}
      {shops.map((shop) => (
        <ShopCardItem key={shop._id} shop={shop} onClick={() => handleShopClick(shop)} />
      ))}
    </div>
  );
}

const ShopCardItem = ({ shop, onClick }) => {
  return (
    <button
      className="flex flex-col items-center cursor-pointer"
      onClick={onClick}
    >
      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
        <img
          className="w-full h-full object-cover"
          src={new URL("../assets/images/muaythai-003.png", import.meta.url).href}
          alt={`Shop Logo`}
        />
      </div>
      <div className="mt-4 text-center text-gray-700 text-base font-medium">
        {shop.shop_name}
      </div>
    </button>
  );
};

export default ShopCard;