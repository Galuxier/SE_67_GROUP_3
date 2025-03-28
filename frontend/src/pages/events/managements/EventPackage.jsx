import React, { useEffect, useState } from "react";
import {
  getAdsPackages,
  getPurchasedPackages,
  purchasePackage,
  togglePackageActive,
  getAdsPackagesByType,
  getAdsPackageById,
} from "../../../services/api/AdsPackageApi";
import PackageCard from "../../../components/PackageCard";
import { useAuth } from "../../../context/AuthContext";
import {getCoursesByOwnerId} from "../../../services/api/CourseApi";
import {getEventsByOrganizerId} from "../../../services/api/EventApi";
const EventPackage = () => {
  const [packages, setPackages] = useState([]); // State for event packages
  const [purchasedPackages, setPurchasedPackages] = useState([]); // State for purchased packages
  const [loading, setLoading] = useState(true);
  const { user} = useAuth();
  // console.log("user",user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchedPackages, setFetchedPackages] = useState([]); // State to store fetched package data
  const useId= "67ddcefcb808034424fd0c40";
  // Temporary static packages data (you can remove this later as data is being fetched from the API)
  const staticPackages = [
    {
      type: "course",
      order_id: null, // Changed 'oder_id' to 'order_id'
      user_id: useId,
      package_id: "67b2dc65aa70c479b2fd77ca",
      is_used: false,
      used_at: null,
    },
    {
      type: "event",
      order_id: null, // Changed 'oder_id' to 'order_id'
      user_id: useId,
      package_id: "67e49b24ea95b9ffb2cd5334",
      is_used: false,
      used_at: null,
    },
    {
      type: "event",
      order_id: null, // Changed 'oder_id' to 'order_id'
      user_id: useId,
      package_id: "67e49fc06408417886716725",
      is_used: false,
      used_at: null,
    },
    {
      type: "course",
      order_id: null, // Changed 'oder_id' to 'order_id'
      user_id: useId,
      package_id: "67e4b8e03b5d099bed3c69c3",
      is_used: false,
      used_at: null,
    },
    {
      type: "event",
      order_id: null, // Changed 'oder_id' to 'order_id'
      user_id: useId,
      package_id: "67e4b90d3b5d099bed3c6a35",
      is_used: false,
      used_at: null,
    },
  ];
        // const courses = await getCoursesByOwnerId(useId);
        // console.log("course",courses);

        // const events  =await getEventsByOrganizerId(useId);
        // console.log("even",events);
  // Fetching data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Use getAdsPackagesByType to fetch data by type (event or course)
        const eventPackages = await getAdsPackagesByType("event"); // Get event packages
        setPackages(eventPackages);

        

        const purchased = await getPurchasedPackages("event"); // Get purchased event packages
        setPurchasedPackages(purchased);

        // Fetch package details for each static package asynchronously
        const fetchedData = await Promise.all(
          staticPackages.map(async (pkg) => {
            const packageData = await getAdsPackageById(pkg.package_id); // Fetch package data using package_id
            return { ...pkg, packageData };
          })
        );
        setFetchedPackages(fetchedData); // Store the fetched data
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Run this effect only on component mount

  const handlePurchase = async (packageId) => {
    try {
      console.log(`Starting purchase for package ${packageId}`);
      const purchased = await purchasePackage(packageId);
      console.log("Purchase successful:", purchased);

      // Refresh purchased packages
      const updatedPurchased = await getPurchasedPackages("event");
      setPurchasedPackages(updatedPurchased);

      alert(`Purchased package successfully!`);
    } catch (error) {
      console.error("Purchase failed:", error);
      alert(`Purchase failed: ${error.message}`);
    }
  };

  const handleToggleActive = async (packageId, newStatus) => {
    try {
      console.log(
        `Setting package ${packageId} to ${newStatus ? "active" : "inactive"}`
      );
      await togglePackageActive(packageId, newStatus);

      // Refresh purchased packages
      const updatedPurchased = await getPurchasedPackages("event");
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
        {fetchedPackages.filter((pkg) => !pkg.is_used).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fetchedPackages
              .filter((pkg) => !pkg.is_used) // Filter out only packages where is_used is false
              .map((pkg) => (
                <div
                  key={pkg.package_id}
                  className="bg-white p-6 rounded-lg shadow-lg"
                >
                  <h3 className="text-xl font-semibold">
                    {pkg.packageData?.name}
                  </h3>
                  <p className="mt-2">Price: {pkg.packageData?.price} บาท</p>
                  <p className="mt-2">Type: {pkg.type}</p>
                  <button
                    className="mt-4 bg-primary text-white py-2 px-4 rounded"
                    onClick={() =>
                      handleToggleActive(pkg.package_id, !pkg.is_used)
                    }
                  >
                    {pkg.is_used ? "Mark as Inactive" : "Mark as Active"}
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">
              You haven't purchased any packages yet.
            </p>
          </div>
        )}
      </section>
      {/* Packages with is_used: true */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">
          Purchased Active Packages
        </h2>
        {fetchedPackages.filter((pkg) => pkg.is_used).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fetchedPackages
              .filter((pkg) => pkg.is_used) // Filter out only packages where is_used is true
              .map((pkg) => (
                <div
                  key={pkg.package_id}
                  className="bg-white p-6 rounded-lg shadow-lg"
                >
                  <h3 className="text-xl font-semibold">
                    {pkg.packageData?.name}
                  </h3>
                  <p className="mt-2">Price: {pkg.packageData?.price} บาท</p>
                  <p className="mt-2">Type: {pkg.type}</p>
                  <button
                    className="mt-4 bg-primary text-white py-2 px-4 rounded"
                    onClick={() =>
                      handleToggleActive(pkg.package_id, !pkg.is_used)
                    }
                  >
                    {pkg.is_used ? "Mark as Inactive" : "Mark as Active"}
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">No active packages yet.</p>
          </div>
        )}
      </section>




      {/* Modal for showing package details */}
    {/* {isModalOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-2xl font-bold mb-4">Package Details</h2>
          {selectedPackage && (
            <>
              <p><strong>Name:</strong> {selectedPackage.name}</p>
              <p><strong>Description:</strong> {selectedPackage.description}</p>
              <p><strong>Price:</strong> {selectedPackage.price}</p>
            </>
          )}
          <div className="mt-4 flex justify-end">
            <button onClick={closeModal} className="px-4 py-2 bg-blue-500 text-white rounded-md">Close</button>
          </div>
        </div>
      </div>
    )} */}
  </div>
  );
};

export default EventPackage;
