const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req);
    // console.log(req.originalUrl);
    // console.log(req.user);

    if (!req.isAuthenticated()) {
        res.locals.redirectUrl = req.originalUrl;
        req.flash("error", "You must to be logged in !");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    // console.log(result);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
};
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    // console.log(result);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id,reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not owner of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};