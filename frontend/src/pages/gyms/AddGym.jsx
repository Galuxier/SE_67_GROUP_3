import React from "react";
import { useState, useRef, useEffect } from "react";
import { CameraIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { PaperClipIcon } from "@heroicons/react/24/solid";
const Addgym = () => {
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState(''); // เก็บชื่อไฟล์หรือว่าง

  const fileInputRef = useRef(null); // ใช้ useRef เพื่อควบคุม <input type="file">

  const handleIconClick = () => {
    fileInputRef.current.click(); // ส่งคำสั่งคลิกไปยัง <input type="file"> เมื่อคลิกไอคอน
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name); // แสดงชื่อไฟล์ที่เลือก
      setFileSelected(true);
    } else {
      setFileName(''); // ล้างชื่อไฟล์เมื่อไม่มีไฟล์
      setFileSelected(false);
    }
  };

  return (
    <div className="justify-center items-center flex h-screen">
      <div className="w-96 p-6 shadow-lg bg-white rounded-md justify-center items-center">
        <h1 className="text-3xl block text-center font-semibold py-2">
          Add Gym
        </h1>
        <hr></hr>

        
        <div className="mb-4">
          <label className="py-2">Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-pink-500"
            placeholder=""
          />
        </div>

        
        <div className="mb-4">
          <label className="py-2">Detail</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-red-500"
            placeholder=""
          />
        </div>

        
        <div className="mb-4">
          <label className="py-2">Contact</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-red-500"
            placeholder=""
          />
        </div>

        <div className="mb-4">
          <label className="py-2">Photo</label>
          <div className="relative w-full">
            <input
              type="file"
              ref={fileInputRef} // อ้างอิง <input> ด้วย useRef
              className="hidden" // ซ่อน input อย่างสมบูรณ์ด้วย class "hidden"
              onChange={handleFileChange}
              id="fileInput"
              accept="image/*"  
            />
            <button
              className="w-full border border-gray-300 rounded py-2 px-3 flex items-center justify-between cursor-default"
            >
              <span className="text-gray-500 truncate pointer-events-none">
                {fileSelected ? fileName : ''} 
              </span>
              <PaperClipIcon
                onClick={handleIconClick} //คลิ๊กเฉพาะที่ icon ถึงจะเพิ่มรูปภาพได้
                className="h-5 w-5 text-gray-400 cursor-pointer" // ปรับขนาดและสีของไอคอน
              />
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="">Facilities</label>
          {/* <Link to = ''>
            <div className="items-center justify-center flex">
              <button className='px-4 py-2 text-black'>
                  <PlusCircleIcon className='h-10 w-10'/>
              </button>
            </div>
          </Link> */}
          <div className="flex justify-center items-center">
            <button className="px-4 py-2 text-black">
              <PlusCircleIcon className="h-6 w-6"/>
            </button>
          </div>
        </div>

        
        <div className="mb-4">
          <label>location</label>
        </div>

        <div>
          <button className="w-full bg-rose-600 border rounded py-2 px-3 focus:outline-none">
            <label className="text-white">Add</label>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Addgym;
