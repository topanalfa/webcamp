// semua middleware ditaruh di sini
var Campground  = require("../models/campground"),
    Comment     = require("../models/comment");
const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Anda tidak boleh edit info camp pengguna lain");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be signed in to do that!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                // check apa si user punya komentarnya
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Anda tidak boleh edit comment pengguna lain");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be signed in to do that!");
        res.redirect("back");
    }
}

// middleware buat check login
middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Anda harus login dulu gan");
    res.redirect("/login");
}

module.exports = middlewareObj;