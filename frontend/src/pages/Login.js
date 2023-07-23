import { useState } from "react";
import TextInput, { SelectInput } from "../Components/TextInput";
import PasswordInput from "../Components/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import Volunify_logo from "../assets/images/only logo black.svg";
import { useGlobalContext } from "../Components/store/GlobalContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("Volunteer");
  const roleOptions = ["Volunteer", "Organizer"];
  const navigate = useNavigate();

  const { loginOrganizer, loginVolunteer } = useGlobalContext();

  const handleLogin = async (event) => {
    const body = { email, password };
    event.preventDefault();

    if (selectedRole.toLowerCase() === "volunteer") {
      // Handle volunteer login
      const response = await loginVolunteer(body);
      console.log(response);
      if (response) {
        navigate("/");
      }
    } else if (selectedRole.toLowerCase() === "organizer") {
      // Handle organizer login
      console.log(email, password);

      const response = await loginOrganizer(body);

      console.log(response);

      if (response) {
        navigate("/");
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="logo py-5 border-b border-solid border-gray-300 w-full flex justify-center">
        <Link to={"/"} className="flex items-center justify-center space-x-2">
          <img src={Volunify_logo} alt="volunify logo" className="h-[90px]" />
          <h1 className=" font-bold text-3xl ">Volunify</h1>
        </Link>
      </div>
      <div className="inputRegion w-1/3 py-10 flex items-center justify-center flex-col">
        {/*  I will have my 2 inputs(email and password) and I will have my sign up instead button*/}
        <div className="font-bold mb-4">To continue, log in to Volunify.</div>
        <TextInput
          label="Email address or username"
          placeholder="Email address or username"
          className="my-6"
          value={email}
          setValue={setEmail}
        />
        <PasswordInput
          label="Password"
          placeholder="Password"
          value={password}
          setValue={setPassword}
        />
        <div className="w-full flex justify-between items-center space-x-8">
          <SelectInput
            label="Role"
            options={roleOptions}
            value={selectedRole}
            setValue={setSelectedRole}
          />
        </div>

        <div className=" w-full flex items-center justify-end my-8">
          <button
            className="bg-green-400 font-semibold p-3 px-10 rounded-full"
            onClick={handleLogin}
          >
            LOG IN
          </button>
        </div>
        <div className="w-full border border-solid border-gray-300"></div>
        <div className="my-6 font-semibold text-lg">Don't have an account?</div>
        <div className="border border-gray-500 text-gray-500 w-full flex items-center justify-center py-4 rounded-full font-bold">
          <Link to="/signup">SIGN UP</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
