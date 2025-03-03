import React from "react";
import { Link } from "react-router-dom";

function TrainerList() {
  const trainer = [
    {
      id: 1,
      image_url: new URL("../assets/images/coach1.jpg", import.meta.url).href,
      firstName: "นายเก้า",
      lastName: "เท็นสิบ",
      Nickname: "โค้ชนาย",
      detail: "คนหล่อคนนี้เป็นของคุณนะ",
      contact: "095555555",
      course: "หน่วยรบพิเศษ",
      fightHistory: "win 1 lose 10",
      gym: "Phuket Fight Club",
    },
    {
      id: 2,
      image_url: new URL("../assets/images/coach2.jpg", import.meta.url).href,
      firstName: "นายสิบ",
      lastName: "สิบสาม",
      Nickname: "โค้ชอ้วน",
      detail: "แคนนแค่นแค้นแค๊น",
      contact: "0932111111",
      course: "หน่วยรบพิเศษเสือคาบดอกไม้",
      fightHistory: "win 2 lose 1",
      gym: "Bangkok Fight Club",
    },
    {
      id: 3,
      image_url: new URL("../assets/images/coach3.jpg", import.meta.url).href,
      firstName: "นายสิบเอ็ด",
      lastName: "เจ็ดแปดเก้า",
      Nickname: "โค้ชเก่ง",
      detail: "โคตรโหดโคตรอันตราย",
      contact: "08922222222",
      course: "โคตรโหดกระโดดตบ",
      fightHistory: "win 2 lose 1",
      gym: "BChiang Mai Fight Club",
    },
  ];
  const handleTrainerclick = (trainer) =>{
    alert(`you click on ${trainer.Nickname}`);
  }
  return (
    <div className="flex gap-8">
      {trainer.map((trainer, index) => (
        <button
          key={trainer.id}
          className="flex flex-col items-center"
          onClick={() => handleTrainerclick(trainer)}
        >
          <img
            src={trainer.image_url}
            alt={trainer.Nickname}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
          <p className="mt-2 text-lg font-semibold">{trainer.Nickname}</p>
        </button>
      ))}
    </div>
  );
}

export default TrainerList;