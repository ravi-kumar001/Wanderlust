const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
// const { reviewSchema } = require("../schema.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js")


const reviewController = require("../controllers/review.js");

// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     // console.log(result);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(404, errMsg);
//     } else {
//         next();
//     }
// }

// Reviews show Route
router.post("/", isLoggedIn, validateReview,reviewController.showReviewRoute);

// Review Delete Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviewController.deleteReviewRoute);
module.exports = router;