const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.showReviewRoute = wrapAsync(async (req, res) => {
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReviews = new Review(req.body.review);
    newReviews.author = req.user._id;
    // console.log(newReviews);
    listing.reviews.push(newReviews);
    await newReviews.save();
    await listing.save();
    req.flash("success", "Review added successfully !")
    res.redirect(`/listings/${req.params.id}`);
});

module.exports.deleteReviewRoute = wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully !")
    res.redirect(`/listings/${id}`);
})