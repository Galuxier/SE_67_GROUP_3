import { Outlet } from "react-router-dom";
import GymManageSidebar from "../components/sidebars/GymManageSidebar";
import ManagementNavBar from "../components/navbar/ManagementNavbar";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";
import { getAllGyms, getGymFromId } from "../services/api/GymApi";
import { useAuth } from "../context/AuthContext";

const GymManageLayout = () => {
  const navigate = useNavigate();
  const { gym_id } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [gymData, setGymData] = useState(null);
  const [userGyms, setUserGyms] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Check if we're on the add gym page
  const isAddGymPage = location.pathname.includes('/management/create');

  // Fetch user's gyms and current gym data
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user._id) {
        setError("User session not found. Please login again.");
        navigate("/login", { state: { from: location.pathname } });
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch all gyms owned by the current user
        console.log("Fetching gyms for user:", user._id);
        const gymsResponse = await getAllGyms();
        
        // Filter gyms for the current user
        const userOwnedGyms = gymsResponse.filter(gym => gym.owner_id === user._id);
        setUserGyms(userOwnedGyms);
        
        console.log("Found gyms:", userOwnedGyms.length, userOwnedGyms);
        
        if (userOwnedGyms.length > 0) {
          // If id is provided in URL, fetch that specific gym
          if (gym_id) {
            try {
              // Verify the gym belongs to this user
              const userOwnsGym = userOwnedGyms.some(gym => gym._id === gym_id);
              
              if (!userOwnsGym) {
                throw new Error("You don't have access to this gym");
              }
              
              const gymResponse = await getGymFromId(gym_id);
              setGymData(gymResponse);
            } catch (gymError) {
              console.error("Error fetching specific gym:", gymError);
              // If specific gym fetch fails, default to first gym
              setGymData(userOwnedGyms[0]);
              navigate(`/gym/management/${userOwnedGyms[0]._id}`, { replace: true });
              toast.error("Couldn't access the requested gym. Redirected to your default gym.");
            }
          } else if (!isAddGymPage) {
            // If no gym specified and not on addGym page, use first gym
            setGymData(userOwnedGyms[0]);
            navigate(`/gym/management/${userOwnedGyms[0]._id}`, { replace: true });
          }
        } else if (!isAddGymPage) {
          // No gyms found and not on addGym page, redirect to gym creation
          setError("You don't have any gyms yet. Create your first gym to continue.");
          navigate("/gym/management/create");
        }
      } catch (error) {
        console.error("Error fetching gym data:", error);
        setError("Failed to load your gyms. Please try again later.");
        toast.error("Failed to load gym data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, gym_id, isAddGymPage, user, location.pathname]);

  // Handle gym switching - this function can be passed down to child components if needed
  const switchGym = async (newGymId) => {
    if (newGymId === gymData?._id) return; // Skip if same gym
    
    try {
      setLoading(true);
      
      // Check if gym exists in userGyms
      const gymExists = userGyms.some(gym => gym._id === newGymId);
      
      if (!gymExists) {
        throw new Error("Gym not found or you don't have access");
      }
      
      const gymDetails = await getGymFromId(newGymId);
      setGymData(gymDetails);
      navigate(`/gym/management/${newGymId}`);
      
    } catch (error) {
      console.error("Error switching gyms:", error);
      toast.error("Failed to switch gyms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Special case: When on addGym page with no gyms, still render the layout without error
  if (error && !isAddGymPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text">
        <div className="text-center p-8 max-w-md">
          <div className="text-5xl text-primary mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">{error}</h2>
          <button 
            onClick={() => navigate('/gym')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors mt-4"
          >
            Back to Gyms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-text">
      {/* Sidebar with gym switcher functionality */}
      <GymManageSidebar 
        gymData={gymData}
        userGyms={userGyms}
        onSwitchGym={switchGym}
      />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <ManagementNavBar />

        {/* Page Content */}
        <div className="p-6 mt-10">
          <Outlet context={{ gymData, userGyms, switchGym }} />
        </div>
      </div>
    </div>
  );
};

export default GymManageLayout;