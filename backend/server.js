const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const emotionRoutes = require('./routes/emotionRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
// TODO: Move this to a separate config file
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/emotionaltracker';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/emotions', emotionRoutes);
app.use('/api/reminders', reminderRoutes);

// Unprotected test route
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Error handling middleware
// TODO: Implement proper error handling middleware

const PORT = process.env.PORT ||5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));