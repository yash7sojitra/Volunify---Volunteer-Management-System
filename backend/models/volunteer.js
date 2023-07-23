const mongoose = require("mongoose");
const validator = require("validator");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const volunteerSchema = mongoose.Schema(
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
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        unique: true,
      },
    ],
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

//Finding the volunteer by its email and password when loggin in
volunteerSchema.statics.findByCredentials = async (email, password) => {
  const volunteer = await Volunteer.findOne({ email });

  if (!volunteer) {
    throw new Error("Unable to login");
  }

  const isMatch = await bycrypt.compare(password, volunteer.password);

  if (!isMatch) {
    throw new Error("Unablet to login");
  }

  return volunteer;
};

//Generating Authentication Token when Sign up or log in
volunteerSchema.methods.generateAuthToken = async function () {
  const volunteer = this;
  const token = jwt.sign(
    { _id: volunteer._id.toString() },
    process.env.JWT_SECRET
  );

  volunteer.tokens = volunteer.tokens.concat({ token });

  await volunteer.save();

  return token;
};

//removing the password and tokens from the volunteet=r object when sending to client
volunteerSchema.methods.toJSON = function () {
  const volunteer = this;
  const volunteerObject = volunteer.toObject();

  delete volunteerObject.password;
  delete volunteerObject.tokens;

  // console.log(volunteerObject);

  return volunteerObject;
};

//Hash the plain text password before saving
volunteerSchema.pre("save", async function (next) {
  const volunteer = this; //'this' references the current document

  if (volunteer.isModified("password")) {
    volunteer.password = await bycrypt.hash(volunteer.password, 8);
  }

  console.log("Just before saving!");
  next();
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
Volunteer.createIndexes();

module.exports = Volunteer;
