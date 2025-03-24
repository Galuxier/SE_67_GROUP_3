import CartItem from "./CartItem";

export default function ShopCart({ shop, onRemoveItem, onUpdateQuantity, onSelectItem, selectedItems }) {
  return (
    <div className="bg-white p-4 shadow rounded mb-4">
      <h2 className="text-lg font-bold mb-4">{shop.shop_name || "Unknown Shop"}</h2>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="py-2 w-10 text-center">Select</th>
            <th className="text-left py-2">Product</th>
            <th className="text-left py-2">Price</th>
            <th className="text-left py-2">Quantity</th>
            <th className="text-left py-2"></th>
          </tr>
        </thead>
        <tbody>
          {shop.items.map((item) => (
            <CartItem
              key={item.variant_id}
              shopId={shop.shop_id}
              item={item}
              onRemoveItem={onRemoveItem}
              onUpdateQuantity={onUpdateQuantity}
              onSelectItem={onSelectItem}
              selected={selectedItems[`${shop.shop_id}-${item.variant_id}`] || false}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
