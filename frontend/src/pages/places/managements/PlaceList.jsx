import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import {
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
  MapPinIcon,
  ArrowsUpDownIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { getPlacesByOwnerId } from "../../../services/api/PlaceApi";
import { getImage } from "../../../services/api/ImageApi";

const PlaceList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [imageCache, setImageCache] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  useEffect(() => {
    const fetchPlacesAndImages = async () => {
      if (!user?._id) {
        toast.error("You must be logged in to view your places");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const response = await getPlacesByOwnerId(user._id);
        const placesData = response.data;
        setPlaces(placesData);

        const imagePromises = placesData.map(async (place) => {
          if (place.place_image_urls && place.place_image_urls.length > 0) {
            const urls = await Promise.all(
              place.place_image_urls.map(async (imgPath) => {
                try {
                  return await getImage(imgPath);
                } catch (error) {
                  console.error(`Error fetching image ${imgPath}:`, error);
                  return null;
                }
              })
            );
            return { id: place._id, urls: urls.filter((url) => url !== null) };
          }
          return { id: place._id, urls: [] };
        });

        const images = await Promise.all(imagePromises);
        const newImageCache = images.reduce((acc, { id, urls }) => {
          if (urls.length > 0) acc[id] = urls;
          return acc;
        }, {});
        setImageCache(newImageCache);
        setCurrentImageIndex(
          placesData.reduce((acc, place) => ({ ...acc, [place._id]: 0 }), {})
        );
      } catch (error) {
        console.error("Error fetching places:", error);
        toast.error("Failed to fetch places");
      } finally {
        setLoading(false);
      }
    };

    fetchPlacesAndImages();
  }, [user, navigate]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleNextImage = (placeId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [placeId]: (prev[placeId] + 1) % totalImages,
    }));
  };

  const handlePrevImage = (placeId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [placeId]: (prev[placeId] - 1 + totalImages) % totalImages,
    }));
  };

  const filteredPlaces = places
    .filter((place) =>
      searchTerm
        ? place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          place.address.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
          place.address.district.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "price") {
        comparison = a.price - b.price;
      } else if (sortBy === "location") {
        comparison = a.address.province.localeCompare(b.address.province);
      } else if (sortBy === "bookings") {
        comparison = (a.bookings || 0) - (b.bookings || 0);
      } else if (sortBy === "created_at") {
        comparison = new Date(a.created_at) - new Date(b.created_at);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const handleDeletePlace = async (placeId) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      try {
        setPlaces((prev) => prev.filter((place) => place._id !== placeId));
        setImageCache((prev) => {
          const newCache = { ...prev };
          delete newCache[placeId];
          return newCache;
        });
        setCurrentImageIndex((prev) => {
          const newIndex = { ...prev };
          delete newIndex[placeId];
          return newIndex;
        });
        toast.success("Place deleted successfully");
      } catch (error) {
        console.error("Error deleting place:", error);
        toast.error("Failed to delete place");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-text mb-4 sm:mb-0">My Places</h1>
        <Link
          to="/place/management/create"
          className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Add New Place
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="block w-full p-2 pl-10 text-sm border border-border rounded-lg bg-background text-text focus:ring-primary focus:border-primary"
            placeholder="Search by name or location..."
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { key: "name", label: "Name" },
          { key: "price", label: "Price", Icon: CurrencyDollarIcon },
          { key: "location", label: "Location", Icon: MapPinIcon },
          { key: "bookings", label: "Bookings" },
          { key: "created_at", label: "Date Added", Icon: CalendarIcon },
        ].map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => handleSort(key)}
            className={`flex items-center px-3 py-1.5 text-sm rounded-lg border ${
              sortBy === key
                ? "border-primary text-primary bg-primary/10"
                : "border-border text-text bg-background"
            }`}
          >
            {Icon && <Icon className="h-4 w-4 mr-1" />}
            {label}
            {sortBy === key && <ArrowsUpDownIcon className="h-4 w-4 ml-1" />}
          </button>
        ))}
      </div>

      {filteredPlaces.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <MapPinIcon className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-text">No places found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm ? "Try adjusting your search" : "Start by adding a new place"}
          </p>
          {!searchTerm && (
            <Link
              to="/place/management/create"
              className="inline-flex items-center mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Add New Place
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlaces.map((place) => {
            const images = imageCache[place._id] || [];
            const currentIndex = currentImageIndex[place._id] || 0;

            return (
              <div
                key={place._id}
                className="bg-background border border-border/40 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-56 overflow-hidden relative"> {/* Increased from h-40 to h-56 */}
                  {images.length > 0 ? (
                    <>
                      <img
                        src={images[currentIndex]}
                        alt={`${place.name} - Image ${currentIndex + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.src = "/fallback-image.jpg")}
                      />
                      {images.length > 1 && (
                        <div className="absolute inset-x-0 top-0 h-full flex items-center justify-between px-2">
                          <button
                            onClick={() => handlePrevImage(place._id, images.length)}
                            className="bg-white/90 dark:bg-gray-800/90 p-2 rounded-full hover:bg-primary/90 hover:text-white transition-colors"
                          >
                            <ChevronLeftIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleNextImage(place._id, images.length)}
                            className="bg-white/90 dark:bg-gray-800/90 p-2 rounded-full hover:bg-primary/90 hover:text-white transition-colors"
                          >
                            <ChevronRightIcon className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {currentIndex + 1}/{images.length}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <MapPinIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Link
                      to={`/place/management/${place._id}/edit`}
                      className="bg-white/90 dark:bg-gray-800/90 p-1.5 rounded-full hover:bg-primary/90 hover:text-white transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeletePlace(place._id)}
                      className="bg-white/90 dark:bg-gray-800/90 p-1.5 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-text">{place.name}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span>
                          {place.address.province}, {place.address.district}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">฿{place.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">per day</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/30 flex justify-between items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-text">{place.bookings || 0}</span> bookings
                    </div>
                    <Link
                      to={`/place/management/${place._id}/detail`}
                      className="text-sm font-medium text-primary hover:text-secondary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredPlaces.length > 0 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              disabled
              className="px-2 py-1 border border-border rounded text-text disabled:opacity-50"
            >
              Previous
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded">1</button>
            <button className="px-3 py-1 border border-border rounded text-text hover:bg-gray-100 dark:hover:bg-gray-700">
              2
            </button>
            <button className="px-2 py-1 border border-border rounded text-text hover:bg-gray-100 dark:hover:bg-gray-700">
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default PlaceList;