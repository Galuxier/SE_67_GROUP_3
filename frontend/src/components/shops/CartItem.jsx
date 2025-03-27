import { useState, useEffect } from 'react';
import { getImage } from "../../services/api/ImageApi";

export default function CartItem({ shopId, item, onRemoveItem, onUpdateQuantity, onSelectItem, selected }) {
  const handleIncrease = () => {
    onUpdateQuantity(shopId, item.variant_id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(shopId, item.variant_id, item.quantity - 1);
    }
  };
  const [imageUrl, setImageUrl] = useState(item.image_url || '/placeholder-image.jpg');

  useEffect(() => {
    // ดึงรูปภาพใหม่เมื่อ item เปลี่ยนแปลง
    const loadImage = async () => {
      if (item.image_url && !item.image_url.startsWith('blob:')) {
        try {
          const url = await getImage(item.image_url);
          setImageUrl(url);
        } catch (error) {
          console.error('Error loading image:', error);
          setImageUrl('/placeholder-image.jpg');
        }
      }
    };

    loadImage();
  }, [item.image_url]);

  const handleRemove = () => {
    onRemoveItem(shopId, item.variant_id);
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
          src={imageUrl}
          alt={item.product_name}
          className="w-16 h-16 object-cover rounded"
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg';
            e.target.onerror = null;
          }}
        />
        <div>
          <p className="font-medium">{item.product_name}</p>
          {Object.entries(item.attribute || {}).map(([key, val]) => (
            <p key={key} className="text-sm text-gray-600">
              {key}: {val}
            </p>
          ))}
        </div>
      </td>
      <td className="py-2">
        {item.price.toLocaleString()} THB
      </td>
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