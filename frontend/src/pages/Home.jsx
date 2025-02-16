import React, { useEffect, useState } from 'react';
import { api } from '../services/axios';

function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/accounts')
      .then((response) => setMessage(JSON.stringify(response.data, null, 2)))
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">SE_67_GROUP_3 Frontend</h1>
      <p>Backend says: </p>
      <pre>{message}</pre>
    </div>
  );
}

export default Home;
