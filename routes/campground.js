const express = require ('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');

const catchAsync = require('../utilities/catchAsync');

const ExpressErrors = require ('../utilities/expressErrors');

const Campground = require ('../models/campground');

const { campgroundSchema} = require ('../schemas');

const {isLoggedIn, isAuthor}  = require('../middleware');

const User = require ('../models/user');
const passport = require('passport');

// Campground Index
router.get('/', catchAsync(campgrounds.index));

// Form for New Campground 
router.get('/new', isLoggedIn, campgrounds.renderNewForm);
router.post('/', isLoggedIn,  catchAsync (campgrounds.createCampground))

// Form to edit campgrounds
router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync (campgrounds.renderEditForm))
router.put('/:id',isLoggedIn, isAuthor, catchAsync(campgrounds.editCampground))

//Show Campground by ID
router.get('/:id', catchAsync (campgrounds.showCamps));

// Deleting Campground
router.delete('/:id',isLoggedIn, isAuthor, catchAsync (campgrounds.deleteCamps))

module.exports = router;