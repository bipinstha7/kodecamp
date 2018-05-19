var Campground = require("../models/campground"),
    express    = require("express"),
    router     = express.Router(),
    middleware = require("../middleware/middleware.js");


router.get("/", function(req, res) {
  res.render("landing");
});

//INDEX -- show all campgrounds from the db
router.get("/campgrounds", function(req, res) {
  if(req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Campground.find({name: regex}, function(err, findCampgrounds) {
      if(err || !findCampgrounds) {
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
        if(findCampgrounds.length < 1) {
        req.flash("error", "Searched campground not found");
        res.redirect("back");
      } 
        res.render("campgrounds/index", {campgrounds: findCampgrounds});
      }
    }); 
  }else {
    Campground.find({}, function(err, findCampgrounds) {
      if(err || !findCampgrounds) {
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
        res.render("campgrounds/index", {campgrounds: findCampgrounds});
      }
    }); 
  }
  
});

//CREATE -- add new camp to db
router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {
  // get data from the form and add to campgrounds array
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampgrounds = {name: name, price: price, image: image, description: description, author: author};
  Campground.create(newCampgrounds, function(err, saveCamp) {
    if(err) {
      req.flash("error", "Something went wrong!!");
    } else {
      req.flash("success", "New Campground is added.");
      // redirect to campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

//NEW -- show form to add new camp
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

//SHOW -show more content about campground
router.get("/campgrounds/:id", function(req, res) {
  // find the campground by the provided id
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
    if(err || !foundCamp) {
      req.flash("error", "Campground not found!");
      res.redirect("back");
    } else {
      // render show templete with that id
      res.render("campgrounds/show", {campground: foundCamp});
    }
  });
});

// EDIT campgrounds
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    if(err || !foundCampground) {
      req.flash("error", "Something went wrong!!!");
      res.redirect("/campgrounds");
    } else {
      res.render("campgrounds/edit", {campground: foundCampground});
    }
  });
});

// UPDATE campgrounds
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp) {
    if(err || !updatedCamp) {
      req.flash("error", "Something went wrong!!!");
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground updated.");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DELETE campground
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      req.flash("error", "Something went wrong!!!");
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground deleted");
      res.redirect("/campgrounds");
    }
  });
});

// Campground valid Search words
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;