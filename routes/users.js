const express = require ('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const users = require('../controllers/users');

const User = require ('../models/user');
const passport = require('passport');

const {storeReturnTo}  = require('../middleware');

router.route('/register')    
    .get(users.renderRegisterForm)
    .post(catchAsync (users.registerUser))

router.route('/login')
    .get(users.loginPage)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.userAuth)

router.get('/logout', users.logoutUser); 

module.exports = router;
