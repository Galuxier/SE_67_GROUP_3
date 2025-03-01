import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddRole() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("gym_owner");
  const [formData, setFormData] = useState({
    full_name: "",
    nickname: "",
    gym_id: "",
    bio: "",
    contact_info: "",
    affiliated_boxer: "",
    alias: "",
    profile_picture_url: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profile_picture_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/users/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole, ...formData }),
      });
      if (response.ok) {
        alert("Role added successfully!");
        navigate("/");
      } else {
        console.error("Failed to add role");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center p-4">
      <div className="bg-white p-6 shadow-lg rounded-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Add Role</h2>

        <div className="mb-4 flex gap-4">
          {["gym_owner", "organizer", "trainer", "boxer"].map((role) => (
            <label key={role} className="flex items-center">
              <input
                type="radio"
                name="role"
                value={role}
                checked={selectedRole === role}
                onChange={() => setSelectedRole(role)}
              />
              <span className="ml-2">{role.replace("_", " ").toUpperCase()}</span>
            </label>
          ))}
        </div>

        {["gym_owner", "organizer"].includes(selectedRole) && (
          <>
            <label className="block mb-1">Name</label>
            <input type="text" name="first_name" className="border p-2 w-full mb-4" onChange={handleChange} />

            <label className="block mb-1">Description</label>
            <textarea name="bio" className="border p-2 w-full mb-4" onChange={handleChange}></textarea>

            <label className="block mb-1">Contact Info</label>
            <input type="text" name="contact_info" className="border p-2 w-full mb-4" onChange={handleChange} />

            <label className="block font-semibold">Related Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4 p-2 w-full border" />
          </>
        )}

        {selectedRole === "trainer" && (
          <>
            <label className="block mb-1">Full Name</label>
            <input type="text" name="first_name" className="border p-2 w-full mb-4" onChange={handleChange} />

            <label className="block mb-1">Nickname</label>
            <input type="text" name="nickname" className="border p-2 w-full mb-4" onChange={handleChange} />

            <label className="block mb-1">Bio</label>
            <textarea name="bio" className="border p-2 w-full mb-4" onChange={handleChange}></textarea>

            <label className="block mb-1">Contact Info</label>
            <input type="text" name="contact_info" className="border p-2 w-full mb-4" onChange={handleChange} />

            <label className="block font-semibold">Profile Picture</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4 p-2 w-full border" />
          </>
        )}

        {selectedRole === "boxer" && (
          <>
            <label className="block mb-1">Full Name</label>
            <input type="text" name="first_name" className="border p-2 w-full mb-4" onChange={handleChange} />

            <label className="block mb-1">Alias</label>
            <input type="text" name="alias" className="border p-2 w-full mb-4" onChange={handleChange} />

            <label className="block mb-1">Gym</label>
            <input type="text" name="gym_id" className="border p-2 w-full mb-4" onChange={handleChange} />

            <label className="block mb-1">Affiliated Boxer</label>
            <input type="text" name="affiliated_boxer" className="border p-2 w-full mb-4" onChange={handleChange} />

            <label className="block mb-1">Contact Info</label>
            <input type="text" name="contact_info" className="border p-2 w-full mb-4" onChange={handleChange} />

            <label className="block font-semibold">Related Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4 p-2 w-full border" />
          </>
        )}

        <button onClick={handleSubmit} className="w-full bg-pink-500 text-white py-2 rounded-lg">Submit</button>
      </div>
    </div>
  );
}