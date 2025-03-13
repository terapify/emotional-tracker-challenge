const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  activity: {
    type: String,
    required: true,
    enum: ["Meditation", "Exercise", "Reading", "Journaling", "Stretching"],
  },
  repeat: {
    type: String,
    required: true,
    enum: ["Daily", "Weekly", "Monthly", "Yearly"],
  },
  time: {
    type: String,
    required: true,
  },
});

const Reminder = mongoose.model("Reminder", reminderSchema);

module.exports = Reminder;
