import { useEffect, useState } from 'react';
import {api} from '../services/Axios';
import { Link } from "react-router-dom";

function Home() {
  const [gyms, setGyms] = useState([]); // เก็บข้อมูล gyms เป็นอาร์เรย์

  useEffect(() => {
    api.get('/gyms')
      .then((response) => setGyms(response.data)) // เก็บข้อมูล response.data ใน state
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl">SE_67_GROUP_3 Frontend</h1>
      <Link to="/signup" className="text-blue-500"> Register </Link>
      <Link to="/user/addRole" className="text-blue-500"> Add role </Link>
      <p>Backend says: </p>
      <pre>
        {JSON.stringify(
          {
            _id: gyms[0]?._id,
            owner_id: gyms[0]?.owner_id,
            gym_name: gyms[0]?.gym_name,
            description: gyms[0]?.description,
            contact: gyms[0]?.contact,
            address: gyms[0]?.address,
            facilities: gyms[0]?.facilities,
            courses: gyms[0]?.courses,
            __v: gyms[0]?.__v,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}

export default Home;