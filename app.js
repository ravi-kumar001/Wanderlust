const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path")
const app = express();
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
app.use(methodOverride('_method'));
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");


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
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    // console.log(result);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    // console.log(result);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
}

app.get("/", (req, res) => {
    res.send("This is Home root...");
});
// app.get("/testing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "my new villa",
//         description: "by the beach",
//         price: 1200,
//         location: "Chicago , America"
//     })
//     await sampleListing.save();
//     console.log("data is saved")
//     res.send("Data is saved");
// })

app.get("/listings", wrapAsync(async (req, res) => {
    const allList = await Listing.find({});
    res.render("./listings/index.ejs", { allList });
}));

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    // let {title,description,image,price,country} = req.body;
    // const result = listingSchema.validate(req.body);
    // console.log(result);
    // if (!req.body.listing) {
    //     throw new ExpressError(404, "Send valid data for listing");
    // }
    const list = new Listing(req.body.listing);
    // if (result.error) {
    //     throw new ExpressError(404, result.error);
    // }
    // if (!list.title) {
    //     throw new ExpressError(404, "Title is missing");
    // }
    // if (!list.price) {
    //     throw new ExpressError(404, "Price is missing");
    // }
    // if (!list.description) {
    //     throw new ExpressError(404, "Description is missing");
    // }

    await list.save();
    res.redirect("/listings");
}
))

app.get("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { listing });
}));

// Edit and update
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
}));
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(404, "Send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

// Delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}));

// Reviews show Route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReviews = new Review(req.body.review);
    listing.reviews.push(newReviews);
    await newReviews.save();
    await listing.save();
    res.redirect(`/listings/${req.params.id}`);
}));

// Review Delete Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))


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