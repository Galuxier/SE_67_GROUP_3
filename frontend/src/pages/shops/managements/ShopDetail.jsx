import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapPinIcon, EnvelopeIcon, PhoneIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { getShopById } from "../../../services/api/ShopApi";
import { getImage } from "../../../services/api/ImageApi";
import EditShopModal from "../../../components/shops/EditShopModal";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function ShopDetail() {
  const [shop, setShop] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { shop_id } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setIsLoading(true);
        const response = await getShopById(shop_id);
        console.log(response);
        
        response.contacts = JSON.parse(response.contacts);
        response.address = JSON.parse(response.address);
        
        setShop(response);

        // Fetch logo image if logo_url exists
        if (response.logo_url) {
          try {
            console.log("logo_url: ", response.logo_url);
            
            const fetchedLogoUrl = await getImage(response.logo_url);
            console.log("fetch logo_url: ",fetchedLogoUrl);
            
            setLogoUrl(fetchedLogoUrl);
          } catch (imageError) {
            console.error("Error fetching logo:", imageError);
            // Optionally set a default or fallback logo
          }
        }
      } catch (fetchError) {
        console.error("Error fetching shop data:", fetchError);
        setError(fetchError);
      } finally {
        setIsLoading(false);
      }
    };

    if (shop_id) {
      fetchShopData();
    }

    // Cleanup function to revoke object URL
    return () => {
      if (logoUrl) {
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, [shop_id]);

  const handleShopUpdate = async (updatedShop) => {
    setShop(updatedShop);
    setIsEditModalOpen(false);

    // Fetch new logo if updated
    if (updatedShop.logo_url) {
      try {
        const fetchedLogoUrl = await getImage(updatedShop.logo_url);
        setLogoUrl(fetchedLogoUrl);
      } catch (imageError) {
        console.error("Error fetching updated logo:", imageError);
      }
    }
  };

  // Render loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Render error state
  if (error || !shop) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Shop</h2>
          <p className="text-text/70">Unable to fetch shop details. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Ensure contact and address objects exist with default empty objects
  const contact = shop.contacts || {};
  const address = shop.address || {};

  // Render shop details
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={`${shop.shop_name} logo`} 
                className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {shop.shop_name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-text">{shop.shop_name}</h1>
              <p className="text-text/70">Owned by {shop.owner || 'Shop Owner'}</p>
            </div>
          </div>
          
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors flex items-center space-x-2"
            onClick={() => setIsEditModalOpen(true)}
          >
            <PencilIcon className="w-5 h-5" />
            <span>Edit Shop</span>
          </button>
        </div>

        {/* Shop Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Description Card */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-text mb-4 border-b border-border pb-2">
              Shop Description
            </h2>
            <p className="text-text/80">{shop.description || 'No description available'}</p>
          </div>

          {/* Contact Information Card */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-text mb-4 border-b border-border pb-2">
              Contact Information
            </h2>
            <div className="space-y-3">
              {contact.email && (
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="w-6 h-6 text-primary/70" />
                  <span className="text-text/80">{contact.email}</span>
                </div>
              )}
              {contact.tel && (
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="w-6 h-6 text-primary/70" />
                  <span className="text-text/80">{contact.tel}</span>
                </div>
              )}
              {contact.line && (
                <div className="flex items-center space-x-3">
                  <ChatBubbleLeftIcon className="w-6 h-6 text-primary/70" />
                  <span className="text-text/80">{contact.line}</span>
                </div>
              )}
              {!contact.email && !contact.tel && !contact.line && (
                <p className="text-text/70">No contact information available</p>
              )}
            </div>
          </div>

          {/* Address Card */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm md:col-span-2">
            <h2 className="text-xl font-semibold text-text mb-4 border-b border-border pb-2">
              Address
            </h2>
            <div className="flex items-center space-x-3">
              <MapPinIcon className="w-6 h-6 text-primary/70" />
              <p className="text-text/80">
                {address.information ? `${address.information}, ` : ''}
                {address.subdistrict ? `${address.subdistrict}, ` : ''} 
                {address.district ? `${address.district}, ` : ''} 
                {address.province || ''} {address.postal_code || ''}
              </p>
            </div>
            {!address.information && !address.subdistrict && !address.district && !address.province && !address.postal_code && (
              <p className="text-text/70 mt-2">No address information available</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Shop Modal */}
      {shop && (
        <EditShopModal
          show={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          shopData={shop}
          onSave={handleShopUpdate}
        />
      )}
    </div>
  );
}

// Import missing icon for edit button
function PencilIcon(props) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor" 
      {...props}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" 
      />
    </svg>
  );
}