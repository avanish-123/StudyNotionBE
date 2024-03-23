const express = require('express');
// const upload =  require('multer')();
const { sendOTP, signUp, login, changePassword } = require('../controllers/Auth');
const { isAuth, isAdmin, isInstructor } = require('../middlewares/auth');
const { resetPasswordtoken, resetPassword } = require('../controllers/ResetPassword');
const { createTag, getAllTags } = require('../controllers/Tags');
const { createCourse } = require('../controllers/Course');
const router = express.Router();

router.post('/sendotp', sendOTP);
router.post('/signup', signUp);
router.post('/login', login);
router.post('/changepassword', isAuth,changePassword)
router.post('/resetpasswordtoken', resetPasswordtoken)
router.post('/resetpassword', resetPassword)
router.post('/createtags', isAuth, isAdmin, createTag)
router.get('/getalltags', isAuth, getAllTags)
router.post('/createcourse',isAuth,isInstructor, createCourse)

module.exports = router