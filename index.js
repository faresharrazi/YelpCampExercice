if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require ('express');
const path = require('path');
const mongoose = require ('mongoose');
const methodOverride = require ('method-override');

const session = require ('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');

const Campground = require ('./models/campground');
const Review = require ('./models/review');
const User = require('./models/user');

const { campgroundSchema, reviewSchema} = require ('./schemas');
const ejsMate = require ('ejs-mate');
const Joi = require ('joi');

const ExpressErrors = require ('./utilities/expressErrors');

const campgroundRoutes = require ('./routes/campground');
const reviewRoutes = require ('./routes//reviews');
const userRoutes = require ('./routes/users');

const passport = require('passport');
const localStrategy = require('passport-local');

// Atlas DataBase: 
const dbUrl = process.env.DB_URL;
const secret = process.env.SECRET;

// const dbUrl = 'mongodb://127.0.0.1:27017/yelp-camp';

mongoose.connect (dbUrl)
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

// Configuring Connect-Mongo 

const store = MongoStore.create ({
    mongoUrl: dbUrl,
    touchAfter: 24*3600,
    crypto: {
        secret
    }
});

store.on("error", function(e) {
    console.log("STORE SESSION ERROR");
})

// Session configuration

const sessionsConfig = {
    store,
    secret,
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

// Setting up local variables middleware before any other route

app.use ((req, res, next) => {
    res.locals.currentUser  = req.session.passport;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
    
})



// So you can extract req.body inside the app.post
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// Serving Static Assets

app.use(express.static(path.join(__dirname, 'public')));

// Setting up Passport

app.use(passport.initialize());
app.use(passport.session()); //We use this middleware for persistent login sessions, we should make sure that this is used after the app.use(session(sessionsConfig));
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Setting up the routes

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);



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

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving on port ${port}...`)
})