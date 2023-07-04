const express = require("express");
const dotenv = require("dotenv");
require("./db/mongoose");
const eventRouter = require("./routers/event");
const organizerRouter = require("./routers/organizer");

dotenv.config();

const app = express();

app.use(express.json());
//routers
app.use(eventRouter);
app.use(organizerRouter);

app.get("/", (req, res) => {
  res.send("<h1>Volunteer Management System</h1>");
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
