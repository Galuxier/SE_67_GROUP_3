import { useState } from 'react';
const App = () => {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'John Doeffff', role: 'Frontend Developer', avatar: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Jane Smith', role: 'Backend Developer', avatar: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Alice Johnson', role: 'UI/UX Designer', avatar: 'https://via.placeholder.com/150' },
  ]);

  const addNewMember = () => {
    const newMember = {
      id: teamMembers.length + 1,
      name: 'New Member',
      role: 'Role',
      avatar: 'https://via.placeholder.com/150',
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-center text-red-700 mb-8">
        Team Members
      </h1>

      <div className="mb-8">
        <button
          onClick={addNewMember}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
        >
          Add New Member
        </button>
      </div>

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center text-center"
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="w-24 h-24 rounded-full mb-4"
              />
              <h2 className="text-2xl font-semibold text-gray-800">{member.name}</h2>
              <p className="text-gray-600 mt-2">{member.role}</p>
              <div className="mt-4 flex space-x-4">
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                  Edit
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;