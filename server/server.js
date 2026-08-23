const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const facilityRoutes = require('./routes/facilityRoutes');

const imageAnalysisRoutes =
  require('./routes/imageAnalysisRoutes');




const passwordResetRoutes = require('./routes/passwordResetRoutes');

const recyclingRequestRoutes = require(
  './routes/recyclingRequestRoutes',
);

const authRoutes = require('./routes/authRoutes');

const app = express();



app.use(cors());
app.use(express.json());
app.use('/api/auth', passwordResetRoutes);
app.use(
  '/api/recycling-requests',
  recyclingRequestRoutes,
);

app.use('/api/auth', authRoutes);
app.use('/api/facilities', facilityRoutes);
app.use(
  '/api/analyze-image',
  imageAnalysisRoutes,
);

app.get('/', (req, res) => {
  res.json({
    message: 'Auth API is running',
  });
});



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(error => {
    console.log(
      'MongoDB connection failed:',
      error.message,
    );
  });