import React, { useEffect, useState } from "react";
import PackageCard from "../../../components/PackageCard";
import { 
  getAdsPackages, 
  getPurchasedPackages,
  purchasePackage,
  togglePackageActive,
  getAdsPackagesByType
} from "../../../services/api/AdsPackageApi";

const CoursePackage = () => {
  const [packages, setPackages] = useState([]);
  const [purchasedPackages, setPurchasedPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // ใช้ getAdsPackagesByType แทนการ filter ฝั่ง client
        const eventPackages = await getAdsPackagesByType("course"); // หรือ "course" สำหรับ CoursePackage
        setPackages(eventPackages);
  
        const purchased = await getPurchasedPackages("course"); // หรือ "course" สำหรับ CoursePackage
        setPurchasedPackages(purchased);
      } catch (error) {
        console.error("Failed to fetch packages:", error);
        // อาจเพิ่มการแสดง error ให้ผู้ใช้เห็น
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const handlePurchase = async (packageId) => {
    try {
      console.log(`Starting purchase for package ${packageId}`);
      const purchased = await purchasePackage(packageId);
      console.log("Purchase successful:", purchased);
      
      // Refresh purchased packages
      const updatedPurchased = await getPurchasedPackages("course");
      setPurchasedPackages(updatedPurchased);
      
      alert(`Purchased package successfully!`);
    } catch (error) {
      console.error("Purchase failed:", error);
      alert(`Purchase failed: ${error.message}`);
    }
  };

  const handleToggleActive = async (packageId, newStatus) => {
    try {
      console.log(`Setting package ${packageId} to ${newStatus ? "active" : "inactive"}`);
      await togglePackageActive(packageId, newStatus);
      
      // Refresh purchased packages
      const updatedPurchased = await getPurchasedPackages("course");
      setPurchasedPackages(updatedPurchased);
      
      console.log(`Package ${packageId} status updated successfully`);
    } catch (error) {
      console.error(`Failed to toggle package status:`, error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Course Advertising Packages</h1>
      
      {/* Available Packages */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Available Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard 
              key={pkg._id} 
              packageData={pkg} 
              onPurchase={handlePurchase}
            />
          ))}
        </div>
      </section>

      {/* Purchased Packages */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Your Purchased Packages</h2>
        {purchasedPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedPackages.map((pkg) => (
              <PackageCard 
                key={pkg._id} 
                packageData={pkg} 
                isPurchased={true}
                isActive={pkg.status === "active"}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">You haven't purchased any packages yet.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default CoursePackage;