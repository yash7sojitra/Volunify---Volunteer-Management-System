import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { MdDescription } from "react-icons/md";

const Card = ({ _id, title, description, imgUrl, date }) => {
  const navigate = useNavigate();
  const dateTime = new Date(date);

  const formattedDateTime = dateTime.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "UTC",
  });

  const handleViewEvent = () => {
    navigate(`/event/${_id}`);
  };

  return (
    <div className="group bg-black bg-opacity-40 w-1/5 p-4 rounded-2xl flex flex-col justify-between hover:bg-gradient-to-t  hover:from-gray-600  hover:to-transparent hover:scale-110 hover:cursor-pointer">
      <div>
        <div className="pb-4 pt-2">
          <img className="w-full rounded-md" src={imgUrl} alt="label" />
        </div>
        <div className="text-white font-semibold py-3">{title}</div>
        <div className="text-gray-300 text-sm ">
          {description.slice(0, 35)}...
        </div>
        <div className="my-2 text-gray-500 text-sm group-hover:text-white ">
          {formattedDateTime}
        </div>
      </div>
      <Button
        className="bg-white group-hover:border-spacing-2 group-hover:border-white group-hover:text-white group-hover:bg-transparent translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all ease-linear duration-300"
        onClick={handleViewEvent}
      >
        View Event
      </Button>
    </div>
  );
};

export default Card;
