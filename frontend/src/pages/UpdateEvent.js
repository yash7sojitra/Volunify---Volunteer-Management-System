import { useEffect, useState } from "react";
import EventlistView from "../Components/EventLlstView";
import TextInput, { DateInput } from "../Components/TextInput";
import { useGlobalContext } from "../Components/store/GlobalContext";
import { useNavigate, useParams } from "react-router-dom";

function UpdateEventPage(props) {
  const currentDate = new Date().toISOString().slice(0, 10);
  const { id } = useParams();

  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState(currentDate);
  const [dueDate, setDueDate] = useState(currentDate);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { updateEvent, getSingleEvent } = useGlobalContext();

  const fetchEvent = async (id) => {
    try {
      const event = await getSingleEvent(id);
      const eventDateRes = new Date(event.eventDate);
      const dueDateRes = new Date(event.dueDate);

      if (event) {
        setEventName(event.name);
        setDescription(event.description);
        setLocation(event.location);
        setEventDate(
          `${eventDateRes.getFullYear()}-${String(
            eventDateRes.getMonth() + 1
          ).padStart(2, "0")}-${String(eventDateRes.getDate()).padStart(
            2,
            "0"
          )}`
        );
        setDueDate(
          `${dueDateRes.getFullYear()}-${String(
            dueDateRes.getMonth() + 1
          ).padStart(2, "0")}-${String(dueDateRes.getDate()).padStart(2, "0")}`
        );
      }
    } catch (error) {
      console.error("Error fetching event", error);
    }
  };

  useEffect(() => {
    fetchEvent(id);
  }, []);

  const validateForm = () => {
    const validationErrors = {};
    if (!eventName.trim()) {
      validationErrors.eventName = "Event name is required";
    }

    if (!description.trim()) {
      validationErrors.description = "Description is required";
    }

    if (!location.trim()) {
      validationErrors.location = "Location is required";
    }

    const checkEventDate = new Date(eventDate);
    const checkDueDate = new Date(dueDate);

    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

    if (
      !(
        checkDueDate.getTime() + oneDayInMilliseconds <=
        checkEventDate.getTime()
      )
    ) {
      validationErrors.date = "Due date must be 1 day before event date";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      return true;
    } else return false;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const ISOEventDate = new Date(eventDate);
      ISOEventDate.setHours(10);
      ISOEventDate.setMinutes(30);

      const ISODueDate = new Date(dueDate);
      ISODueDate.setHours(12);
      const event = {
        name: eventName,
        description,
        location,
        eventDate: ISOEventDate,
        dueDate: ISODueDate,
      };

      const response = await updateEvent(id, event);

      if (response) {
        alert("Event Updated");
        setEventName("");
        setDescription("");
        setLocation("");
        setEventDate(currentDate);
        setDueDate(currentDate);
        navigate(-1);
      }
    }
  };
  return (
    <>
      <div className="content p-8 pt-0 overflow-visible">
        <div className="text-2xl font-semibold text-white mb-4 pt-8">
          Update Event
        </div>
        <div className="ml-11">
          <div className="w-2/3 flex space-x-3">
            <div className="space-y-4 flex flex-col justify-center items-center">
              <TextInput
                type="text"
                label="Event Name"
                labelClassName={"text-white"}
                placeholder="Event Name"
                value={eventName}
                setValue={setEventName}
              />
              {errors.eventName && (
                <p className="text-red-200 self-start">*{errors.eventName}</p>
              )}
              <TextInput
                type={"textarea"}
                label="Event Description"
                labelClassName={"text-white"}
                placeholder="Description"
                value={description}
                setValue={setDescription}
              />
              {errors.description && (
                <p className="text-red-200 self-start">*{errors.description}</p>
              )}
              <TextInput
                type={"text"}
                label="Location"
                labelClassName={"text-white"}
                placeholder="Location"
                value={location}
                setValue={setLocation}
              />
              {errors.location && (
                <p className="text-red-200 self-start">*{errors.location}</p>
              )}

              <div className="w-full flex justify-between items-center space-x-8 text-white">
                <DateInput
                  label="Event Date"
                  placeholder="Enter Your First Name"
                  className="my-6"
                  value={eventDate}
                  setValue={setEventDate}
                  min={currentDate}
                />
                <DateInput
                  label="Due Date"
                  placeholder="Enter Your Last Name"
                  className="my-6"
                  value={dueDate}
                  setValue={setDueDate}
                  min={currentDate}
                />
              </div>
              {errors.date && (
                <p className="text-red-200 self-start">*{errors.date}</p>
              )}
              <div
                className="bg-white w-1/3 rounded flex font-semibold justify-center items-center py-3 mt-4 cursor-pointer"
                onClick={handleUpdate}
              >
                Update
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateEventPage;
