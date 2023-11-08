import MenuButton from "./UI/MenuButton";
import volunify_logo from "../assets/images/only logo white.svg";
import { useGlobalContext } from "./store/GlobalContext";

const SideBar = () => {
  const { userRole } = useGlobalContext();
  return (
    <div className="h-full w-1/5 bg-app-black flex flex-col justify-between pb-10 bg-gradient-to-b from-emerald-800 via-transparent ">
      <div className="m-5 bg-app-black rounded-lg h-full">
        {/* This div is for logo */}
        <div className="logoDiv p-6 flex items-center  space-x-2 w-28">
          <img src={volunify_logo} alt="volunify logo" />
          <h1 className="text-white font-bold text-3xl ">Volunify</h1>
        </div>
        <div className="py-5">
          <MenuButton
            iconName={"material-symbols:home"}
            displayText={"Home"}
            active
          />
          <MenuButton
            iconName={"material-symbols:search-rounded"}
            displayText={"Search Events"}
            targetLink={"/search"}
          />
          {userRole === "organizer" && (
            <>
              <MenuButton
                iconName={"icomoon-free:books"}
                displayText={"My Events"}
                targetLink={"/myevents"}
              />
              <MenuButton
                iconName={"material-symbols:add-box"}
                displayText={"Create an Event"}
                targetLink={"/create-event"}
              />
            </>
          )}
          {userRole === "volunteer" && (
            <MenuButton
              iconName={"icomoon-free:books"}
              displayText={"Registered Events"}
              targetLink={"/myevents"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
