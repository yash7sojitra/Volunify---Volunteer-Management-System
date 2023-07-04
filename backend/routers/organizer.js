const express = require("express");
const router = new express.Router();
const Organizer = require("../models/organizer");
const auth = require("../middlewares/auth");

//Create Organizer OR Sign up(Register) for Organizer
router.post("/organizers", async (req, res) => {
  const organizer = new Organizer(req.body);

  try {
    await organizer.save();
    const token = await organizer.generateAuthToken();
    res.status(201).send({ organizer, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

//Login Organizer
router.post("/organizers/login", async (req, res) => {
  try {
    const organizer = await Organizer.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await organizer.generateAuthToken();

    //When we pass out object into res.send({OBJECTS}), they are stringified internally
    // If an object being stringified has a toJSON() method defined,
    //JSON.stringify() will call the toJSON() method to obtain a value to be serialized.
    res.send({ organizer, token });
  } catch (error) {
    res.status(400).send();
  }
});

//Logout Organizer for a single device
router.post("/organizers/logout", auth, async (req, res) => {
  try {
    req.organizer.tokens = req.organizer.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.organizer.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

//Read Profile
router.get("/organizers/me", auth, async (req, res) => {
  res.send(req.organizer);
});

module.exports = router;
