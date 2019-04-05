const Campground = require("../models/campground");
const Comment = require("../models/comments");

const middlewareObject = {};

// Campground authentication
middlewareObject.checkCampgroundOwnership = function(req, res, next) {
  // is user logged in?
  // req.isAuthenticated is passport middleware
  if(req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      if(err || !foundCampground) {
        req.flash("error", "Campground not found!!!");
        res.redirect("back");
      } else {
        // does user own the campground?
        // console.log(foundCampground.author.id);
        // console.log(req.user._id);
        if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that!!!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Please login first!");
    res.redirect("back");
  }
}


// Comment authentication 
middlewareObject.checkCommentOwnership = function checkCommentOwnership(req, res, next) {
  // is user logged in?
  if(req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if(err || !foundComment) {
        req.flash("error", "Something went wrong!!!");
        res.redirect("back");
      } else {
        // does user own the campground?
        if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash("error", "You do'nt have permission to do that!!!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Please login first!");
    res.redirect("back");
  }
}

// hadnling logout session
middlewareObject.isLoggedIn = function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please login first!");
  res.redirect("/login");
}

module.exports = middlewareObject;