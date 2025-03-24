import React, { useState } from "react";

function BoxerList() {
  // const [boxer,setBoxer] = useState({
  //     profile_picture_url:null,
  //     first_name:"",
  //     last_name:"",
  //     nickname:""
  // })

  const boxers = [
    {
      image: new URL("../assets/images/boxer9.jpg", import.meta.url).href,
      name: "nakarach thupbok",
      nickname: "NakaPhonFire",
    },
    {
      image: new URL("../assets/images/boxer10.jpg", import.meta.url).href,
      name: "Pach Dum",
      nickname: "YingYai",
    },
    {
      image: new URL("../assets/images/boxer11.jpg", import.meta.url).href,
      name: "Diamond Jab",
      nickname: "YaiYing",
    },
  ];

  const handleClick = (boxer) => {
    console.log(`Clicked on: ${boxer.nickname} (${boxer.name})`);
  };
  return(
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Boxer List</h1>

      <div className="flex flex-wrap justify-center gap-6">
        {boxers.map((boxer, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg w-64 p-4 cursor-pointer hover:shadow-xl transition"
            onClick={() => handleClick(boxer)}
          >
            <img
              src={boxer.image}
              alt={boxer.nickname}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-lg font-semibold text-center">{boxer.name}</h2>
            <p className="text-center text-rose-600">{boxer.nickname}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoxerList;
