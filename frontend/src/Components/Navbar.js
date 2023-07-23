import TextWithHover from "./TextWithHover.";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "./store/GlobalContext";
import Button from "./UI/Button";
import * as Avatar from "@radix-ui/react-avatar";
import { FaUserAlt } from "react-icons/fa";

function Navbar() {
  const { loggedIn, userRole, logoutOrganizer, logoutVolunteer } =
    useGlobalContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (userRole === "organizer") logoutOrganizer();
    if (userRole === "volunteer") logoutVolunteer();
    navigate("/");
  };

  return (
    <div className="navbar w-full h-1/10 bg-black bg-opacity-30 flex items-center justify-end border-l-white">
      <div className="w-1/2 flex h-full justify-end">
        <div className="w-2/5 flex justify-around h-full items-center">
          {loggedIn && (
            <>
              <button onClick={handleLogout}>
                <TextWithHover displayText={"Log Out"} />
              </button>
              <Button
                onClick={() => {
                  navigate("/profile");
                }}
                className="bg-white w-10 h-10 flex items-center justify-center rounded-full font-semibold cursor-pointer"
              >
                <Avatar.Root className="bg-blackA3 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle">
                  <Avatar.Image
                    className="h-10 w-full rounded-[inherit] object-cover"
                    src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
                    alt="Colm Tuite"
                  />
                  <Avatar.Fallback
                    className="text-violet11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
                    delayMs={600}
                  >
                    <FaUserAlt />
                  </Avatar.Fallback>
                </Avatar.Root>
              </Button>
            </>
          )}

          {!loggedIn && (
            <>
              <Link to={"/signup"}>
                <TextWithHover displayText={"Sign up"} />
              </Link>
              <Link
                to={"/login"}
                className="bg-white h-2/3 px-8 flex items-center justify-center rounded-full font-semibold cursor-pointer"
              >
                <button>Log in</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
