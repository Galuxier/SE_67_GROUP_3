import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { getGymFromId } from "../../services/api/GymApi";
import { getImage } from "../../services/api/ImageApi";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import EditGymModal from "../../components/gyms/EditGymModal";

const GymDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [gym, setGym] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const fetchGym = async () => {
      try {
        const response = await getGymFromId(id);
        setGym(response);

        // ดึง URL ของรูปภาพทั้งหมด
        const urls = await Promise.all(
          response.gym_image_url.map(async (imageUrl) => {
            return await getImage(imageUrl);
          })
        );
        setImageUrls(urls);
      } catch (error) {
        console.error("Error fetching gym profile:", error);
      }
    };
    fetchGym();
  }, [id]);
  
  if (!gym) return <div>Loading...</div>;

  const handleSave = (updatedGym) => {
    setGym(updatedGym);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ส่วนของรูปภาพและปุ่ม Back */}
      <div className="relative w-full pt-8">
        {/* ปุ่ม Back แบบ minimal
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 z-10 flex items-center text-white bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 transition-all"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button> */}

        {/* รูปภาพแบบ Swiper */}
        <div className="w-full max-w-4xl mx-auto px-4">
          {imageUrls.length > 0 && (
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px]">
              <Swiper
                spaceBetween={0}
                modules={[Navigation, Pagination]}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                  enabled: window.innerWidth >= 768, // Enable navigation only on desktop
                }}
                pagination={{
                  el: '.swiper-pagination',
                  clickable: true,
                  // สร้างตัวเลขหน้า/ทั้งหมด เมื่อมีรูปเกิน 8 รูป
                  type: imageUrls.length > 8 ? 'fraction' : 'bullets',
                  dynamicBullets: imageUrls.length > 8,
                }}
                className="h-full rounded-lg overflow-hidden"
              >
                {imageUrls.map((imageUrl, index) => (
                  <SwiperSlide key={index}>
                    <div className="flex items-center justify-center h-full bg-backgrounds">
                      <img
                        src={imageUrl}
                        alt={`Gym Image ${index + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* ปุ่มเลื่อนถัดไปแบบ minimal - ซ่อนบนมือถือ */}
              <div className="swiper-button-prev !hidden md:!flex absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-10 hover:bg-opacity-30 text-white p-1 rounded-r cursor-pointer opacity-30 hover:opacity-80 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </div>
              <div className="swiper-button-next !hidden md:!flex absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-10 hover:bg-opacity-30 text-white p-1 rounded-l cursor-pointer opacity-30 hover:opacity-80 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
              
              {/* จุดไข่ปลาสำหรับเลื่อนรูป */}
              <div className="swiper-pagination flex justify-center mt-2"></div>
            </div>
          )}
        </div>
      </div>

      {/* ส่วนข้อมูล Gym */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-card p-4 md:p-6 rounded-lg">
          {/* แบ่งเป็นฝั่งซ้ายและขวา - ปรับให้ responsive */}
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            {/* ฝั่งซ้าย: ชื่อและที่อยู่ */}
            <div>
              {/* ชื่อโรงยิม */}
              <p className="font-bold text-2xl md:text-3xl text-text">{gym.gym_name}</p>

              {/* ที่อยู่ */}
              <div className="flex items-center mt-2">
                <FaMapMarkerAlt className="w-5 h-5 md:w-6 md:h-6 text-text" />
                <p className="px-2 md:px-4 text-lg md:text-2xl font-semibold text-text">
                  {gym.address.district}, {gym.address.province}
                </p>
              </div>
            </div>

            {/* ฝั่งขวา: Contact และปุ่ม Edit */}
            <div className="flex items-start gap-4">
              {/* Contact */}
              <div className="bg-secondary p-3 md:p-4 rounded-lg">
                <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2 text-text">Contact</h3>
                {Object.entries(gym.contact || {}).map(
                  ([key, value]) =>
                    value && (
                      <p key={key} className="text-sm md:text-base text-text">
                        <span className="capitalize">{key}:</span> {value}
                      </p>
                    )
                )}
              </div>

              {/* ปุ่ม Edit */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 text-text rounded-md"
              >
                <PencilSquareIcon className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </div>
          </div>

          {/* About Us */}
          <div className="mt-4">
            <p className="text-xl md:text-2xl font-semibold text-text">About Us</p>
            <div className="w-full h-24 md:h-32 bg-bar rounded-md p-3 md:p-4 mt-2 text-text overflow-y-auto">
              {gym.description}
            </div>
          </div>

          {/* Trainer */}
          <div className="mt-4">
            <p className="text-xl md:text-2xl font-semibold text-text">Trainer</p>
            <div className="mt-2">
              {/* <TrainerList /> */}
            </div>
          </div>
        </div>
      </div>

      {/* Modal สำหรับแก้ไข */}
      {isModalOpen && (
        <EditGymModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          gymData={gym}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default GymDetail;