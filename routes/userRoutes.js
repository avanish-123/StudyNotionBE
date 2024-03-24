const express = require('express');
// const upload =  require('multer')();
const { sendOTP, signUp, login, changePassword } = require('../controllers/Auth');
const { isAuth, isAdmin, isInstructor } = require('../middlewares/auth');
const { resetPasswordtoken, resetPassword } = require('../controllers/ResetPassword');
const { createCategory, getAllCategory } = require('../controllers/Category');
const { createCourse } = require('../controllers/Course');
const { createSection, updateSection, deleteSection } = require('../controllers/Section');
const router = express.Router();

router.post('/sendotp', sendOTP);
router.post('/signup', signUp);
router.post('/login', login);
router.post('/changepassword', isAuth,changePassword)
router.post('/resetpasswordtoken', resetPasswordtoken)
router.post('/resetpassword', resetPassword)
router.post('/createcategories', isAuth, isAdmin, createCategory)
router.get('/getallcategories', isAuth, getAllCategory)
router.post('/createcourse',isAuth,isInstructor, createCourse)
router.post('/createsection', isAuth, isInstructor, createSection)
router.post('/updatesection', isAuth, isInstructor, updateSection)
router.post('/deletesection', isAuth, isInstructor, deleteSection)

module.exports = router