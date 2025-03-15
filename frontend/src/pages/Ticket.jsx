import React from "react";
import { LucideArmchair, LucideClock, LucideMapPin } from "lucide-react";

const Ticket = () => {
  const eventData = {
    eventName: "Muaythai Championship",
    eventDate: "Saturday, 30 December 2023",
    location: "Bangkok Fight Stadium",
    time: "7:00 PM - 10:00 PM",
    seatType: "VIP",
    ticketNumber: "#123456789",
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Ticket Card */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg mx-auto transition transform hover:scale-105 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-red-600 p-6 rounded-t-2xl">
          <h1 className="text-3xl font-bold text-white">
            {eventData.eventName}
          </h1>
          <p className="text-sm text-purple-200">{eventData.eventDate}</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Event Details */}
          <div className="space-y-4">
            {/* Location */}
            <div className="flex items-center">
              <LucideMapPin className="h-6 w-6 text-gray-600" />
              <p className="ml-3 text-lg text-gray-700">{eventData.location}</p>
            </div>

            {/* Time */}
            <div className="flex items-center">
              <LucideClock className="h-6 w-6 text-gray-600" />
              <p className="ml-3 text-lg text-gray-700">{eventData.time}</p>
            </div>

            {/* Seat Type */}
            <div className="flex items-center">
              <LucideArmchair className="h-6 w-6 text-gray-600" />
              <p className="ml-3 text-lg text-gray-700">{eventData.seatType}</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="mt-6 flex justify-center">
            <div className="bg-gray-200 w-48 h-48 flex items-center justify-center rounded-lg">
              <span className="text-gray-500">QR Code</span>
            </div>
            {/* <QRCode value={eventData.ticketNumber} size={180} className="rounded-lg shadow-lg"/> */}
          </div>

          {/* Ticket Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Ticket Number</p>
            <p className="text-xl font-bold text-gray-800">
              {eventData.ticketNumber}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-4 text-center rounded-b-2xl">
          <p className="text-sm text-gray-500">
            Present this ticket at the entrance. No refunds or exchanges.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
