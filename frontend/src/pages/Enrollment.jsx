import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Enrollment() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [licenseFile, setLicenseFile] = useState(null);
  const [requestDescription, setRequestDescription] = useState("");

  const roles = [
    "Gym Owner",
    "Organizer",
    "Shop Owner",
    "Trainer",
    "Boxer",
    "Lessor"
  ];

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleFileChange = (e) => {
    setLicenseFile(e.target.files[0]);
  };

  const handleDescriptionChange = (e) => {
    setRequestDescription(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!selectedRole || !licenseFile || !requestDescription) {
      alert("Please fill in all fields.");
      return;
    }

    // Create form data to send to the server
    const formData = new FormData();
    formData.append("role", selectedRole);
    formData.append("license", licenseFile);
    formData.append("description", requestDescription);

    // Simulate API call (replace with actual API call)
    console.log("Submitting form data:", {
      role: selectedRole,
      license: licenseFile.name,
      description: requestDescription,
    });

    // Reset form after submission
    setSelectedRole("");
    setLicenseFile(null);
    setRequestDescription("");

    // Navigate to a confirmation page or home
    navigate("/confirmation");
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900 dark:text-white">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Enrollment</h1>
        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Select Role
            </label>
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="" disabled>
                Choose a role
              </option>
              {roles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* License Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Upload License (PDF or Image)
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          {/* Request Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Request Description
            </label>
            <textarea
              value={requestDescription}
              onChange={handleDescriptionChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows="5"
              placeholder="Write your request here..."
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-rose-600 text-white px-6 py-2 rounded-md hover:bg-rose-700 dark:bg-rose-400 dark:hover:bg-rose-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Enrollment;