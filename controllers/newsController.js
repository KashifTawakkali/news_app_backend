// const News = require('../models/newsModel');

// // POST API: Add a news item
// exports.addNews = async (req, res) => {
//     try {
//         const { title, description, url, image } = req.body;

//         // Validate required fields
//         if (!title || !description || !url || !image) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         // Check if image is a valid URL
//         const isValidUrl = (str) => {
//             try {
//                 const urlObj = new URL(str);
//                 return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'; // Ensure it's a proper URL
//             } catch (err) {
//                 return false;
//             }
//         };

//         // If image URL is invalid, return error
//         if (!isValidUrl(image)) {
//             return res.status(400).json({ message: 'Invalid image URL' });
//         }

//         // Create and save news item
//         const newsItem = new News({ title, description, url, image });
//         await newsItem.save();

//         res.status(201).json({ message: 'News item added successfully', newsItem });
//     } catch (err) {
//         console.error('Error adding news:', err.message);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// // GET API: Retrieve all news items
// exports.getNews = async (req, res) => {
//     try {
//         const news = await News.find();
//         res.status(200).json(news);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ message: 'Server error' });
//     }
// };




const News = require('../models/newsModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

// Ensure the uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.memoryStorage();  // Store files in memory instead of disk

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // Max file size: 5MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only .jpeg, .jpg, or .png files are allowed'));
        }
    },
}).single('image'); // Expect single image with the key 'image'

// POST API: Add a news item
exports.addNews = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const { title, description, url } = req.body;

            // Validate required fields
            if (!title || !description || !url) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Ensure an image is uploaded
            if (!req.file) {
                return res.status(400).json({ message: 'Image is required' });
            }

            // Convert image buffer to Base64 string
            const base64Image = req.file.buffer.toString('base64');

            // Construct image URL (optional, depending on your requirements)
            const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;

            // Create and save the news item
            const newsItem = new News({
                title,
                description,
                url,
                image: imageUrl, // Save the Base64 image string
            });

            await newsItem.save();

            res.status(201).json({ message: 'News item added successfully', newsItem });
        } catch (err) {
            console.error('Error adding news:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    });
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

// Serve static files from the 'uploads' directory for image access (optional)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
