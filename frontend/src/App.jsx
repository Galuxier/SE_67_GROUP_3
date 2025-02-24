import { useState } from 'react';
import Addgym from './pages/gyms/AddGym';
import Login  from './pages/users/Login';
const App = () => {

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <Addgym/>
    </div>
   
  )
};

export default App;