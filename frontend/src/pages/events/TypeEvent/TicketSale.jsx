import React from "react";
import { useNavigate } from "react-router-dom";
function TicketSale({ event }) {
  
  return (
    <div className="p-4 text-center rounded-lg">
      <h1 className="font-semibold text-4xl">Ticket Price</h1>

      {/* ✅ แสดง weight_classes */}
      {/* {event?.weight_classes?.length > 0 ? (
        <div className="mt-2 bg-gray-200 dark:bg-gray-600 p-4 shadow-md rounded-lg">
          {event.weight_classes.map((weight, index) => (
            <div key={index} className="p-2 border-b last:border-none">
              <p className="font-bold">{weight.weigh_name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No Seat available</p>
      )} */}

      {/* ✅ ปุ่มสมัคร */}
      <button
        className="mt-4 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-lg"
        //onClick={handleRegisterClick} // ✅ ไปยัง /register/:eventId พร้อมส่ง event
      >
        Buy Now
      </button>
    </div>
  );
}

export default TicketSale;
