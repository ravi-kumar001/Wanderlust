const express = require("express");
const router = express.Router();

// const wrapAsync = require("../utils/wrapAsync.js");
// const Listing = require("../models/listing.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listing.js");

const multer = require('multer')

const storage = require("../cloudConfig.js")
const upload = multer(storage);
// const upload = multer({ dest: 'uploads/' });



// const validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body);
//     // console.log(result);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(404, errMsg);
//     } else {
//         next();
//     }
// }

// index route
router.get("/", listingController.indexRoute);



// New Route
router.get("/new", isLoggedIn, listingController.newRoute);

// Add New Listings
// router.post("/", isLoggedIn,  validateListing, listingController.addNewListings);
router.post("/", isLoggedIn, upload.single('listing[image]'), validateListing, listingController.addNewListings);
//using multer
// router.post("/", upload.single('listing[image]'), (req, res) => {
//     res.send(req.file);
// });


// show route
router.get("/:id", listingController.showRoute);

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, listingController.editRoute);

// Router.route method
router.route("/:id")
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, listingController.updateRoute)
    .delete(isLoggedIn, isOwner, listingController.deleteRoute);

// Update Route
// router.put("/:id", validateListing, listingController.updateRoute);

// Delete route
// router.delete("/:id", isLoggedIn, isOwner, listingController.deleteRoute);

module.exports = router;