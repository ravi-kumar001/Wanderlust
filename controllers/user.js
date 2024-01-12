const User = require('../models/user');
const wrapAsync = require("../utils/wrapAsync");


module.exports.postSignUpRoute = wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => { // this function automatically login after sign up
            if (err) {
                return next(err);
            }
            // console.log(registeredUser);
            req.flash("success", "Welcome to Wanderlust !");
            res.redirect("/listings");
        })
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
});

module.exports.postLoginRoute = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust !");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logoutRoute = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logged out !");
        res.redirect("/listings");
    })
};