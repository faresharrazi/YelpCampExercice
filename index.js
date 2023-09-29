const express = require ('express');
const path = require('path');
const mongoose = require ('mongoose');
const methodOverride = require ('method-override');
const Campgound = require ('./models/campground');
const ejsMate = require ('ejs-mate');

const catchAsync = require('./utilities/catchAsync');
const ExpressErrors = require ('./utilities/expressErrors');

mongoose.connect ('mongodb://127.0.0.1:27017/yelp-camp')
    // userNewUrlParser: true, 
    // UseCreateIndex: true,
    // UseUnifiedTopology: true

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database connected')
});

const app = express ();

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// So you can extract req.body inside the app.post
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campgrounds', async (req, res) => {
    const campground = await Campgound.find({});
    res.render('campgrounds/index', {campground})
})



// Form for New Campground 

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', catchAsync (async (req, res, next) => {

// In order for the req.body to work you need
// app.use(express.urlencoded({extended: true}));
// Already done  
    if (!req.body.campground) throw new ExpressErrors ('No valid data', 400);

    const campground = new Campgound(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
   
}))

// Form to edit campgrounds
app.get('/campgrounds/:id/edit', catchAsync (async (req, res) => {
    const {id} = req.params;
    const campground = await Campgound.findById(id);
    res.render('campgrounds/edit', {campground})
}))

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campgound.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
}))


//Show Campground by ID

app.get('/campgrounds/:id', catchAsync (async (req, res) => {
    const {id} = req.params;
    const campground = await Campgound.findById(id);
    res.render('campgrounds/show', {campground})
}))

// Deleting Campground
app.delete('/campgrounds/:id', catchAsync (async (req, res) => {
    const {id} = req.params;
    const campground = await Campgound.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.all('*', (req, res, next) => {
    next (new ExpressErrors ('Page Not Found !', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong my friend'} = err;
    res.status(statusCode).send(message);
   
})

app.listen(3000, () => {
    console.log('Serving on port 3000...')
})