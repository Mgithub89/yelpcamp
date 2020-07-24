var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//Index route - show all campgrounds
router.get("/", function(req, res){
	// get all campgrounds
	Campground.find({},(err,allCampgrounds) => {
		if(err){
			console.log(err);
		} else { 
			res.render("campgrounds/index",{campgrounds:allCampgrounds})
		}
	});
});

//Create route - add new campground to the DB
router.post("/",middleware.isLoggedIn,function(req, res){
//get data from form and add to the campgrouds array
	var name   = req.body.name;
	var price  =req.body.price;
	var image  =req.body.image;
    var desc   =req.body.description;
	var author = {
				id: req.user._id,
				username: req.user.username
				 };
	var newCampground= {name: name, price: price,image: image, description: desc, author: author };
	
// creat a new campgrounds and save to the DB
	Campground.create(newCampground,(err, newlycreated)=>{
		if(err){
			console.log(err)
		} else 
			console.log(newlycreated);
			//redirect to the campgrounds
		{ res.redirect("/campgrounds")}
	});
});

// New route - show form to create new campground 
router.get("/new",middleware.isLoggedIn,function(req, res){
	res.render("campgrounds/new")
});

//Show route -show more info about one campground
router.get("/:id",function(req, res){
	// find campgrounds with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err)
		} else {
			//console.log(foundCampground);
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground})
		}
	})
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findById(req.params.id,(err,foundCampground)=>{
	res.render("campgrounds/edit",{campground: foundCampground});	
		
	});
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,updatedCampground)=>{
		if(err){
			res.redirect("/campgrounds");
		} else {
			//redirect to show page
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findByIdAndRemove(req.params.id,(err)=>{
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;
