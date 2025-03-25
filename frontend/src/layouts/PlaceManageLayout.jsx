import { Outlet } from "react-router-dom";
import PlaceManageSidebar from "../components/sidebars/PlaceManageSidebar";
import AdminNavbar from "../components/navbar/ManagementNavbar";

const PlaceManageLayout = () => {
  return (
    <div className="min-h-screen flex bg-background text-text">
      {/* Sidebar */}
      <PlaceManageSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <div className="p-4 mt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PlaceManageLayout;

// import { Outlet } from "react-router-dom";
// import PlaceManageSidebar from "../components/sidebars/PlaceManageSidebar";
// import AdminNavbar from "../components/navbar/ManagementNavbar";
// import { useState, useEffect, useCallback } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import LoadingSpinner from "../components/LoadingSpinner";
// import { toast } from "react-toastify";
// import { getAllPlaces, getPlaceById } from "../services/api/PlaceApi"; // สมมติว่ามี API เหล่านี้
// import { useAuth } from "../context/AuthContext";

// const PlaceManageLayout = () => {
//   const navigate = useNavigate();
//   const { placeId } = useParams();
//   const { user } = useAuth();

//   const [loading, setLoading] = useState(false);
//   const [placeData, setPlaceData] = useState(null);
//   const [userPlaces, setUserPlaces] = useState([]);
//   const [error, setError] = useState(null);

//   const isAddPlacePage = window.location.pathname === "/place/management/create";

//   // Fetch place data
//   const fetchPlaceData = useCallback(async () => {
//     if (!user || !user._id) {
//       setError("User session not found. Please login again.");
//       navigate("/login", { replace: true });
//       return;
//     }

//     setLoading(true);
//     try {
//       const placesResponse = await getAllPlaces();
//       const ownedPlaces = placesResponse.filter((place) => place.owner_id === user._id);
//       setUserPlaces(ownedPlaces);

//       if (ownedPlaces.length === 0 && !isAddPlacePage) {
//         navigate("/place/management/create", { replace: true });
//         return;
//       }

//       if (placeId) {
//         const userOwnsPlace = ownedPlaces.some((place) => place._id === placeId);
//         if (!userOwnsPlace) {
//           setPlaceData(ownedPlaces[0]);
//           navigate(`/place/management/${ownedPlaces[0]._id}`, { replace: true });
//           toast.error("Access denied. Redirected to your default place.");
//           return;
//         }
//         const placeResponse = await getPlaceById(placeId);
//         setPlaceData(placeResponse);
//       } else if (!isAddPlacePage && ownedPlaces.length > 0) {
//         setPlaceData(ownedPlaces[0]);
//         navigate(`/place/management/${ownedPlaces[0]._id}`, { replace: true });
//       }
//     } catch (err) {
//       console.error("Error fetching place data:", err);
//       setError("Failed to load place data. Please try again.");
//       toast.error("Failed to load place data.");
//     } finally {
//       setLoading(false);
//     }
//   }, [user, isAddPlacePage, navigate]);

//   // Initial fetch
//   useEffect(() => {
//     if (!placeData && !isAddPlacePage) {
//       fetchPlaceData();
//     }
//   }, [fetchPlaceData, placeData, isAddPlacePage]);

//   // Switch place
//   const handleSwitchPlace = useCallback(
//     async (newPlaceId) => {
//       if (newPlaceId === placeData?._id) return;

//       setLoading(true);
//       try {
//         const placeExists = userPlaces.some((place) => place._id === newPlaceId);
//         if (!placeExists) {
//           throw new Error("Place not found or access denied.");
//         }
//         const placeDetails = await getPlaceById(newPlaceId);
//         setPlaceData(placeDetails);
//         navigate(`/place/management/${newPlaceId}`, { replace: true });
//       } catch (err) {
//         console.error("Error switching place:", err);
//         toast.error("Failed to switch place. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [placeData, userPlaces, navigate]
//   );

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (error && !isAddPlacePage) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background text-text">
//         <div className="text-center p-8 max-w-md">
//           <div className="text-5xl text-primary mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold mb-4">{error}</h2>
//           <button
//             onClick={() => navigate("/place")}
//             className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors mt-4"
//           >
//             Back to Places
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex bg-background text-text">
//       {!isAddPlacePage && (
//         <PlaceManageSidebar
//           placeData={placeData}
//           userPlaces={userPlaces}
//           onSwitchPlace={handleSwitchPlace}
//         />
//       )}
//       <div className={`flex-1 ${!isAddPlacePage ? "ml-64" : ""}`}>
//         {!isAddPlacePage && <AdminNavbar />}
//         <div className={`p-4 ${!isAddPlacePage ? "mt-16" : ""}`}>
//           <Outlet context={{ placeData, userPlaces, switchPlace: handleSwitchPlace }} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlaceManageLayout;