import { useState } from "react";
// import { useCookies } from "react-cookie";
import { Icon } from "@iconify/react";
import TextInput, { SelectInput } from "./TextInput";
import PasswordInput from "./PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import Volunify_logo from "../assets/images/only logo black.svg";
import validator from "validator";
import { useGlobalContext } from "./store/GlobalContext";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("Volunteer");
  const roleOptions = ["Volunteer", "Organizer"];
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { signUp } = useGlobalContext();

  const validateForm = () => {
    const validationErrors = {};

    if (!email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!validator.isEmail(email)) {
      validationErrors.email = "Please enter valid email address";
    }

    if (!username.trim()) {
      validationErrors.username = "Username is required";
    }

    if (!password.trim()) {
      validationErrors.password = "Password is required";
    } else if (password.trim().length < 7) {
      validationErrors.password = "Password must be minimum 7 characters";
    } else if (password.trim().includes("password")) {
      validationErrors.password = "Password must not contain 'password'";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      return true;
    } else return false;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form is Valid", {
        email,
        password,
        name: username,
        selectedRole,
      });

      const role = selectedRole.toLowerCase();

      const response = await signUp({ name: username, email, password, role });

      if (response) {
        navigate("/");
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="logo p-5 border-b border-solid border-gray-300 w-full flex justify-center">
        <Link to={"/"} className="flex items-center justify-center space-x-2">
          <img src={Volunify_logo} alt="volunify logo" className="h-[90px]" />
          <h1 className=" font-bold text-3xl ">Volunify</h1>
        </Link>
      </div>
      <div className="inputRegion w-1/3 py-10 flex items-center justify-center flex-col">
        {/*  I will have my 2 inputs(email and password) and I will have my sign up instead button*/}
        <div className="font-bold mb-4 text-2xl">Sign up</div>
        <TextInput
          label="Email address"
          placeholder="Enter your email"
          className="my-6"
          value={email}
          setValue={setEmail}
          type={"email"}
        />
        {errors.email && (
          <p className="text-red-500 self-start">*{errors.email}</p>
        )}
        <TextInput
          label="Username"
          placeholder="Enter your username"
          className="mb-6"
          value={username}
          setValue={setUsername}
        />
        {errors.username && (
          <p className="text-red-500 self-start">*{errors.username}</p>
        )}
        <PasswordInput
          label="Create Password"
          placeholder="Enter a strong password here"
          value={password}
          setValue={setPassword}
        />
        {errors.password && (
          <p className="text-red-500 self-start">*{errors.password}</p>
        )}

        <div className="w-full flex justify-between items-center space-x-8 my-5">
          <SelectInput
            label="Role"
            options={roleOptions}
            value={selectedRole}
            setValue={setSelectedRole}
          />
        </div>
        <div className=" w-full flex items-center justify-center my-8">
          <button
            className="bg-green-400 font-semibold p-3 px-10 rounded-full"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
        </div>
        <div className="w-full border border-solid border-gray-300"></div>
        <div className="my-6 font-semibold text-lg">
          Already have an account?
        </div>
        <div className="border border-gray-500 text-gray-500 w-full flex items-center justify-center py-4 rounded-full font-bold">
          <Link to="/login">LOG IN INSTEAD</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
