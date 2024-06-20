const express = require("express");
const { Getails, getNewsById, createNews, updateNews, deleteNews } = require("../controllers/newsController");
const multer = require('multer');
const path = require('path');

const route = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

route.get("/get_news", Getails);
route.get("/get_news/:id", getNewsById);
route.post("/create_news", upload.single('image'), createNews);
route.post("/get_news/update/:id", upload.single('image'), updateNews);
route.post("/get_news/delete/:id", deleteNews);

module.exports = route;
