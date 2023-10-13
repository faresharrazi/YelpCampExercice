const Campground = require("./models/campground");
const Review = require('./models/review');

const {reviewSchema} = require ('./schemas');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login');
    }
    next ();
}

module.exports.storeReturnTo = (req, res, next) => {
    
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
   
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)){
        req.flash('error', 'Permission Denied');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isRevAuthor = async (req, res, next) => {
    const { id, reviewID } = req.params;
    const review = await Review.findById(reviewID);
    
    if (!review.author.equals(req.user._id)){
        req.flash('error', 'Permission Denied');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
       
        throw new ExpressErrors(msg, 413)
    } else {
        next();
    }
}