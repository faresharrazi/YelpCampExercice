const express = require ('express');
const router = express.Router();

const catchAsync = require('../utilities/catchAsync');

const ExpressErrors = require ('../utilities/expressErrors');

const Campgound = require ('../models/campground');
const { campgroundSchema} = require ('../schemas');

router.get('/', async (req, res) => {
    const campground = await Campgound.find({});
    res.render('./campgrounds/index', {campground})
})

// Form for New Campground 

router.get('/new', (req, res) => {
    res.render('./campgrounds/new')
})

router.post('/', catchAsync (async (req, res, next) => {

// In order for the req.body to work you need
// router.use(express.urlencoded({extended: true}));
// Already done  
    if (!req.body.campground) throw new ExpressErrors ('No valid Entries', 400);

    const campground = new Campgound(req.body.campground);
    await campground.save();

    req.flash('success', 'Successfully made a new Campground');

    res.redirect(`/campgrounds/${campground._id}`)
   
}))

// Form to edit campgrounds
router.get('/:id/edit', catchAsync (async (req, res) => {
    console.log("here");
    const {id} = req.params;
    const campground = await Campgound.findById(id);
    if (!campground) {
       
        req.flash('error', 'Cannot find Campground');
        return res.redirect('/campgrounds');
    }
    res.render('./campgrounds/edit', {campground})
}))

router.put('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campgound.findByIdAndUpdate(id, {...req.body.campground});
    if (!campground) {
       
        req.flash('error', 'Cannot find Campground');
        return res.redirect('/campgrounds');
    }
    req.flash('success', 'Successfully Updated the Campground');
    res.redirect(`/campgrounds/${campground._id}`);
}))


//Show Campground by ID

router.get('/:id', catchAsync (async (req, res) => {
    const {id} = req.params;
    const campground = await Campgound.findById(id).populate('reviews');
    if (!campground) {
        
        req.flash('error', 'Cannot find Campground');
        return res.redirect('/campgrounds');
    }

    res.render('./campgrounds/show', {campground})
}))

// Deleting Campground
router.delete('/:id', catchAsync (async (req, res) => {
    const {id} = req.params;
    const campground = await Campgound.findByIdAndDelete(id);
    if (!campground) {
       
        req.flash('error', 'Cannot find Campground');
        return res.redirect('/campgrounds');
    }
    req.flash('success', 'Campground Deleted');
    res.redirect('/campgrounds');
}))


module.exports = router;