var express  =  require("express"),
	router	 =  express.Router(),
	Camp     =  require("../models/camp"),
	middleware = require("../middleware/index.js");

router.get("/", function(req, res){
	Camp.find({}, function(err, allcamps){
		if(err)
			console.log(err);
		else
		{
			res.render("camp/index", {c: allcamps});
		}
	});
});

router.post("/", middleware.isLoggedIn, function(req, res){
	var name    = req.body.name;
	var img     = req.body.img;
	var price   = req.body.price;
	var desc    = req.body.desc;
	var author  = {
		id : req.user._id,
		username : req.user.username
	};
	var newCamp = {name : name , price : price,  image : img , description : desc, author : author};
	Camp.create(newCamp, function(err, newCamp){
		if(err)
			console.log(err);
		else{
			res.redirect("/camp");
		}
	});
});

router.get("/new", middleware.isLoggedIn, function(req, res){
	
	res.render("camp/new");
});

router.get("/:id", function(req, res){
	Camp.findById(req.params.id).populate("comments").exec(function(err, f){
		if(err)
			console.log(err);
		else{
			res.render("camp/show", {f : f});
		}
	});
});

router.get("/:id/edit", middleware.checkCampOwnership, function(req, res){
		Camp.findById(req.params.id, function(err, f){
				res.render("camp/edit", {f:f});		
	});
});

router.put("/:id", middleware.checkCampOwnership, function(req, res){
	Camp.findByIdAndUpdate(req.params.id, req.body.camp, function(err, u){
		if(err)
			console.log(err);
		else
			res.redirect("/camp/" + req.params.id);
	});
});

router.delete("/:id", middleware.checkCampOwnership, function(req, res){
	Camp.findOneAndDelete(req.params.id, function(err, update){
		if(err)
			console.log(err);
		else
			res.redirect("/camp");
	});
});

module.exports = router;