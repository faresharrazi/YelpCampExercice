const express = require ('express');
const router = express.Router({mergeParams: true});
const reviews = require('../controllers/reviews');

const catchAsync = require('../utilities/catchAsync');

const ExpressErrors = require ('../utilities/expressErrors');

const Campgound = require ('../models/campground');
const Review = require ('../models/review');

const { isLoggedIn, validateReview, isRevAuthor } = require('../middleware');

//Creating a review 

router.post ('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

//Deleting a review 

router.delete ('/:reviewID', isLoggedIn, isRevAuthor, catchAsync(reviews.deleteReview));

module.exports = router;