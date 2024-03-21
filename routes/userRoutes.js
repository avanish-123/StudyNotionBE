const express = require('express');
const { sendOTP, signUp, login, changePassword } = require('../controllers/Auth');
const { isAuth, isAdmin } = require('../middlewares/auth');
const router = express.Router();

router.post('/sendotp', sendOTP);
router.post('/signup', signUp);
router.post('/login', login);
router.post('/changepassword', isAuth,isAdmin,changePassword)

module.exports = router