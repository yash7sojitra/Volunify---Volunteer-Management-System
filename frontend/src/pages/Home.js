import { useEffect } from "react";
import EventlistView from "../Components/EventLlstView";
import { useGlobalContext } from "../Components/store/GlobalContext";

function HomePage() {
  const { getUpcomingEvents, upcomingEvents } = useGlobalContext();

  useEffect(() => {
    getUpcomingEvents();
  }, []);

  return (
    <div className="content p-8 pt-0 overflow-auto">
      <EventlistView titleText="Upcoming Events" cardsData={upcomingEvents} />
      {/* <EventlistView titleText="Top Events" /> */}
    </div>
  );
}

export default HomePage;
