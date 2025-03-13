const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();
const {
  getReminders,
  addReminder,
  deleteReminder,
} = require("../controllers/reminderController");

router.route("/")
  .get(protect, getReminders)
  .post(protect, addReminder);

router.route("/:id")
  .delete(protect, deleteReminder);

module.exports = router;
