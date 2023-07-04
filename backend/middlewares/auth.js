const jwt = require("jsonwebtoken");
const Organizer = require("../models/organizer");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const organizer = await Organizer.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!organizer) {
      throw new Error();
    }

    req.token = token;
    req.organizer = organizer;

    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
