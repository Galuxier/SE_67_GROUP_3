import React from "react";
import { useNavigate } from "react-router-dom";

function Registration({ event }) {
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate(`/event/register/${event._id}`, { state: { event } });
    };

    return (
        <div className="p-4 text-center rounded-lg">
            <h1 className="font-semibold text-4xl">Weight Range</h1>

            {/* weight_classes ใน event นั้น ๆ  */}
            {event?.weight_classes?.length > 0 ? (
                <div className="mt-2 bg-gray-200 dark:bg-gray-600 p-4 shadow-md rounded-lg">
                    {event.weight_classes.map((weight, index) => (
                        <div key={index} className="p-2 border-b last:border-none">
                            <p className="font-bold">{weight.weigh_name}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No weight classes available</p>
            )}

            {/* ✅ ปุ่มสมัคร */}
            <button 
                className="mt-4 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-lg"
                onClick={handleRegisterClick} // /register/:eventId พร้อมส่ง event
            >
                Register Now
            </button>
        </div>
    );
}

export default Registration;
