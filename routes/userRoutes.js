const express = require('express');
// const upload =  require('multer')();
const { sendOTP, signUp, login, changePassword } = require('../controllers/Auth');
const { isAuth, isAdmin, isInstructor } = require('../middlewares/auth');
const { resetPasswordtoken, resetPassword } = require('../controllers/ResetPassword');
const { createCategory, getAllCategory } = require('../controllers/Category');
const { createCourse } = require('../controllers/Course');
const { createSection, updateSection, deleteSection } = require('../controllers/Section');
const { createSubSection, updateSubSection, deleteSubSection } = require('../controllers/SubSection');
const { updateProfile, deleteAccount } = require('../controllers/Profile');
const router = express.Router();

router.post('/sendotp', sendOTP);
router.post('/signup', signUp);
router.post('/login', login);
router.post('/changepassword', isAuth,changePassword);
router.post('/resetpasswordtoken', resetPasswordtoken);
router.post('/resetpassword', resetPassword);
router.post('/createcategories', isAuth, isAdmin, createCategory);
router.get('/getallcategories', isAuth, getAllCategory);
router.post('/createcourse',isAuth,isInstructor, createCourse);
router.post('/createsection', isAuth, isInstructor, createSection);
router.post('/updatesection', isAuth, isInstructor, updateSection);
router.post('/deletesection', isAuth, isInstructor, deleteSection);
router.post('/createsubsection', isAuth, isInstructor, createSubSection);
router.post('/updatesubsection', isAuth, isInstructor, updateSubSection)
router.post('/deletesubsection', isAuth, isInstructor, deleteSubSection)
router.post('/updateprofile', isAuth, updateProfile)
router.post('/deleteaccount', isAuth, deleteAccount)

module.exports = router