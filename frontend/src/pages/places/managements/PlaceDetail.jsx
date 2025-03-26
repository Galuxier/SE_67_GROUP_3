import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { getPlaceById } from "../../../services/api/PlaceApi";
import { getImage } from "../../../services/api/ImageApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const PlaceDetail = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { place_id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // State for full-screen image

  useEffect(() => {
    const fetchPlaceData = async () => {
      if (!user || !user._id) {
        toast.error("You must be logged in to view place details");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const response = await getPlaceById(place_id);
        const placeData = response.data;
        setPlace(placeData);

        if (placeData.place_image_urls && placeData.place_image_urls.length > 0) {
          const fetchedImages = await Promise.all(
            placeData.place_image_urls.map(async (imgPath) => await getImage(imgPath))
          );
          setImages(fetchedImages);
        }
      } catch (error) {
        console.error("Error fetching place:", error);
        toast.error("Failed to load place details");
        navigate("/place/management/list");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceData();
  }, [place_id, user, navigate]);

  const openFullScreen = (image) => {
    setSelectedImage(image);
  };

  const closeFullScreen = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!place) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-card rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text">{place.name}</h1>
        <button
          onClick={() => navigate("/place/management/list")}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary flex items-center"
        >
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to List
        </button>
      </div>

      <div className="space-y-6">
        {/* Image Carousel with Swiper */}
        <div className="relative h-80 overflow-hidden rounded-lg">
          {images.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
              className="h-full"
            >
              {images.map((image, index) => (
                <SwiperSlide key={index} className="h-full">
                  <img
                    src={image}
                    alt={`${place.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onError={(e) => (e.target.src = "/fallback-image.jpg")}
                    onClick={() => openFullScreen(image)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <MapPinIcon className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="bg-card border border-border/40 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-3 text-text">Basic Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text/70">Name:</span>
              <span className="font-medium text-text">{place.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">Price per Day:</span>
              <span className="font-medium text-text">฿{place.price.toLocaleString()}</span>
            </div>
            {place.google_map_link && (
              <div className="flex justify-between">
                <span className="text-text/70">Google Maps:</span>
                <a
                  href={place.google_map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-secondary underline"
                >
                  View Location
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="bg-card border border-border/40 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-3 text-text">Address</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text/70">Province:</span>
              <span className="font-medium text-text">{place.address.province}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">District:</span>
              <span className="font-medium text-text">{place.address.district}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">Sub-District:</span>
              <span className="font-medium text-text">{place.address.subdistrict}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/70">Postal Code:</span>
              <span className="font-medium text-text">{place.address.postal_code}</span>
            </div>
            {place.address.street && (
              <div className="flex justify-between">
                <span className="text-text/70">Street:</span>
                <span className="font-medium text-text">{place.address.street}</span>
              </div>
            )}
            {place.address.information && (
              <div className="flex justify-between">
                <span className="text-text/70">Additional Info:</span>
                <span className="font-medium text-text">{place.address.information}</span>
              </div>
            )}
          </div>
        </div>

        {/* Map Preview Placeholder */}
        <div className="bg-card border border-border/40 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-3 text-text">Map Preview</h3>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-40 flex items-center justify-center">
            <p className="text-text/60">Map preview will be displayed here</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => navigate(`/place/management/${place_id}/edit`)}
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Edit Place
        </button>
      </div>

      {/* Full-Screen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeFullScreen}
        >
          <div className="relative max-w-full max-h-full p-4">
            <img
              src={selectedImage}
              alt="Full-screen view"
              className="max-w-full max-h-[90vh] object-contain"
              onError={(e) => (e.target.src = "/fallback-image.jpg")}
            />
            <button
              onClick={closeFullScreen}
              className="absolute top-2 right-2 bg-white/90 text-black rounded-full p-2 hover:bg-gray-200 transition-colors"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceDetail;