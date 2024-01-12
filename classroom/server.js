const express = require("express");
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const path = require("path");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// app.use(session({
//     secret: 'mysupersecretestring',
//     resave: false,
//     saveUninitialized: true
// }));


const sessionOptions = {
    secret: 'mysupersecretestring',
    resave: false,
    saveUninitialized: true
}
app.use(session(sessionOptions));
app.use(flash());


app.use((req,res,next)=>{
    res.locals.successMsg = req.flash('success');
    res.locals.errorMsg = req.flash('error');
    next();
})


app.get("/register", (req, res) => {
    let { name = "Ravi" } = req.query;
    req.session.name = name;
    if (name === "Ravi") {
        req.flash("error", "not name is sent");
    } else {
        req.flash('success', 'name fatched successful');
    }
    res.redirect("/hello");
});





app.get("/hello", (req, res) => {
    // console.log(req.session.name);
    // res.send(`Hi ${req.session.name}`);
   
    // res.render("page.ejs", { name: req.session.name, msg: req.flash('info') });
    res.render("page.ejs", { name: req.session.name });
});


app.get("/test", (req, res) => {
    res.send("session id created");
});
app.get("/reqcount", (req, res) => {
    if (req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send(`You sent a request ${req.session.count} times`);
})
app.listen(3000, () => {
    console.log("App is starting on port 3000");
})