const express = require('express');
const { addNews, getNews } = require('../controllers/newsController');

const router = express.Router();

// POST API: Add a news item
router.post('/news', addNews);

// GET API: Retrieve all news items
router.get('/news', getNews);

module.exports = router;
