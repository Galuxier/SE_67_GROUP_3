import React from 'react'

function TrainerList() {
    const trainers = [
        {
          image: new URL("../assets/images/trainer2.jpg", import.meta.url).href,
          name: "Bagna tard",
          nickname: "Coach nai",
        },
        {
          image: new URL("../assets/images/trainer5.jpg", import.meta.url).href,
          name: "Dum num",
          nickname: "Coach num",
        },
        {
          image: new URL("../assets/images/trainer13.jpg", import.meta.url).href,
          name: "Daneil Whang",
          nickname: "Coach Deneil",
        },
      ];

      const handleClick = (trainer) => {
        console.log(`Clicked on: ${trainer.nickname} (${trainer.name})`);
      };
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Trainer List</h1>

      <div className="flex flex-wrap justify-center gap-6">
        {trainers.map((trainer, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg w-64 p-4 cursor-pointer hover:shadow-xl transition"
            onClick={() => handleClick(trainer)}
          >
            <img
              src={trainer.image}
              alt={trainer.nickname}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-lg font-semibold text-center">{trainer.name}</h2>
            <p className="text-center text-rose-600">{trainer.nickname}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrainerList;