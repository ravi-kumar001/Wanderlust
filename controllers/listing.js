const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const MY_ACCESS_TOKEN = process.env.MAP_BOX_ACCESS_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: MY_ACCESS_TOKEN });


module.exports.indexRoute = wrapAsync(async (req, res) => {
    const allList = await Listing.find({});
    res.render("./listings/index.ejs", { allList });
});

module.exports.newRoute = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.addNewListings = wrapAsync(async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send()

    // console.log(response.body.features[0].geometry);

    
    let url = req.file.path;
    let filename = req.file.filename;
    const list = new Listing(req.body.listing);
    list.image = { url, filename };
    list.owner = req.user._id;

    list.geometry = response.body.features[0].geometry;

    await list.save();
    req.flash("success", "Listing added successfully !")
    res.redirect("/listings");
}
);

module.exports.showRoute = wrapAsync(async (req, res) => {
    const { id } = req.params;
    // const listing = await Listing.findById(id).populate("reviews").populate("owner");
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing doesn't exist !");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
});

module.exports.editRoute = wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing doesn't exist !");
        res.redirect("/listings");
    }
    let originalImage = listing.image.url;
    let newImageUrl = originalImage.replace("/upload", "/upload/c_scale,h_100,w_150")
    res.render("./listings/edit.ejs", { listing, newImageUrl });
});

module.exports.updateRoute = wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(404, "Send valid data for listing");
    }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof (req.file) !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing update successfully !");
    res.redirect(`/listings/${id}`);
});

module.exports.deleteRoute = wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing deleted successfully !")
    res.redirect("/listings");
});