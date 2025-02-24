import React from 'react'
import { useState } from 'react'
import {CameraIcon} from '@heroicons/react/24/solid'
const Addgym = () => {
  const [fileselected, setFileselected] = useState(false);

  const handleFileChange = (e) =>{
    if(e.target.file.length > 0){
      setFileselected(true);
    }else{
      setFileselected(false);
    }
  };

  return (

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
  )
}

export default Addgym;