import { Icon } from "@iconify/react";
import { useState } from "react";
import { useGlobalContext } from "../Components/store/GlobalContext";
import EventlistView from "../Components/EventLlstView";

function SearchEventPage() {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [foundEvents, setFoundEvents] = useState([]);

  const { searchEvents } = useGlobalContext();

  const searchEvent = async () => {
    const eventData = await searchEvents(searchText);
    console.log(eventData);
    setFoundEvents(eventData);
  };
  return (
    <div className="content p-8 pt-0 overflow-auto">
      <div
        className={`w-1/3 p-3 text-sm rounded-full bg-gray-800 px-5 flex text-white space-x-3 items-center ${
          isInputFocused ? "border border-white" : ""
        }`}
      >
        <Icon icon="ic:outline-search" className="text-lg" />
        <input
          type="text"
          placeholder="Search Events"
          className="w-full bg-gray-800 focus:outline-none"
          onFocus={() => {
            setIsInputFocused(true);
          }}
          onBlur={() => {
            setIsInputFocused(false);
          }}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchEvent();
            }
          }}
        />
      </div>
      <div className="content p-8 pt-0 overflow-auto">
        {foundEvents.length > 0 && (
          <EventlistView
            titleText="Matched Events..."
            cardsData={foundEvents}
          />
        )}
        {foundEvents.length <= 0 && (
          <p className="text-gray-400 my-4">No Events Found</p>
        )}
      </div>
    </div>
  );
}

export default SearchEventPage;
