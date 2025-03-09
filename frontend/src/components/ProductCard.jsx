import { useNavigate } from "react-router-dom";

function ProductCard() {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      image_url: new URL("../assets/images/product-001.webp", import.meta.url).href,
      product_name: "Universal Gloves Tight-Fit Design",
      price: 1000
    },
    {
      id: 2,
      image_url: new URL("../assets/images/product-002.webp", import.meta.url).href,
      product_name: "Limited Edition : Fairtex X Future LAB Boxing Shorts",
      price: 900
    },
    {
      id: 3,
      image_url: new URL("../assets/images/product-003.webp", import.meta.url).href,
      product_name: "Finger Tape for BJJ and MMA",
      price: 200
    },
  ];

  const handleProductClick = (p) => {
    navigate(`/shop/product/${p.id}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((p) => (
        <button
          key={p.id}
          className="max-w-xs rounded overflow-hidden shadow-lg bg-white text-left cursor-pointer transition transform hover:scale-105"
          onClick={() => handleProductClick(p)}
        >
          <img
            className="w-full aspect-[4/3] object-cover"
            src={p.image_url}
            alt={p.product_name}
          />
          <div className="px-6 py-4">
            <div className="text-gray-700 text-base font-medium mb-3">
              {p.product_name}
            </div>
            <div className="flex items-center font-base text-lg mb-2">
              <span className="text-gray-700 text-base mr-1">THB</span>
              <span className="text-gray-700 text-base">{p.price}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default ProductCard;
