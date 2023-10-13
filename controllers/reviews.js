const Review = require('../models/review');
const Campground = require ('../models/campground');

module.exports.createReview = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);

    if (!req.body.review) throw new ExpressErrors ('No valid Entries', 400);

    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push (review);
    await campground.save();
    await review.save();
    req.flash('success', 'Thanks for the review!');
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteReview = async (req, res) => {
   
    const {id, reviewID} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Review Deleted');
    res.redirect(`/campgrounds/${id}`);
}