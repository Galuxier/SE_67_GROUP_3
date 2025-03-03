import { useAuth } from "../../context/AuthContext";
import { BsPersonCircle } from "react-icons/bs";

function UserProfile() {
  const { user } = useAuth(); // ดึงข้อมูล user ที่ login อยู่\

  return (
    <main className="flex justify-center min-h-screen pt-10">
      <section className="w-full h-full max-w-3xl bg-white shadow-lg rounded-lg p-8 mx-auto ">
        <div className="flex items-center space-x-6">
          {user.profile?.profile_picture_url ? (
            <img
              alt="Profile"
              src={user.profile.profile_picture_url}
              className="shadow-xl rounded-full h-32 w-32 border-4 border-white"
            />
          ) : (
            <BsPersonCircle className="h-32 w-32 text-gray-400" />
          )}
          <div className="flex-1">
            <h3 className="text-3xl font-semibold text-gray-800">
              {user.first_name} {user.last_name}
            </h3>
            <p className="text-gray-600 mt-1">({user.role})</p>
          </div>

          <div className="contact ml-auto bg-gray-100 px-5 py-3 rounded-lg shadow-md max-w-56">
            <p className="text-gray-700 font-semibold">Contact</p>
            <div className="text-gray-600 text-sm whitespace-pre-line">
              <p>{user.email}</p>
              <p>{user.phone}</p>
              <p>{user.profile?.contact_info}</p>
            </div>
          </div>
        </div>

        {/* ✅ ส่วน Bio */}
        <div className="mt-6 text-left">
          <h4 className="text-xl font-semibold text-gray-800 mb-2">Biography</h4>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {user.bio || "No biography available."}
          </p>
        </div>

      </section>
    </main>
  );
}

export default UserProfile;