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


router.route('/')
  .get(protect, getEmotions)
  .post(protect, createEmotion);

router.get('/:id', getEmotionById);

router.put('/:id', protect, updateEmotion);


router.get('/summary', protect, async (req, res) => {
  try {
    const summary = await getEmotionSummary(req.user._id);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
