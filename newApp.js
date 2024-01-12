// This js file after Restructuring of all express router

if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}
// console.log(process.env.name) 

const express = require("express");
const mongoose = require("mongoose");
const path = require("path")
const app = express();
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
app.use(methodOverride('_method'));
const ExpressError = require("./utils/ExpressError.js");
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require('./models/user');
const dbUrl = process.env.ATLAS_URL;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    // crypto: {
    //     secret: "mysecretcode"
    // },
    crypto: {
        secret: process.env.SECRET_CODE
    },
    touchAfter: 24 * 3600  // for lazy Update
});
store.on("error", () => {
    console.log("error in mongo session store", err);
})

const sessionOptions = {
    store,
    // secret: 'mysupersecretestring',
    secret: process.env.SECRET_CODE,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions));
app.use(flash());
// app.use(cookieParser());
app.use(cookieParser("secretcode"));


// Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.listen(3000, () => {
    console.log("App is started on port 3000");
});

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));



main().then((res) => {
    console.log("Connection successful");
}).catch(err => console.log(err));




async function main() {
    await mongoose.connect(dbUrl);
}


// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
// }

// app.get("/", (req, res) => {
//     res.send("This is Home root...");
// });

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.currUser);
    // console.log(res.locals.success);
    next();
})
// Set our cookies
// app.get("/getcookies", (req, res) => {
//     res.cookie("Name", "Ravi");
//     res.cookie("country", "India");
//     res.send("We sent a cookies for you");
// })

// app.get("/registeruser", async (req, res) => {
//     let fakeUser = new User({
//         email: "fake@gamil.com",
//         username: "Ravi Kumar"
//     })
//     let newUser = await User.register(fakeUser, "hello");
//     res.send(newUser);
// })





// use method is using for restructuring of all review route
app.use("/listings", listingRoute);


// use method is using for restructuring of all review route
app.use("/listings/:id/reviews", reviewRoute);

// use method is using for restructuring of all user route
app.use(userRoute);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})
// costom error middleware
app.use((err, req, res, next) => {
    // console.dir(err);
    let { status = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(status).render("./listings/error.ejs", { message });
})