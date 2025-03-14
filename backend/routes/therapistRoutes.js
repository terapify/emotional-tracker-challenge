const express = require('express');
const { shareEmotionsWithTherapist } = require('../controllers/therapistController');
const { protect } = require('../middlewares/authMiddleware');
const { body } = require('express-validator');

const router = express.Router();

const validateTherapistShare = [
  body('therapistId').isMongoId().withMessage('Invalid therapist ID'),
];

router.post('/share', protect, validateTherapistShare, shareEmotionsWithTherapist);

module.exports = router;
