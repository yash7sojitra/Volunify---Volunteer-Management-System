const mongoose = require("mongoose");
const validator = require("validator");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Event = require("./event");

const organizerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password cannot contain 'password'");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

organizerSchema.virtual("events", {
  ref: "Event",
  localField: "_id",
  foreignField: "organizer",
});

//Finding the organizer by its email and password when loggin in
organizerSchema.statics.findByCredentials = async (email, password) => {
  const organizer = await Organizer.findOne({ email });

  if (!organizer) {
    throw new Error("Unable to login");
  }

  const isMatch = await bycrypt.compare(password, organizer.password);

  if (!isMatch) {
    throw new Error("Unablet to login");
  }

  return organizer;
};

//Generating Authentication Token when Sign up or log in
organizerSchema.methods.generateAuthToken = async function () {
  const organizer = this;
  const token = jwt.sign(
    { _id: organizer._id.toString() },
    process.env.JWT_SECRET
  );

  organizer.tokens = organizer.tokens.concat({ token });

  await organizer.save();

  return token;
};

organizerSchema.methods.toJSON = function () {
  const organizer = this;
  const organizerObject = organizer.toObject();

  delete organizerObject.password;
  delete organizerObject.tokens;

  // console.log(organizerObject);

  return organizerObject;
};

//Hash the plain text password before saving
organizerSchema.pre("save", async function (next) {
  const organizer = this; //'this' references the current document

  if (organizer.isModified("password")) {
    organizer.password = await bycrypt.hash(organizer.password, 8);
  }

  console.log("Just before saving!");
  next();
});

const Organizer = mongoose.model("Organizer", organizerSchema);
Organizer.createIndexes();

module.exports = Organizer;
