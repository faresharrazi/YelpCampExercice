const express = require ('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utilities/catchAsync');

const ExpressErrors = require ('../utilities/expressErrors');

const {reviewSchema} = require ('../schemas');

const Campgound = require ('../models/campground');
const Review = require ('../models/review');

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
       
        throw new ExpressErrors(msg, 413)
    } else {
        next();
    }
}

router.post ('/', validateReview, catchAsync(async (req, res) => {
    // res.send ('You made it!')
    // console.log(req.body)
    // const { review } = req.body
    // console.log(review)
    const {id} = req.params;
    const campground = await Campgound.findById(id);

    if (!req.body.review) throw new ExpressErrors ('No valid Entries', 400);

    const review = new Review(req.body.review);
    campground.reviews.push (review);
    await campground.save();
    await review.save();
    req.flash('success', 'Thanks for the review!');
    res.redirect(`/campgrounds/${id}`)
}))

//Deleting a review 

router.delete ('/:reviewID', catchAsync(async (req, res) => {
   
    const {id, reviewID} = req.params;
    await Campgound.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Review Deleted');
    res.redirect(`/campgrounds/${id}`);

    
}))

module.exports = router;