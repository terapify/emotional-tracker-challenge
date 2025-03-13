const Emotion = require('../models/emotionModel');
const mongoose = require('mongoose');
// Get all emotions for a user
const getEmotions = async (req, res) => {
  const emotions = await Emotion.find({ user: req.user._id, date: { $lte: new Date() } }).sort({ date: -1 });
  res.json(emotions);
};

// Get single emotion by ID
const getEmotionById = async (req, res) => {
  const emotion = await Emotion.findById(req.params.id);
  
  if (!emotion) {
    res.status(404).json({ message: 'Emotion not found' });
    return;
  }

  res.json(emotion);
};

// Create a new emotion entry
const createEmotion = async (req, res) => {
  const { emotion, intensity, notes } = req.body;

  const newEmotion = await Emotion.create({
    user: req.user._id,
    emotion,
    intensity,
    notes
  });

  res.status(201).json(newEmotion);
};

// Update an emotion
const updateEmotion = async (req, res) => {
  const { emotion, intensity, notes } = req.body;

  const emotionRecord = await Emotion.findById(req.params.id);

  if (!emotionRecord) {
    res.status(404).json({ message: 'Emotion not found' });
    return;
  }
  
  emotionRecord.emotion = emotion || emotionRecord.emotion;
  emotionRecord.intensity = intensity || emotionRecord.intensity;
  emotionRecord.notes = notes || emotionRecord.notes;

  const updatedEmotion = await emotionRecord.save();
  res.json(updatedEmotion);
};

const getEmotionSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const userObjectId = mongoose.isValidObjectId(userId) ? mongoose.Types.ObjectId(userId) : userId;
    
    const summary = await Emotion.aggregate([
      { $match: { user: userObjectId } },
      
      { $facet: {
        overall: [
          { $group: {
              _id: null,
              count: { $sum: 1 },
              totalIntensity: { $sum: "$intensity" }
            }
          },
          { $project: {
              _id: 0,
              count: 1,
              averageIntensity: { $cond: [{ $eq: ["$count", 0] }, 0, { $divide: ["$totalIntensity", "$count"] }] }
            }
          }
        ],
        
        emotionCounts: [
          { $group: {
              _id: "$emotion",
              count: { $sum: 1 }
            }
          }
        ]
      }},
      
      { $project: {
        count: { $arrayElemAt: ["$overall.count", 0] },
        averageIntensity: { $arrayElemAt: ["$overall.averageIntensity", 0] },
        emotions: {
          $map: {
            input: "$emotionCounts",
            as: "emotion",
            in: {
              name: "$$emotion._id",
              count: "$$emotion.count"
            }
          }
        },
      }}
    ]);
    
    const result = summary.length > 0 ? summary[0] : { 
      count: 0, 
      averageIntensity: 0,
      emotionCounts: {}
    };
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error generating emotion summary', error: error.message });
  }
};

module.exports = {
  getEmotions,
  getEmotionById,
  createEmotion,
  updateEmotion,
  getEmotionSummary
};