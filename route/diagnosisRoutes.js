const express = require('express');
const { createHistory, getHistoryById } = require('../controllers/diagnosisController');
const route = express.Router();

route.post('/get_history', createHistory);
route.get('/get_history/:id', getHistoryById);

module.exports = route;
