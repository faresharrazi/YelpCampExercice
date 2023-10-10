const express = require ('express');
const path = require('path');
const mongoose = require ('mongoose');
const methodOverride = require ('method-override');

const session = require ('express-session');
const flash = require('connect-flash');

const { campgroundSchema, reviewSchema} = require ('./schemas');
const Campgound = require ('./models/campground');
const Review = require ('./models/review');
const ejsMate = require ('ejs-mate');
const Joi = require ('joi');

const ExpressErrors = require ('./utilities/expressErrors');

const campgrounds = require ('./routes/campground');
const reviews = require ('./routes//reviews');

const passport = require('passport');
const localStrategy = require('passport-local');

mongoose.connect ('mongodb://127.0.0.1:27017/yelp-camp')
    // userNewUrlParser: true, 
    // UseCreateIndex: true,
    // UseUnifiedTopology: true
    //useFindAndModify: false

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database connected')
});

const app = express ();

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration

const sessionsConfig = {
    secret: 'thisshouldbeabttersecret!',
    resave: false,
    saveUninitialized: true, 
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionsConfig));

// flash

app.use(flash());

// Setting up the flash middleware before any other route

app.use ((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// So you can extract req.body inside the app.post
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// Setting up the routes

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

// Serving Static Assets

app.use(express.static(path.join(__dirname, 'public')));

// Setting up Passport

app.use(passport.initialize());
app.use(passport.session()); //We use this middleware for persistent login sessions, we should make sure that this is used after the app.use(session(sessionsConfig));

// --------------------------- //



app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next (new ExpressErrors ('Page Not Found !', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong my friend'} = err;
    res.status(statusCode).render('partials/error', {err})
   
})

app.listen(3000, () => {
    console.log('Serving on port 3000...')
})