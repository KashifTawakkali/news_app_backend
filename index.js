require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const newsRoutes = require('./routes/newsRoutes');
const cors = require('cors');


const app = express();

// Middleware
app.use(express.json());


app.use(cors({
    origin: 'http://localhost:3002', // Allow requests from the frontend
    methods: ['GET', 'POST'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  }));

// Routes
app.use('/api', newsRoutes);

// Database Connection
connectDB();

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
