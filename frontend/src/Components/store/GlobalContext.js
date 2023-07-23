import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = "http://localhost:5000/";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const [organizer, setOrganizer] = useState();
  const [volunteer, setVolunteer] = useState();
  const [myEvents, setMyEvents] = useState([]);

  const readProfile = async (role, authToken) => {
    const user = `${role}s`;
    try {
      const response = await axios.get(`${BASE_URL}${user}/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.log("Error fetching Profile", error.response);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const authToken = localStorage.getItem("authToken");
      if (authToken != null) {
        const data = await readProfile("organizer", authToken);
        console.log(data);
        if (data && data._id != null) {
          setLoggedIn(true);
          setUserRole("organizer");
          setOrganizer(data);
        } else {
          const data = await readProfile("volunteer", authToken);
          if (data && data._id != null) {
            setLoggedIn(true);
            setUserRole("volunteer");
            setVolunteer(data);
          }
        }
      }
    };

    fetchData();
  }, []);

  const getUpcomingEvents = async () => {
    try {
      const response = await axios.get(`${BASE_URL}upcoming-events`);
      setUpcomingEvents(response.data);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
    }
  };

  //Organizer
  //Signup Organizer
  const signUp = async ({ name, email, password, role }) => {
    try {
      const jsonData = JSON.stringify({ name, email, password });
      const headers = {
        "Content-Type": "application/json",
      };

      const response = await axios.post(`${BASE_URL}${role}s`, jsonData, {
        headers,
      });

      if (role === "organizer") {
        setOrganizer(response.data.organizer);
      } else if (role === "volunteer") {
        setVolunteer(response.data.volunteer);
      }

      setLoggedIn(true);
      setUserRole(role);

      const authToken = response.data.token;

      localStorage.setItem("authToken", authToken);

      return response.data;
    } catch (e) {
      console.error("Error signing up", e);
    }
  };

  //Login Organizer
  const loginOrganizer = async ({ email, password }) => {
    const rawData = {
      email: email,
      password: password,
    };
    const jsonData = JSON.stringify(rawData);

    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(
        `${BASE_URL}organizers/login `,
        jsonData,
        { headers }
      );

      setOrganizer(response.data.organizer);
      setLoggedIn(true);
      setUserRole("organizer");
      const authToken = response.data.token;

      localStorage.setItem("authToken", authToken);

      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  //logout Organizer
  const logoutOrganizer = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(
        `${BASE_URL}organizers/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Attach the token to the "Authorization" header
          },
        }
      );

      console.log(response.data);
      console.log(response.status);

      if (response.status === 200) {
        setLoggedIn(false);
        setUserRole(null);
        localStorage.removeItem("authToken");
      }
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  //create Event
  const createEvent = async (event) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(
        `${BASE_URL}events`,
        { ...event },
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Attach the token to the "Authorization" header
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error Creating Event", error);
    }
  };

  //update Event
  const updateEvent = async (id, event) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.patch(
        `${BASE_URL}events/${id}`,
        { ...event },
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Attach the token to the "Authorization" header
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error Updating Event", error);
    }
  };

  //Get a single Event by id
  const getSingleEvent = async (_id) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`${BASE_URL}event/${_id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Attach the token to the "Authorization" header
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching event ", error);
    }
  };

  //Get all Events for Organizer
  const getAllEvents = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(
        `${BASE_URL}events?sortBy=createdAt:desc`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Attach the token to the "Authorization" header
          },
        }
      );

      const events = response.data; // Extract the events from the response
      setMyEvents(events);
      return events;
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  //search Events
  const searchEvents = async (keywords) => {
    try {
      const response = await axios.get(
        `${BASE_URL}events-search?keywords=${keywords}`
      );

      return response.data;
    } catch (error) {
      console.error("Error during event search:", error);
    }
  };

  //login Volunteer
  const loginVolunteer = async ({ email, password }) => {
    const rawData = {
      email: email,
      password: password,
    };
    const jsonData = JSON.stringify(rawData);

    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(
        `${BASE_URL}volunteers/login `,
        jsonData,
        { headers }
      );

      console.log(response);

      setVolunteer(response.data.volunteer);
      setLoggedIn(true);
      setUserRole("volunteer");
      const authToken = response.data.token;

      localStorage.setItem("authToken", authToken);

      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  //Get Registered events of volunteers
  const getRegisteredEvents = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`${BASE_URL}volunteers/events`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Attach the token to the "Authorization" header
        },
      });

      const events = response.data; // Extract the events from the response
      setMyEvents(events);
      return events;
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  //Logout Volunteer
  const logoutVolunteer = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(
        `${BASE_URL}volunteers/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Attach the token to the "Authorization" header
          },
        }
      );
      console.log(response.status);

      if (response.status === 200) {
        setLoggedIn(false);
        setUserRole(null);
        localStorage.removeItem("authToken");
      }
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  //Volunteer-Register for an Event
  const registerEvent = async (id) => {
    try {
      const authToken = localStorage.getItem("authToken");

      const response = await axios.post(
        `${BASE_URL}events/register/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Attach the token to the "Authorization" header
          },
        }
      );

      console.log(response.data);

      return response.data;
    } catch (error) {
      console.error("Error Registering for event", error);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        signUp,
        loggedIn,
        userRole,
        getUpcomingEvents,
        searchEvents,
        upcomingEvents,
        createEvent,
        updateEvent,
        getSingleEvent,
        organizer,
        loginOrganizer,
        logoutOrganizer,
        getAllEvents,
        myEvents,
        loginVolunteer,
        volunteer,
        getRegisteredEvents,
        logoutVolunteer,
        registerEvent,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
