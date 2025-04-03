const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middleware/upload');
const auth = require('../utils/auth');
const multer = require('multer');
const path = require('path');


router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/me', auth, authController.getCurrentUser);

module.exports = router;