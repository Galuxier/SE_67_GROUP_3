import React from "react";
import { CheckBadgeIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";

const PackageCard = ({ 
  packageData, 
  onPurchase, 
  isPurchased = false 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border ${
      isPurchased ? "border-green-300" : "border-gray-200"
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
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                <CheckBadgeIcon className="h-3 w-3 mr-1" />
                Purchased
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
          <button
            onClick={() => onPurchase(packageData._id)}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            Purchase Now
          </button>
        ) : (
          <div className="text-center py-2 text-green-600 font-medium">
            Active until {packageData.expiryDate}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageCard;