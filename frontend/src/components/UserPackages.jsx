// src/components/packages/UserPackages.jsx
import { useState, useEffect } from "react";
import { getUserPackages, usePackage } from "../../services/api/OwnPackageApi";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const UserPackages = ({ type, onSelectPackage, selectedPackageId }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPackages = async () => {
      if (!user?._id) return;
      
      setLoading(true);
      try {
        const response = await getUserPackages(user._id, type);
        setPackages(response.data || []);
      } catch (error) {
        console.error("Error fetching packages:", error);
        toast.error("Failed to load your packages");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [user, type]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const calculateDaysRemaining = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleSelectPackage = (packageId) => {
    if (onSelectPackage) {
      onSelectPackage(packageId);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full mx-auto"></div>
        <p className="mt-2 text-text">Loading packages...</p>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="text-center p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <p className="text-text">You don't have any active {type || ""} packages.</p>
        <button 
          className="mt-2 text-primary hover:underline"
          onClick={() => navigate("/payment/package")}
        >
          Purchase a package
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Active Packages</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {packages.map((pkg) => (
          <div 
            key={pkg._id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedPackageId === pkg._id
                ? "border-primary bg-primary/5 dark:bg-primary/10"
                : "border-gray-200 hover:border-primary/50 dark:border-gray-700"
            }`}
            onClick={() => handleSelectPackage(pkg._id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{pkg.package_id?.name || "Package"}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{pkg.package_id?.detail}</p>
              </div>
              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                {pkg.type}
              </div>
            </div>
            
            <div className="mt-3 flex justify-between items-center text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  Expires: {formatDate(pkg.expiry_date)}
                </p>
                <p className="text-primary">
                  {calculateDaysRemaining(pkg.expiry_date)} days remaining
                </p>
              </div>
              
              <div>
                {selectedPackageId === pkg._id ? (
                  <span className="text-green-600 dark:text-green-400 font-medium">Selected</span>
                ) : (
                  <button
                    type="button"
                    className="text-primary hover:text-primary/80"
                    onClick={() => handleSelectPackage(pkg._id)}
                  >
                    Select
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPackages;