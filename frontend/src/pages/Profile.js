import { FaUserAlt } from "react-icons/fa";
import Button from "../Components/UI/Button";
import * as Avatar from "@radix-ui/react-avatar";
import { useGlobalContext } from "../Components/store/GlobalContext";

function ProfilePage() {
  const { organizer, volunteer, userRole } = useGlobalContext();

  return (
    <div className="content p-8 pt-0 overflow-auto">
      <div className="text-white text-2xl font-semibold pb-4 pl-2 pt-8">
        My Profile
      </div>
      <div className="flex items-center space-x-4 p-8">
        <Button
          // onClick={navigateToProfile}
          className="bg-white flex items-center justify-center rounded-full font-semibold cursor-pointer h-28 w-28 bg-cover"
        >
          <Avatar.Root>
            <FaUserAlt className="h-9 w-9" />
          </Avatar.Root>
        </Button>

        <div className="text-white text-3xl font-semibold">
          {userRole === "organizer" && organizer.name}
          {userRole === "volunteer" && volunteer.name}
          {userRole === "organizer" && (
            <div className="text-sm">Event Organizer</div>
          )}
          {userRole === "volunteer" && <div className="text-sm">Volunteer</div>}
        </div>
        <div>
          <Button className="bg-white px-6 py-2 mb-3 w-full">
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
