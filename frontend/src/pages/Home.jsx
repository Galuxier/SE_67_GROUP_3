import { useEffect, useState } from 'react';
import {api} from '../services/Axios';
import { Link } from "react-router-dom";
import AddressForm from '../components/AddressForm';

function Home() {
  const [data, setDatas] = useState([]); // เก็บข้อมูล gyms เป็นอาร์เรย์

  useEffect(() => {
    api.get('/gyms')
      .then((response) => setDatas(response.data)) // เก็บข้อมูล response.data ใน state
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl">SE_67_GROUP_3 Frontend</h1>
      <Link to="/user/addRole" className="text-blue-500"> Add role </Link>
      <p>Backend says: </p>
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export default Home;