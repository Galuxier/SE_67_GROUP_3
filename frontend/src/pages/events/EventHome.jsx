import EventCard from "../../components/EventCard";
import { Link } from "react-router-dom";

const EventHome = () => {
    return(
      <div>
        <h1>Welcome to Event Page</h1>
        <Link to="/event/addEvent">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Add Event
          </button>
        </Link>
        <EventCard/>
      </div>
    );
  };
  
  export default EventHome;
  