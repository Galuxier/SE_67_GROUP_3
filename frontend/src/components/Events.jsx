function EventList() {
    const events = [
        { id: 1, 
            image_url: new URL("../assets/images/muaythai-001.jpg", import.meta.url).href, 
            event_name: "Muaythai",
            level:"Rookie",
            start_date: "2024-02-27",
            end_date: "2024-03-07",
        },
        { id: 2, 
            image_url: new URL("../assets/images/muaythai-002.jpg", import.meta.url).href, 
            event_name: "Muaythai", 
            level:"Fighter",
            start_date: "2024-02-27",
            end_date: "2024-03-07",
        },
        { id: 3, 
            image_url: new URL("../assets/images/muaythai-003.png", import.meta.url).href, 
            event_name: "Muaythai", 
            start_date: "2024-02-27",
            end_date: "2024-03-07",
        }
    ];

    // ฟังก์ชันกำหนดสีตาม level
    const getLevelColor = (level) => {
        switch(level) {
            case "Rookie": return "text-green-500";
            case "Fighter": return "text-red-500";
            default: return "text-gray-700";
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
                <div key={event.id} className="max-w-xs rounded overflow-hidden shadow-lg">
                    <img className="w-full aspect-[4/3] object-cover" src={event.image_url} alt={event.event_name} />
                    <div className="px-6 py-4">
                        <div className="font-semibold text-xl mb-2">{event.event_name}</div>
                        <div className={`font-normal ${getLevelColor(event.level)}`}>{event.level}</div>
                        <div className="flex items-center font-base text-lg mb-2">
                            <span className="mr-2">{formatDate(event.start_date)}</span>
                            <span className="mr-2">-</span>
                            <span className="mr-2">{formatDate(event.end_date)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default EventList;
