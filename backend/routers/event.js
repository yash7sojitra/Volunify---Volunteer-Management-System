const express = require("express");
const router = new express.Router();
const Event = require("../models/event");
const auth = require("../middlewares/auth");

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
    const event = await Event.findOne({ _id });
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
    const parts = req.query.sortBy.split("_");
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

module.exports = router;
