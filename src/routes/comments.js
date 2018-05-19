var Campground = require("../models/campground"),
    Comment    = require("../models/comments"),
    express    = require("express"),
    router     = express.Router(),
    middleware = require("../middleware/middleware.js");

// COMMENT ROUTE
router.get("/campgrounds/:id/comment/new", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, foundId) {
    if(err || !foundId) {
      req.flash("error", "Something went wrong!!!");
      res.redirect("back");
    } else {
      res.render("comments/newComment", {campground: foundId});
    }
  });
});

// handling comment
router.post("/campgrounds/:id/comment", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if(err || !campground) {
      req.flash("error", "Something went wrong!!!");
      res.redirect("back");
    } else {
      Comment.create(req.body.comment, function(err, createComment) {
        if(err) {
          req.flash("error", "Something went wrong!!!");
        } else {
          // add username and id to comment
          createComment.author.id = req.user._id;
          createComment.author.username = req.user.username;
          // save comment
          createComment.save();
          campground.comments.push(createComment);
          campground.save();
          req.flash("success", "New comment added.");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// EDIT comment 
router.get("/campgrounds/:id/comment/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    if(err || !foundCampground) {
      req.flash("error", "Campground not found!!!");
      return res.redirect("back");
    } 
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if(err) {
        req.flash("error", "Something went wrong!!!");
        res.redirect("back");
      } else {
        res.render("comments/editComment",{campground_id: req.params.id, comment: foundComment});
      }
    });
  });
});

// UPDATE comment
router.put("/campgrounds/:id/comment/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCamp) {
    if(err || !foundCamp) {
      req.flash("error", "campground not found!!!");
      return res.redirect("back");
    }
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
      if(err) {
        req.flash("error", "Something went wrong!!!");
        res.redirect("back");
      } else {
        req.flash("success", "comment updated");
        res.redirect("/campgrounds/" +req.params.id);
      }
    });
  });
  
});

// DELETE comment
router.delete("/campgrounds/:id/comment/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if(err) {
      req.flash("error", "Something went wrong!!!");
      res.redirect("back");
    } else {
      req.flash("error", "comment deleted");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;