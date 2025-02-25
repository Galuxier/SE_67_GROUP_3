import React from 'react'
import { useState } from 'react'
import {CameraIcon} from '@heroicons/react/24/solid'
import { MapPinIcon } from '@heroicons/react/24/outline'
import {PaperClipIcon}
const Addgym = () => {
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState('Upload a photo'); // เก็บชื่อไฟล์หรือข้อความเริ่มต้น

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name); // แสดงชื่อไฟล์ที่เลือก
      setFileSelected(true);
    } else {
      setFileName('Upload a photo'); // กลับไปเป็นข้อความเริ่มต้น
      setFileSelected(false);
    }
  };

  return (

    <div className='justify-center items-center flex h-screen'>
      <div className="w-96 p-6 shadow-lg bg-white rounded-md justify-center items-center">
        <h1 className='text-3xl block text-center font-semibold py-2'>Add Gym</h1>
        <hr></hr>
        <div className='mb-4'>
          <label className='py-2'>Name</label>
          <input
            type='text'
            className='w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-pink-500'
            placeholder=''
          />
        </div>

        <div className='mb-4'>
          <label className='py-2'>Detail</label>
          <input
            type='text'
            className='w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-red-500'
            placeholder=''
          />
        </div>

        <div className='mb-4'>
          <label className='py-2'>Contact</label>
          <input 
            type='text'
            className='w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-red-500' 
            placeholder=''
          />
        </div>

        {/* <div className='mb-4'>
          <label className='py-2'>Photo</label>
          <div className="relative w-full">
          <input
          type="file"
          className="w-full border border-gray-300 rounded py-2 px-3 pl-10 focus:outline-none focus:border-red-500"
          onChange={handleFileChange}
          />
          {!fileSelected && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center text-gray-400 pointer-events-none">
            <i className="fas fa-camera mr-2"></i>
            <span>Upload a photo</span>
          </div>
          )}

          <input 
            type="file"
            className='w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-red-500'
            placeholder=''
          />
        </div> */}
        <div className="mb-4">
          <label className="py-2">Photo</label>
          <div className="relative w-full">
            <input
              type="file"
              className="w-full border border-gray-300 rounded py-2 px-3 pl-10 opacity-0 absolute inset-0 cursor-pointer"
              onChange={handleFileChange}
              id="fileInput"
              accept="image/*"
            />
            <label
              htmlFor="fileInput"
              className="w-full border border-gray-300 rounded py-2 px-3 pl-10 flex items-center cursor-pointer bg-white hover:bg-gray-50"
            >
              <CameraIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              />
              <span className="text-gray-500 ml-8 truncate">
                {fileSelected ? fileName : 'Upload a photo'}
              </span>
            </label>
          </div>
        </div>
        

        <div className='mb-4'>
          <label className=''>Facilities</label>
          <input 
            type=""
            className='w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-red-500'
            placeholder=''
          />
        </div>

        <div className='mb-4'>
          <label>location</label>
        </div>
        
        <div>
          <button className='w-full bg-rose-600 border rounded py-2 px-3 focus:outline-none'>
            <label className='text-white'>Add</label>
          </button>
        </div>
        
      </div>
    </div>
  )
}

export default Addgym;