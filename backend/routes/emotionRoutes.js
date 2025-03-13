const express = require('express');
const { 
  getEmotions, 
  getEmotionById, 
  createEmotion, 
  updateEmotion,
  getEmotionSummary
} = require('../controllers/emotionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protected routes
router.route('/')
  .get(protect, getEmotions)
  .post(protect, createEmotion);

router.get('/summary', protect, getEmotionSummary);

router.get('/:id', getEmotionById);
router.put('/:id', protect, updateEmotion);


module.exports = router;