// set variable dari module yang diperlukan
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose");
    
// set variable dari model datbases
var Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");
    
// set variable untuk route yang digunakan
var commentRoutes       = require("./routes/comments"),
    campgroundsRoutes   = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

// setting port dan ip server
var port = process.env.PORT;
var ip = process.env.IP;
var dburl = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
// set koneksi mongoDB database
mongoose.connect(dburl, {useMongoClient: true});
// mongoose.connect("mongodb://admin:admindb@ds255347.mlab.com:55347/webcamp", {useMongoClient: true});
// mongodb://admin:admindb@ds255347.mlab.com:55347/webcamp
// set bodyparser template
app.use(bodyParser.urlencoded({extended: true}));

/*set engine template*/
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); 
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "kucing jatimulya keren2",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware check currentUser
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error  = req.flash("error");
    res.locals.success  = req.flash("success");
    next();
})

app.use(indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(port, ip, function () {
   console.log("The YelpCamp Server has started");
});