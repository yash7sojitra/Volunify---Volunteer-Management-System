import { useNavigate, useParams } from "react-router-dom";
import Button from "../Components/UI/Button";
import { RxCaretLeft } from "react-icons/rx";
import { useGlobalContext } from "../Components/store/GlobalContext";
import { useEffect, useState } from "react";

function EventDetailPage() {
  const [eventDetails, setEventDetails] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { getSingleEvent, userRole, myEvents, registerEvent } =
    useGlobalContext();

  const fetchEvent = async (id) => {
    try {
      const event = await getSingleEvent(id);
      if (event) {
        setEventDetails(event);
      }

      if (userRole === "volunteer") {
        const registered = myEvents.some((e) => e._id === event._id);

        if (registered) setIsRegistered(true);
      } else if (userRole === "organizer") {
        const editable = myEvents.some((e) => e._id === event._id);

        if (editable) setIsEditable(true);
      }
    } catch (error) {
      console.error("Error fetching event", error);
    }
  };

  useEffect(() => {
    fetchEvent(id);
  }, []);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "UTC",
  };

  const handleRegistration = async () => {
    const data = await registerEvent(id);
    console.log(data);
    if (data.message != null) {
      fetchEvent(id);
      setIsRegistered(true);
      alert("Thank You for Registering for the Event");
    }
  };

  return (
    <div className="flex flex-col items-start space-x-4 p-8">
      <div className="hidden md:flex gap-x-2 items-center mb-4">
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="
              rounded-full 
              bg-black 
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-75 
              transition
            "
        >
          <RxCaretLeft className="text-white" size={35} />
        </button>
      </div>
      <div className="text-white text-3xl font-semibold ">
        Event Details
        <div className="space-y-6 text-xl ">
          <div className="mt-8">
            <h1>Event Name</h1>
            <p className="text-lg font-medium opacity-70">
              {eventDetails.name}
            </p>

            <div className="mt-8">
              <h2>Description</h2>
              <p className="text-lg font-medium opacity-70">
                {eventDetails.description}
              </p>
            </div>

            <div className="mt-4">
              <h2>Location</h2>
              <p className="text-lg font-medium opacity-70">
                {eventDetails.location}
              </p>
            </div>

            <div className="mt-4">
              <h2>Event Date</h2>
              <p className="text-lg font-medium opacity-70">
                {new Date(eventDetails.eventDate).toLocaleString(
                  "en-US",
                  options
                )}
              </p>
            </div>

            <div className="mt-4">
              <h2>Due Date</h2>
              <p className="text-lg font-medium opacity-70">
                {new Date(eventDetails.dueDate).toLocaleString(
                  "en-US",
                  options
                )}
              </p>
            </div>

            {/* <div className="mt-4">
              <h2>Created By</h2>
              <p className="text-lg font-medium opacity-70"></p>
            </div> */}
            {userRole === "organizer" && isEditable && (
              <div className="mt-4 w-36 flex space-x-3">
                <Button
                  className="bg-white px-6 py-2 mb-3 w-full"
                  onClick={() => {
                    navigate(`/event-update/${id}`);
                  }}
                >
                  Edit
                </Button>
                <Button className="bg-white px-6 py-2 mb-3 w-full">
                  Delete
                </Button>
              </div>
            )}
            {userRole === "volunteer" && isRegistered && (
              <div className="mt-4 w-36 flex space-x-3">
                <Button className="bg-white px-6 py-2 mb-3 w-full">
                  Registered
                </Button>
              </div>
            )}
            {userRole === "volunteer" && !isRegistered && (
              <div className="mt-4 w-36 flex space-x-3">
                <Button
                  onClick={handleRegistration}
                  className="bg-white px-6 py-2 mb-3 w-full"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;
