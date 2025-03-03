const UserProfile = () => {
  const user = [
    {
      id: 1,
      first_name: "ใจเป็นนาย",
      last_name: "กายเป็นบ่าว",
      bio: "กว่าจะคมงมตั้งนาน",
      contact_info: "Tel: 09856448513",
      profile_picture_url: new URL(
        "../../assets/images/profile1.webp",
        import.meta.url
      ).href,
    },
  ];
  return (
    <div className="h-screen flex flex-col items-center justify-start pt-10">
        {user.map((user, index) => (
          <div className="flex justify-center items-center">
            <img
              src={user.profile_picture_url}
              className="w-40 h-40 rounded-full object-cover border-2 border-gray-300"
            />
            <h1 className="px-4 mt-4 text-5xl font-bold">
              {user.first_name} {user.last_name}
            </h1>
          </div>
        ))}

      <div className="mt-4 w-1/2">
        
        <div className="w-full h-32 bg-gray-300 rounded-md flex justify-center">
          <p className="text-2xl font-semibold">Detail</p>
        </div>

        <div className="mt-10">
          <p className="text-2xl font-semibold">Fight History</p>
        </div>
      
      </div>

    </div>
  );
};

export default UserProfile;
