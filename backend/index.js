const express = require("express");
const dotenv = require("dotenv");
require("./db/mongoose");
const eventRouter = require("./routers/event");
const organizerRouter = require("./routers/organizer");
const volunteerRouter = require("./routers/volunteer");
const Event = require("./models/event");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
//routers
app.use(eventRouter);
app.use(organizerRouter);
app.use(volunteerRouter);

app.get("/", (req, res) => {
  res.send("<h1>Volunteer Management System</h1>");
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
