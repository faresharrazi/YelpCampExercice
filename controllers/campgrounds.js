const Campground = require('../models/campground');
const mbxGeocoding = require ("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.index = async (req, res) => {
    const campground = await Campground.find({});
    res.render('./campgrounds/index', {campground})
}

module.exports.renderNewForm = (req, res) => {
    res.render('./campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    // In order for the req.body to work you need
    // router.use(express.urlencoded({extended: true}));
    // Already done  
    if (!req.body.campground) throw new ExpressErrors ('No valid Entries', 400);
      
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
      }).send()

    const campground = new Campground(req.body.campground);
    console.log(geoData.body.features[0].geometry);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    console.log(campground); 
    await campground.save();
    req.flash('success', 'Successfully made a new Campground');
    res.redirect(`/campgrounds/${campground._id}`)
    }

module.exports.showCamps = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
        
    if (!campground) {
            
        req.flash('error', 'Cannot find Campground');
        return res.redirect('/campgrounds');
    }
    let connectedUser = null;
    if (req.user){
        connectedUser = req.user;
    }
   
    res.render('./campgrounds/show', {campground, connectedUser})
}

module.exports.deleteCamps = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    if (!campground) {
       
        req.flash('error', 'Cannot find Campground');
        return res.redirect('/campgrounds');
    }
    req.flash('success', 'Campground Deleted');
    res.redirect('/campgrounds');
}

module.exports.renderEditForm = async (req, res) => {
    console.log("here");
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
       
        req.flash('error', 'Cannot find Campground');
        return res.redirect('/campgrounds');
    }
    res.render('./campgrounds/edit', {campground})
}

module.exports.editCampground = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if (!campground) {
       
        req.flash('error', 'Cannot find Campground');
        return res.redirect('/campgrounds');
    }
    req.flash('success', 'Successfully Updated the Campground');
    res.redirect(`/campgrounds/${campground._id}`);
}