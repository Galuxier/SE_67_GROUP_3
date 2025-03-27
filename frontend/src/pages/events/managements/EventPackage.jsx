import React, { useEffect, useState } from "react";
import PackageCard from "../../../components/PackageCard";
import { getAdsPackages, getPurchasedPackages } from "../../../services/api/AdsPackageApi";

const EventPackage = () => {
  const [packages, setPackages] = useState([]);
  const [purchasedPackages, setPurchasedPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ดึงแพ็กเกจทั้งหมดและกรองเฉพาะ type event
        const allPackages = await getAdsPackages();
        const eventPackages = allPackages.filter(pkg => pkg.type === "event");
        setPackages(eventPackages);

        // ดึงแพ็กเกจที่ซื้อแล้ว
        const purchased = await getPurchasedPackages("event");
        setPurchasedPackages(purchased);
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePurchase = async (packageId) => {
    try {
      // สมมติว่ามี API สำหรับซื้อแพ็กเกจ
      // await purchasePackage(packageId);
      alert(`Purchased package ${packageId} successfully`);
      // Refresh ข้อมูลหลังจากซื้อ
      const purchased = await getPurchasedPackages("event");
      setPurchasedPackages(purchased);
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Purchase failed: " + error.message);
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
      <h1 className="text-3xl font-bold mb-8">Event Advertising Packages</h1>
      
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

export default EventPackage;