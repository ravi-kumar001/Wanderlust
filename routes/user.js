const express = require("express");
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


// Our controllers
const userController = require("../controllers/user.js");

// router.get("/signup", (req, res) => {
//     res.render("./users/signup.ejs")
// });

// router.post("/signup", userController.postSignUpRoute);

// Router.route path
router.route("/signup")
    .get((req, res) => {
        res.render("./users/signup.ejs")
    })
    .post(userController.postSignUpRoute);


router.get("/login", (req, res) => {
    res.render("./users/login.ejs");
});

// router.post("/login", saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.postLoginRoute);

router.get("/logout", userController.logoutRoute);

// Router.route path
router.route("/login")
    .post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.postLoginRoute)
    .get(userController.logoutRoute);
module.exports = router;