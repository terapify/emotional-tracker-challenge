const Emotion = require('../models/emotionModel');

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
    
    const summaryData = await Emotion.aggregate([
      { $match: { user: userId } },
      
      { $group: {
          _id: null,
          count: { $sum: 1 },
          totalIntensity: { $sum: "$intensity" },
          emotions: { $push: "$emotion" }
        }
      },
      
      { $project: {
          _id: 0,
          count: 1,
          averageIntensity: { $cond: [{ $eq: ["$count", 0] }, 0, { $divide: ["$totalIntensity", "$count"] }] }
        }
      }
    ]);
    
    const emotionCounts = await Emotion.aggregate([
      { $match: { user: userId } },
      { $group: {
          _id: "$emotion",
          count: { $sum: 1 }
        }
      }
    ]);
    
    const summary = summaryData.length > 0 ? summaryData[0] : { count: 0, averageIntensity: 0 };
    
    summary.emotionCounts = {};
    emotionCounts.forEach(item => {
      summary.emotionCounts[item._id] = item.count;
    });
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error generating emotion summary', error: error.message });
  }
};

// const getEmotionSummary = async (userId) => {
//   // Inefficient query
//   const emotions = await Emotion.find({ user: userId });
  
//   // TODO: Implement aggregation for better performance
//   const summary = {
//     count: emotions.length,
//     averageIntensity: 0,
//     emotionCounts: {}
//   };
  
//   emotions.forEach(e => {
//     summary.averageIntensity += e.intensity;
//     summary.emotionCounts[e.emotion] = (summary.emotionCounts[e.emotion] || 0) + 1;
//   });
  
//   if (emotions.length > 0) {
//     summary.averageIntensity /= emotions.length;
//   }
  
//   return summary;
// };

module.exports = {
  getEmotions,
  getEmotionById,
  createEmotion,
  updateEmotion
};