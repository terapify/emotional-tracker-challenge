const User = require('../models/userModel');
const Reminder = require('../models/reminderModel');

const sendWellnessReminders = async () => {
  try {
    const users = await User.find();
    const message = "No olvides realizar tu actividad de bienestar hoy.";
    const now = new Date();

    for (const user of users) {
      await Reminder.create({
        user: user._id,
        message,
        date: now
      });
      console.log(`Recordatorio guardado para ${user.email}: ${message}`);
    }
  } catch (error) {
    console.error('Error enviando recordatorios:', error);
  }
};


module.exports = { sendWellnessReminders };
