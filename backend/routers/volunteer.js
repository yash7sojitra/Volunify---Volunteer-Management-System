const express = require("express");
const router = new express.Router();
const Volunteer = require("../models/volunteer");
const authVolunteer = require("../middlewares/authVolunteer");

//Create Organizer OR Sign up(Register) for Organizer
router.post("/volunteers", async (req, res) => {
  const volunteer = new Volunteer(req.body);

  try {
    await volunteer.save();
    const token = await volunteer.generateAuthToken();
    res.status(201).send({ volunteer, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

//Login Volunteer
router.post("/volunteers/login", async (req, res) => {
  try {
    const volunteer = await Volunteer.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await volunteer.generateAuthToken();

    //When we pass out object into res.send({OBJECTS}), they are stringified internally
    // If an object being stringified has a toJSON() method defined,
    //JSON.stringify() will call the toJSON() method to obtain a value to be serialized.
    res.send({ volunteer, token });
  } catch (error) {
    res.status(400).send();
  }
});

//Logout Volunteer for a single device
router.post("/volunteers/logout", authVolunteer, async (req, res) => {
  try {
    req.volunteer.tokens = req.volunteer.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.volunteer.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

//Read Profile
router.get("/volunteers/me", authVolunteer, async (req, res) => {
  res.send(req.volunteer);
});

//Update Volunteer info
router.patch("/volunteers/me", authVolunteer, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];

  const isValidOpeartion = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOpeartion) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.volunteer[update] = req.body[update]));
    await req.volunteer.save();
    res.send(req.volunteer);
  } catch (error) {
    res.status(400).send(error);
  }
});

//Get all the registered events of a Volunteer
router.get("/volunteers/events", authVolunteer, async (req, res) => {
  // const sort = {};

  // if (req.query.sortBy) {
  //   const parts = req.query.sortBy.split("_");
  //   sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  // }

  try {
    const volunteer = await req.volunteer.populate({
      path: "events",
      // options: {
      //   sort,
      // },
    });

    res.send(volunteer.events);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
