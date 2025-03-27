import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CheckBadgeIcon, 
  ShoppingCartIcon,
  PowerIcon,
  ArrowPathIcon 
} from "@heroicons/react/24/solid";

const PackageCard = ({ 
  packageData, 
  onPurchase, 
  isPurchased = false,
  onToggleActive,
  isActive
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate(); // เพิ่มบรรทัดนี้

  const handleToggleActive = async () => {
    setIsProcessing(true);
    try {
      console.log(`Toggling active status for package ${packageData._id}`);
      await onToggleActive(packageData._id, !isActive);
      console.log(`Successfully toggled active status for package ${packageData._id}`);
    } catch (error) {
      console.error(`Failed to toggle active status for package ${packageData._id}:`, error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border ${
      isPurchased ? (isActive ? "border-green-300" : "border-gray-300") : "border-gray-200"
    } hover:shadow-lg transition-shadow`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800">{packageData.name}</h3>
          <div className="flex items-center gap-2">
            {packageData.type === "course" ? (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Course
              </span>
            ) : (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Event
              </span>
            )}
            {isPurchased && (
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded flex items-center ${
                isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}>
                <CheckBadgeIcon className="h-3 w-3 mr-1" />
                {isActive ? "Active" : "Inactive"}
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-600 mb-4">{packageData.detail}</p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Duration</p>
            <p className="font-medium">
              {packageData.duration} days
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Price</p>
            <p className="text-2xl font-bold text-rose-600">
              ฿{packageData.price.toLocaleString()}
            </p>
          </div>
        </div>

        {!isPurchased ? (
          // ในส่วนของปุ่ม Purchase Now ให้แก้ไขเป็น:
          <button
          onClick={() => {
            navigate("/payment/package", {
              state: {
                package: {
                  _id: packageData._id,
                  name: packageData.name,
                  price: packageData.price,
                  duration: packageData.duration,
                  type: packageData.type,
                  detail: packageData.detail
                }
              }
            });
          }}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCartIcon className="h-5 w-5" />
          Purchase Now
        </button>
        ) : (
          <div className="space-y-2">
            <div className="text-center py-1 text-sm font-medium">
              Expires: {packageData.expiryDate}
            </div>
            <button
              onClick={handleToggleActive}
              disabled={isProcessing}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded font-medium ${
                isActive 
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white" 
                  : "bg-green-500 hover:bg-green-600 text-white"
              } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isProcessing ? (
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
              ) : (
                <PowerIcon className="h-4 w-4" />
              )}
              {isActive ? "Deactivate" : "Activate"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageCard;