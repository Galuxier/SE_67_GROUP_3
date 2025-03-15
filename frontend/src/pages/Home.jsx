import { useEffect, useState } from 'react';
import { api } from '../services/Axios';
import { Link } from "react-router-dom";
import AddressForm from '../components/AddressForm';
import ShopCard from '../components/ShopCard';
import { useTheme } from '../context/ThemeContext'; // นำเข้า useTheme

function Home() {
  const [data, setDatas] = useState([]); // เก็บข้อมูล shops เป็นอาร์เรย์
  const { isDarkMode } = useTheme(); // ดึงสถานะ Dark Mode

  useEffect(() => {
    api.get('/shops')
      .then((response) => setDatas(response.data)) // เก็บข้อมูล response.data ใน state
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div className={`p-4 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
      <h2 className="text-xl mt-6 font-bold text-center">Shops</h2> {/* ปรับให้ตัวเข้มและอยู่ตรงกลาง */}
      <div className="mt-4 overflow-x-auto"> {/* เพิ่มแถบเลื่อนแนวนอน */}
        <div className="flex gap-4 pb-4"> {/* เรียง ShopCard แนวนอน */}
          <ShopCard shops={data} />
        </div>
        <Link to="/admin/dashboard">Dashboard</Link>
      </div>
    </div>
  );
}

export default Home;