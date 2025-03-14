const Emotion = require('../models/emotionModel');


const getEmotions = async (req, res) => {
  try {
    const emotions = await Emotion.find({ user: req.user._id });
    res.json(emotions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getEmotionById = async (req, res) => {
  try {
    const emotion = await Emotion.findById(req.params.id);
    if (!emotion) {
      return res.status(404).json({ message: 'Emotion not found' });
    }
    res.json(emotion);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


const createEmotion = async (req, res) => {
  try {
    const { emotion, intensity, notes } = req.body;
    const newEmotion = await Emotion.create({
      user: req.user._id,
      emotion,
      intensity,
      notes
    });
    res.status(201).json(newEmotion);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


const updateEmotion = async (req, res) => {
  try {
    const { emotion, intensity, notes } = req.body;
    const emotionRecord = await Emotion.findById(req.params.id);
    if (!emotionRecord) {
      return res.status(404).json({ message: 'Emotion not found' });
    }
    emotionRecord.emotion = emotion || emotionRecord.emotion;
    emotionRecord.intensity = intensity || emotionRecord.intensity;
    emotionRecord.notes = notes || emotionRecord.notes;
    const updatedEmotion = await emotionRecord.save();
    res.json(updatedEmotion);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


const getEmotionSummary = async (req, res) => {
  try {
    const summary = await Emotion.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$emotion',
          count: { $sum: 1 },
          totalIntensity: { $sum: '$intensity' }
        }
      },
      {
        $group: {
          _id: null,
          emotionCounts: { $push: { emotion: '$_id', count: '$count' } },
          totalEmotions: { $sum: '$count' },
          totalIntensity: { $sum: '$totalIntensity' }
        }
      },
      {
        $project: {
          _id: 0,
          count: '$totalEmotions',
          averageIntensity: {
            $cond: [
              { $eq: ['$totalEmotions', 0] },
              0,
              { $divide: ['$totalIntensity', '$totalEmotions'] }
            ]
          },
          emotionCounts: 1
        }
      }
    ]);
    res.json(summary[0] || { count: 0, averageIntensity: 0, emotionCounts: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getEmotions,
  getEmotionById,
  createEmotion,
  updateEmotion,
  getEmotionSummary
};
