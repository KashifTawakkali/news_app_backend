const News = require('../models/newsModel');

// POST API: Add a news item
exports.addNews = async (req, res) => {
    try {
        const { title, description, url, image } = req.body;

        // Validate required fields
        if (!title || !description || !url || !image) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if image is a valid URL or Base64
        const isValidUrl = (str) => {
            try {
                new URL(str);
                return true;
            } catch (err) {
                return false;
            }
        };

        if (!isValidUrl(image)) {
            return res.status(400).json({ message: 'Invalid image URL' });
        }

        // Create and save news item
        const newsItem = new News({ title, description, url, image });
        await newsItem.save();

        res.status(201).json({ message: 'News item added successfully', newsItem });
    } catch (err) {
        console.error('Error adding news:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};


// GET API: Retrieve all news items
exports.getNews = async (req, res) => {
    try {
        const news = await News.find();
        res.status(200).json(news);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
