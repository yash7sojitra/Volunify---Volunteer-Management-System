import { useEffect } from "react";
import EventlistView from "../Components/EventLlstView";
import { useGlobalContext } from "../Components/store/GlobalContext";

function MyEventsPage() {
  const { userRole, getAllEvents, getRegisteredEvents, myEvents } =
    useGlobalContext();

  useEffect(() => {
    const fetchEvents = async () => {
      if (userRole === "organizer") {
        await getAllEvents();
      } else if (userRole === "volunteer") {
        await getRegisteredEvents();
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      <div className="content p-8 pt-0 overflow-auto">
        <EventlistView titleText="My Events" cardsData={myEvents} />
        {/* <EventlistView titleText="Top Events" /> */}
      </div>
    </>
  );
}

export default MyEventsPage;
