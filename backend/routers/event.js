const express = require("express");
const router = new express.Router();
const Event = require("../models/event");
const auth = require("../middlewares/auth");
const authVolunteer = require("../middlewares/authVolunteer");
const Volunteer = require("../models/volunteer");

//Create Event
router.post("/events", auth, async (req, res) => {
  const event = new Event({ ...req.body, organizer: req.organizer._id });

  try {
    await event.save();
    console.log("saved");
    res.status(201).send(event);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Read a single event
router.get("/events/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const event = await Event.findOne({ _id, organizer: req.organizer._id });
    if (!event) {
      return res.status(404).send({ message: "Event does not exist" });
    }

    res.send(event);
  } catch (error) {
    return res.status(500).send(error);
  }
});

//Read all events of organizer
//GET /events?limit=10&skip=20
//GET /events?sortBy=createdAt:desc
router.get("/events", auth, async (req, res) => {
  const sort = {};

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.organizer.populate({
      path: "events",
      options: {
        sort,
      },
    });

    res.send(req.organizer.events);
  } catch (error) {
    res.status(500).send(error);
  }
});

//Update Events
router.patch("/events/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "description",
    "eventDate",
    "dueDate",
    "location",
  ];
  const isValidOpeartion = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  //Send error if trying to update the fields which are not allowed
  if (!isValidOpeartion) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    //find the event with the given organizer id
    //If doesnt exist throw error
    const event = await Event.findOne({
      _id: req.params.id,
      organizer: req.organizer._id,
    });

    if (!event) {
      return res.status(404).send("Event does not exist");
    }

    updates.forEach((update) => (event[update] = req.body[update]));
    await event.save();
    res.send(event);
  } catch (error) {
    if (error.name === "CastError" && error.path === "_id") {
      // Handle the error specifically for "Event does not exist" scenario
      return res.status(404).send("Event does not exist");
    }

    res.status(400).send(error);
  }
});

//Delete Event
router.delete("/events/:id", auth, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      organizer: req.organizer._id,
    });

    if (!event) {
      return res.status(404).send("Event does not exist");
    }

    res.send(event);
  } catch (error) {
    if (error.name === "CastError" && error.path === "_id") {
      // Handle the error specifically for "Event does not exist" scenario
      return res.status(404).send("Event does not exist");
    }
    res.status(500).send();
  }
});

//Event related tasks for volunteers
//Register for an Event
router.post("/events/register/:id", authVolunteer, async (req, res) => {
  const eventId = req.params.id;
  const volunteerId = req.volunteer._id;

  try {
    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if volunteer is already registered for the event
    const isRegistered = event.volunteers.includes(volunteerId);

    if (isRegistered) {
      return res
        .status(400)
        .json({ error: "Volunteer is already registered for the event" });
    }

    // Update event and volunteer references
    event.volunteers.push(volunteerId);
    req.volunteer.events.push(eventId);

    // Save the changes
    await event.save();
    await req.volunteer.save();

    res.json({ message: "Volunteer registered for the event successfully" });
  } catch (error) {
    if (error.name === "CastError" && error.path === "_id") {
      // Handle the error specifically for "Event does not exist" scenario
      return res.status(404).send("Event does not exist");
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

//Upcoming events
router.get("/upcoming-events", async (req, res) => {
  try {
    const currentDate = new Date();

    // Find the 5 upcoming events based on event date
    const upcomingEvents = await Event.find({ eventDate: { $gt: currentDate } })
      .sort({ eventDate: 1 })
      .limit(5);

    res.json(upcomingEvents);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//search-events
router.get("/events-search", async (req, res) => {
  try {
    const { keywords } = req.query;
    const query = {};

    if (keywords) {
      // Add keyword-based search query
      query.$or = [
        { name: { $regex: keywords, $options: "i" } }, // Case-insensitive match for event name
        { description: { $regex: keywords, $options: "i" } }, // Case-insensitive match for event description
      ];
    }

    const events = await Event.find(query).sort({ eventDate: -1 });

    res.json(events);
  } catch (error) {
    console.error("Error during event search:", error);
    res.status(500).json({ error: "An error occurred during event search." });
  }
});

//Read single Event for user
router.get("/event/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const event = await Event.findOne({ _id });
    if (!event) {
      return res.status(404).send({ message: "Event does not exist" });
    }

    res.send(event);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
