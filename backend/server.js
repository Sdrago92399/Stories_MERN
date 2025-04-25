const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storiesRoutes = require('./routes/storiesRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const apiLimiter = require('./middleware/rateLimiter');
const logger = require('./middleware/logger');

dotenv.config();

const app = express();
const MONGO_URI = process.env.MONGO_URL + process.env.MONGO_DATABASE;

// CORS allowlist
const allowedOrigins = [
  process.env.FRONTEND_URL,
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies/auth tokens for cross-origin requests
}));

app.use(express.json());
app.use(logger);
//app.use(apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stories', storiesRoutes);

app.use(errorHandler);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
