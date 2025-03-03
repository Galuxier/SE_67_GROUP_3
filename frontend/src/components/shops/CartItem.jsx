export default function CartItem({ shopId, item, onRemoveItem, onUpdateQuantity, onSelectItem, selected }) {
  const handleRemove = () => {
    onRemoveItem(shopId, item.variant_id);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(shopId, item.variant_id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(shopId, item.variant_id, item.quantity + 1);
  };

  const handleCheckboxChange = (e) => {
    onSelectItem(shopId, item.variant_id, e.target.checked);
  };

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
        />
        <div>
          <p className="font-medium">{item.product_name}</p>
          {/* แสดง attribute ทั้งหมด (ถ้ามี) */}
          {Object.entries(item.attribute || {}).map(([key, val]) => (
            <p key={key} className="text-sm text-gray-600">
              {key.charAt(0).toUpperCase() + key.slice(1)}: {val}
            </p>
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
          <button className="border px-2 py-1" onClick={handleIncrease}>
            +
          </button>
        </div>
      </td>
      <td className="py-2 text-right">
        <button onClick={handleRemove} className="text-red-500 hover:text-red-700">
          🗑
        </button>
      </td>
    </tr>
  );
}
