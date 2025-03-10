import { useNavigate } from "react-router-dom";

function ProductCard({ products = [] }) {
  const navigate = useNavigate();

  const getLowestPrice = (p) => {
    if (p.variants && p.variants.length > 0) {
      const allPrices = p.variants.map((v) => v.price);
      return Math.min(...allPrices);
    }
    return p.price ?? 0;
  };

  const handleProductClick = (prod) => {
    navigate(`/shop/product/${prod.id}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((p) => {
        const displayPrice = getLowestPrice(p);
        return (
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
              {displayPrice ? (
                <div className="flex items-center text-lg">
                  <span className="text-gray-700 mr-1">THB</span>
                  <span className="text-gray-700">{displayPrice}</span>
                </div>
              ) : (
                <div className="text-gray-500">No price</div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ProductCard;
