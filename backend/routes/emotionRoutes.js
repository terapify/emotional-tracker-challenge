const express = require('express');
const { 
  getEmotions, 
  getEmotionById, 
  createEmotion, 
  updateEmotion 
} = require('../controllers/emotionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protected routes
router.route('/')
  .get(protect, getEmotions)
  .post(protect, createEmotion);

router.get('/:id', getEmotionById);

router.put('/:id', protect, updateEmotion);

// TODO: Add route for getting emotion summary
//router.get('/summary', protect, getEmotionSummary);

// TODO: Add route for sharing data with therapists

module.exports = router;