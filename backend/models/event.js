const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Organizer",
    },
    volunteers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Volunteer",
        unique: true,
        sparse: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ volunteers: 1 });
const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
