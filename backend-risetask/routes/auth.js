// routes/auth.js
const express = require('express');
const router = express.Router();

// Controller import
const { signup, login } = require('../controllers/authController');

// Routes
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
