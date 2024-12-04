require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const newsRoutes = require('./routes/newsRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', newsRoutes);

// Database Connection
connectDB();

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
