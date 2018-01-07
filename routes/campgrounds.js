var express = require("express"),
    router  = express.Router();

var Campground = require("../models/campground");
var middleware = require("../middleware");
var geocoder = require('geocoder');
    
// route for all campgrounds
router.get("/", function(req, res){
    // get all campground from DB
    Campground.find({}, function(err, camp){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{ngeCamp: camp, page: 'campgrounds'});
        }
    })
    // res.render("campgrounds",{ngeCamp: campgrounds});
});

// route for show the form
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// route for add new camp
router.post("/", middleware.isLoggedIn, function (req, res) {
    // get data from form
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
        // post ke database
        Campground.create(newCampground, function(err, newlyCreated){
            if(err){
                console.log(err);
            } else {
                console.log(newlyCreated);
                req.flash("success", "Info Camp berhasil dibuat");
                // redirect page 
                res.redirect("/campgrounds");
            }
        });
    });
});

// SHOW route for show a campground per item
router.get("/:id", function(req, res) {
    // find items by id
    Campground.findById(req.params.id).populate("comments").exec(function(err, ketemuCamp) {
        if (err) {
            console.log(err);
        } else {
            console.log(ketemuCamp);
            res.render("campgrounds/show", {camp: ketemuCamp});
        }
    });
});

// route untuk edit campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// route untuk update campground
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    // cari id campground yg bener
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
            if (err) {
                res.redirect("/campgrounds");
            } else {
                req.flash("success", "Info Camp berhasil diubah");
                res.redirect("/campgrounds/"+req.params.id);
            }
        });
    });
});

// route buat delete camps
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
})

module.exports = router;