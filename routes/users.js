const express = require ('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const users = require('../controllers/users');

const User = require ('../models/user');
const passport = require('passport');

const {storeReturnTo}  = require('../middleware');

// Render the registration form
router.get('/register', users.renderRegisterForm)
router.post('/register' , catchAsync (users.registerUser))

// Render the login page
router.get('/login', users.loginPage)
router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.userAuth)

router.get('/logout', users.logoutUser); 

module.exports = router;
