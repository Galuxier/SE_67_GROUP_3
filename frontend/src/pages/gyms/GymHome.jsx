import { Link } from "react-router-dom";
import { PlusCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import GymList from "../../components/Gyms";
function GymHome() {

  const [province,setProvince] = useState('Province');
  const [isOpen,setIsOpen] = useState(false);

  const provinces = ['กรุงเทพ', 'ราชรี'];
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6">All Gym</h1>
      <div className="gap-6 flex items-center ">
        {/* กล่องทางด้านซ๊าย */}
        <div className="w-1/4 justify-center">
          <h2 className="text-4xl font-semibold mb-4 text-center">Filter</h2>
          {/* จังหวัด */}
          <div className="mb-4 justify-center relative py-10">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="w-full rounded py-2 px-3 justify-center flex items-center"
            >
              <span className="text-gray-500 text-3xl">{province}</span>
              <ChevronDownIcon
                onClick={() => setIsOpen(!isOpen)} 
                className="h-10 w-10 cursor-pointer absolute right-2" 
              />
            </button>
            {isOpen && (
              <div className="wabsolute w-full mt-1 bg-white border border-gray-300 rounded shadow-md max-h-60 overflow-y-auto z-10">
                {provinces.map((provinceName, index) => (
                  <button 
                    key={index}
                    onClick={() => {
                      setProvince(provinceName);
                      setIsOpen(false);
                    }}                    
                    className="w-full rounded py-2 px-3 justify-center flex items-center"
                  >
                    {provinceName}
                  </button>
                ))}
              </div>
            )}
            <hr />
          </div>
          {/* สิ่งอำนวยความจะดวก */}
          <div className="mb-4 justify-center relative py-10">
            <button className="w-full rounded py-2 px-3 justify-center flex items-center">
              <span className="text-gray-500 text-3xl">Facilities</span>
              <ChevronDownIcon className="h-10 w-10 cursor-pointer absolute right-2" />
            </button>
            <hr />
          </div>
          {/* สำหรับ Addgym */}
          <div className="justify-center flex items-center">
            <Link to="/gym/addgym">
              {/* <PlusCircleIcon className="h-10 w-10"/> */}
              <button className="px-4 py-2 text-black rounded-md">
                <PlusCircleIcon className="h-10 w-10" />
              </button>
            </Link>
          </div>
        </div>
        {/* กล่องทางด้านขวา */}
        <div className="w-3/4">
          <p className="mt-4">List of gyms will be shown here...</p>
        </div>
      {/* เนื้อหาอื่น ๆ */}
      <GymList/>
    </div>
  </div>
  );
}

export default GymHome;
