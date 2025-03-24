export const boxers = [
    {
        id: "60d5ec49f1b2c72d88f8e8b1",
      username: "john_doe",
      password: "password123",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      profile_picture_url: new URL("../../../assets/images/coach1.jpg", import.meta.url).href,
      first_name: "John",
      last_name: "Doe",
      nickname: "Johnny",
      bio: "I love boxing and fitness!",
      licenses: [
        {
          license_type: "boxing",
          license: "12345"
        }
      ],
      gym_id: "60d5ec49f1b2c72d88f8e8b1",
      contact_info: {
        facebook: "john.doe",
        instagram: "@john_doe"
      },
      role: ["member", "boxer"],
      create_at: new Date(),
      updated_at: new Date(),
      status: "active"
    },
    {
        id: "60d5ec49f1b2c72d88f8e8b2",
      username: "jane_smith",
      password: "password456",
      email: "jane.smith@example.com",
      phone: "987-654-3210",
      profile_picture_url: new URL("../../../assets/images/coach2.jpg", import.meta.url).href,
      first_name: "Jane",
      last_name: "Smith",
      nickname: "Janey",
      bio: "Fitness trainer and nutrition enthusiast.",
      licenses: [
        {
          license_type: "fitness",
          license: "67890"
        }
      ],
      gym_id: "60d5ec49f1b2c72d88f8e8b2",
      contact_info: {
        facebook: "jane.smith",
        instagram: "@jane_smith"
      },
      role: ["trainer"],
      create_at: new Date(),
      updated_at: new Date(),
      status: "active"
    },
    {
        id: "60d5ec49f1b2c72d88f8e8b4",
      username: "mike_jones",
      password: "password789",
      email: "mike.jones@example.com",
      phone: "555-555-5555",
      profile_picture_url: new URL("../../../assets/images/coach2.jpg", import.meta.url).href,
      first_name: "Mike",
      last_name: "Jones",
      nickname: "Mikey",
      bio: "Gym owner and fitness coach.",
      licenses: [
        {
          license_type: "gym_owner",
          license: "54321"
        }
      ],
      gym_id: "60d5ec49f1b2c72d88f8e8b3",
      contact_info: {
        facebook: "mike.jones",
        instagram: "@mike_jones"
      },
      role: ["gym_owner", "trainer"],
      create_at: new Date(),
      updated_at: new Date(),
      status: "active"
    },
    {
        id: "60d5ec49f1b2c72d88f8e8b4",
      username: "sara_lee",
      password: "password101",
      email: "sara.lee@example.com",
      phone: "111-222-3333",
      profile_picture_url: new URL("../../../assets/images/coach3.jpg", import.meta.url).href,
      first_name: "Sara",
      last_name: "Lee",
      nickname: "Sari",
      bio: "Organizer of fitness events and competitions.",
      licenses: [
        {
          license_type: "event_organizer",
          license: "11223"
        }
      ],
      gym_id: "60d5ec49f1b2c72d88f8e8b4",
      contact_info: {
        facebook: "sara.lee",
        instagram: "@sara_lee"
      },
      role: ["organizer"],
      create_at: new Date(),
      updated_at: new Date(),
      status: "active"
    }
  ];

  function BoxerList() {
    const handleclick = (boxer) => {
      alert(`you click on ${boxer.first_name}`);
    }
  
    return (
      <div className="flex gap-8">
        {boxers.map((boxer) => (
          <button
            key={boxer.id}
            className="flex flex-col items-center"
            onClick={() => handleclick(boxer)}
          >
            <img
              src={boxer.image_url}
              alt={boxer.first_name}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
            <p className="mt-2 text-lg font-semibold">{boxer.first_name} {boxer.last_name}</p>
          </button>
        ))}
      </div>
    );
  }

  export default BoxerList;