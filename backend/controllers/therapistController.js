const User = require('../models/userModel');
const Emotion = require('../models/emotionModel');
const { validationResult } = require('express-validator');

const shareEmotionsWithTherapist = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { therapistId } = req.body;
  
  try {
    
    if (req.user.therapistId) {
      if (req.user.therapistId.toString() !== therapistId) {
        return res.status(400).json({ message: 'Invalid therapist ID. You can only share data with your assigned therapist.' });
      }
    } else {
      const therapist = await User.findById(therapistId);
      if (!therapist || therapist.role !== 'therapist') {
        return res.status(400).json({ message: 'Invalid therapist ID' });
      }
    }
    
    
    const emotions = await Emotion.find({ user: req.user._id });
    res.json({
      message: 'Emotional data shared successfully',
      therapistId,
      sharedEmotions: emotions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { shareEmotionsWithTherapist };
