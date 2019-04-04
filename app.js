const campground = require("./src/models/campground");
const comment = require("./src/models/comments");
const methodOverride = require("method-override");
const passportLocal = require("passport-local");
const User = require("./src/models/user");
const connectFlash = require("connect-flash");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const express = require("express");
const seedDB = require("./seeds");
const app = express();
    
    
// require ROUTES
const campgroundRoutes = require("./src/routes/campgrounds"),
const commentRoutes = require("./src/routes/comments"),
const authRoutes = require("./src/routes/auth");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
// seedDB(); // seed the data but now add data manually
app.use(methodOverride("_method"));
app.use(connectFlash());

mongoose.connect("mongodb://localhost/Kode_Camp_v52");
// mongoose.connect("mongodb://localhost/Kode_Camp_v41", function(){
//     /* Drop the DB */
//     mongoose.connection.db.dropDatabase();
// });

app.use(require("express-session")( {
  secret: "I love Programming.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// req.user gives username and id
// req.user contains the authenticated user.
// ie it contains the information of currently logged in user
// this function makes available req.user in each and every route
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// always use ROUTES after the above req.user function
// beacause these routes uses the currentUser requests
// use ROUTES
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);

// app.use("/campgrounds",campgroundRoutes);
// app.use("/campgrounds/:id/comment",commentRoutes);
// app.use("/",authRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
  console.log("KodeCamp Server has started...");
});