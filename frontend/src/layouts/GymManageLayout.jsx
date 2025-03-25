import { Outlet } from "react-router-dom";
import GymManageSidebar from "../components/sidebars/GymManageSidebar";
import ManagementNavBar from "../components/navbar/ManagementNavbar";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";
import { getAllGyms, getGymFromId } from "../services/api/GymApi";
import { useAuth } from "../context/AuthContext";

const GymManageLayout = () => {
  const navigate = useNavigate();
  const { gym_id } = useParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [gymData, setGymData] = useState(null);
  const [userGyms, setUserGyms] = useState([]);
  const [error, setError] = useState(null);

  // ตรวจสอบว่าเป็นหน้า add gym หรือไม่
  const isAddGymPage = window.location.pathname.includes("/management/create");

  // ฟังก์ชันดึงข้อมูลยิม
  const fetchGymData = useCallback(async () => {
    if (!user || !user._id) {
      setError("User session not found. Please login again.");
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    try {
      const gymsResponse = await getAllGyms();
      const ownedGyms = gymsResponse.filter((gym) => gym.owner_id === user._id);
      setUserGyms(ownedGyms);

      if (ownedGyms.length === 0 && !isAddGymPage) {
        navigate("/gym/management/create", { replace: true });
        return;
      }

      if (gym_id) {
        const userOwnsGym = ownedGyms.some((gym) => gym._id === gym_id);
        if (!userOwnsGym) {
          setGymData(ownedGyms[0]);
          navigate(`/gym/management/${ownedGyms[0]._id}`, { replace: true });
          toast.error("Access denied. Redirected to your default gym.");
          return;
        }
        const gymResponse = await getGymFromId(gym_id);
        setGymData(gymResponse);
      } else if (!isAddGymPage && ownedGyms.length > 0) {
        setGymData(ownedGyms[0]);
        navigate(`/gym/management/${ownedGyms[0]._id}`, { replace: true });
      }
    } catch (err) {
      console.error("Error fetching gym data:", err);
      setError("Failed to load gym data. Please try again.");
      toast.error("Failed to load gym data.");
    } finally {
      setLoading(false);
    }
  }, [user, gym_id, isAddGymPage, navigate]);

  // เรียก fetchGymData เมื่อโหลดครั้งแรกหรือ gym_id เปลี่ยน
  useEffect(() => {
    fetchGymData();
  }, [fetchGymData]);

  // ฟังก์ชันเปลี่ยนยิม
  const handleSwitchGym = useCallback(
    async (newGymId) => {
      if (newGymId === gymData?._id) return;

      setLoading(true);
      try {
        const gymExists = userGyms.some((gym) => gym._id === newGymId);
        if (!gymExists) {
          throw new Error("Gym not found or access denied.");
        }
        const gymDetails = await getGymFromId(newGymId);
        setGymData(gymDetails);
        navigate(`/gym/management/${newGymId}`, { replace: true });
      } catch (err) {
        console.error("Error switching gym:", err);
        toast.error("Failed to switch gym. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [gymData, userGyms, navigate]
  );

  // แสดง loading
  if (loading) {
    return <LoadingSpinner />;
  }

  // แสดง error ถ้ามี (ยกเว้นหน้า add gym)
  if (error && !isAddGymPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text">
        <div className="text-center p-8 max-w-md">
          <div className="text-5xl text-primary mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">{error}</h2>
          <button
            onClick={() => navigate("/gym")}
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
      <GymManageSidebar
        gymData={gymData}
        userGyms={userGyms}
        onSwitchGym={handleSwitchGym}
      />
      <div className="flex-1 ml-64">
        <ManagementNavBar />
        <div className="p-6 mt-10">
          <Outlet context={{ gymData, userGyms, switchGym: handleSwitchGym }} />
        </div>
      </div>
    </div>
  );
};

export default GymManageLayout;