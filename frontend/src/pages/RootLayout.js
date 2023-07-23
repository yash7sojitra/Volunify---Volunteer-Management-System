import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import SideBar from "../Components/SideBar";

function RootLayout() {
  return (
    <div className="w-screen h-screen font-poppins bg-black flex">
      <SideBar />
      <main className="h-full w-4/5 bg-app-black overflow-auto">
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;
