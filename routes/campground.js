const express = require ('express');
const router = express.Router();

const multer  = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage })

const campgrounds = require('../controllers/campgrounds');

const catchAsync = require('../utilities/catchAsync');

const ExpressErrors = require ('../utilities/expressErrors');

const Campground = require ('../models/campground');

const { campgroundSchema} = require ('../schemas');

const {isLoggedIn, isAuthor}  = require('../middleware');

const User = require ('../models/user');
const passport = require('passport');

router.route('/')
    .get (catchAsync(campgrounds.index))
    .post(
        isLoggedIn,
        upload.array('images'),  
        catchAsync (campgrounds.createCampground)
        )

// Form for New Campground 
router.get('/new', 
isLoggedIn, 
campgrounds.renderNewForm
)

router.route('/:id')
    .get(catchAsync (campgrounds.showCamps))
    .put(
        isLoggedIn, 
        isAuthor,
        upload.array('images'),
        catchAsync(campgrounds.editCampground)
        )
    .delete(
        isLoggedIn, 
        isAuthor, 
        catchAsync (campgrounds.deleteCamps)
        )

// Form to edit campgrounds
router.get('/:id/edit',
isLoggedIn, 
isAuthor, 
catchAsync (campgrounds.renderEditForm)
)

module.exports = router;