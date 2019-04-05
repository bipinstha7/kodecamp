const User = require("../models/user"),
const passport = require("passport"),
const express = require("express"),
const router = express.Router(),
const Campground = require("../models/campground");

// AUTH ROUTE 

// show sign up form
router.get("/register", isLoggedInAlready, function(req, res) {
  res.render("register");
});

// handling sign up form and data
router.post("/register", isLoggedInAlready, function(req, res) {
  var newUser = new User(
    {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      avatar: req.body.avatar
    });
  if(req.body.adminCode === 'secretcode123') {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, function(err, user) {
    if(err) {
      // console.log(err);
      req.flash("error", err.message);
      return res.redirect("/register");
      // with res.render("register"), we have to click the submit button twice to get the flash
    }
      passport.authenticate("local")(req, res, function() {
      req.flash("success", "Welcome to the KodeCamp " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

// show login form
router.get("/login", isLoggedInAlready, function(req, res) {
  res.render("login");
});

// handling login form and data
// app.post("/login", middleware, callback)
router.post("/login", isLoggedInAlready, passport.authenticate("local", 
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    successFlash: "Welcome to the KodeCamp",
    failureFlash: "Invalid username or password"
  }
), function(req, res) {
});

// logout session
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "You are logged out!");
  res.redirect("/campgrounds");
});

// user profile
router.get("/users/:id", function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if(err) {
      req.flash("error", "Something went wrong.");
      res.redirect("back");
    }
    Campground.find().where('autho.id').equals(foundUser._id).exec(function(err, campgrounds) {
      if(err) {
      req.flash("error", "Something went wrong.");
      res.redirect("back");
    }
    res.render("users/showuser",{user: foundUser, campgrounds: campgrounds});
    });
  });
});

// preventing the logged in user to enter in login and register page
function isLoggedInAlready(req, res, next) {
  if(req.isAuthenticated()) {
    req.flash("error", "You are already logged in!!!");
    res.redirect("back");
  }
  return next();
}

module.exports = router;