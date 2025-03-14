const Reminder = require("../models/reminderModel");
const mongoose = require("mongoose");

const getReminders = async (req, res) => {
  const reminders = await Reminder.find({ user: req.user._id });
  res.json(reminders);
};

const addReminder = async (req, res) => {
  try {
    const { activity, time, repeat } = req.body;

    if (!activity || !time || !repeat) {
      return res
        .status(400)
        .json({ message: "Activity, time and repeat are required" });
    }

    const reminder = new Reminder({
      user: req.user._id,
      activity,
      time,
      repeat,
    });

    await reminder.save();
    res.status(201).json({
      _id: reminder._id,
      activity: reminder.activity,
      time: reminder.time,
      repeat: reminder.repeat,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding reminder", error: error.message });
  }
};

const deleteReminder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid reminder ID" });
  }

  try {
    const deletedReminder = await Reminder.findByIdAndDelete(id);
    if (!deletedReminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }
    res
      .status(200)
      .json({ message: "Reminder deleted successfully", deletedReminder });
  } catch (error) {
    res.status(500).json({ message: "Error deleting reminder" });
  }
};

module.exports = { getReminders, addReminder, deleteReminder };
