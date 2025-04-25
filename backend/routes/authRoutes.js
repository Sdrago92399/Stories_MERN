const express = require('express');
const { login, signup, confirmEmail, loginWithToken } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/token', loginWithToken);
router.get('/confirm-email', confirmEmail);

module.exports = router;