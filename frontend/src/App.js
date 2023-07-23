import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import SearchEventPage from "./pages/Search";
import MyEventsPage from "./pages/MyEvents";
import ProfilePage from "./pages/Profile";
import { useGlobalContext } from "./Components/store/GlobalContext";
import CreateEventPage from "./pages/CreateEvent";
import EventDetailPage from "./pages/EventDetail";
import UpdateEventPage from "./pages/UpdateEvent";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "search",
        element: <SearchEventPage />,
      },
      {
        path: "myevents",
        element: <MyEventsPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "create-event",
        element: <CreateEventPage />,
      },
      {
        path: "event/:id",
        element: <EventDetailPage />,
      },
      {
        path: "event-update/:id",
        element: <UpdateEventPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
