const jwt = require("jsonwebtoken");
const Volunteer = require("../models/volunteer");

const authVolunteer = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const volunteer = await Volunteer.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!volunteer) {
      throw new Error();
    }

    req.token = token;
    req.volunteer = volunteer;

    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = authVolunteer;
