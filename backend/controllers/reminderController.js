const Reminder = require('../models/reminderModel');

const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id }).sort({ date: -1 });
    res.json(reminders);
  } catch (error) {
    console.error('Error retrieving reminders:', error);
    res.status(500).json({ message: 'Error retrieving reminders' });
  }
};

const createReminder = async (req, res) => {
  try {
    const { message, date } = req.body;
    const newReminder = await Reminder.create({
      user: req.user._id,
      message,
      date: date || Date.now()
    });
    res.status(201).json(newReminder);
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({ message: 'Error creating reminder' });
  }
};

const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ message: 'Error deleting reminder' });
  }
};

module.exports = { getReminders, createReminder, deleteReminder };
