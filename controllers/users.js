const User = require ('../models/user');

module.exports.registerUser = async (req, res, next) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registredUser = await User.register(user, password);
        req.login(registredUser, err => {
            if (err) return next(err);
            const { user } = req.session.passport;

            req.flash('success', `Welcome to Yelp Campgrounds ${user} !`);
            res.redirect('/campgrounds');
        })
        
    }
    catch (e){
        req.flash('error', e.message);
        res.redirect('register');
    }    
}

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.loginPage = (req, res) => {
    res.render('users/login')
}

module.exports.userAuth = (req, res) => {
    const { user } = req.session.passport;
    req.flash('success', `Welcome Back ${user}`);
    const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
    res.redirect(redirectUrl);
   
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}