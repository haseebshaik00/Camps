var express  =  require("express"),
	router	 =  express.Router({mergeParams: true}),
	Camp     =  require("../models/camp"),
	mongoose =  require("mongoose"),
	middleware = require("../middleware/index.js"),
	Comment  =  require("../models/comment");

mongoose.set('useFindAndModify', false);

router.get("/new", middleware.isLoggedIn, function(req, res){
	Camp.findById(req.params.id, function(err, camp){
		if(err)
			console.log(err);
		else
			res.render("comment/new", {camp : camp});
	});
});

router.post("/", middleware.isLoggedIn, function(req, res){
	Camp.findById(req.params.id, function(err, camp){
		if(err)
			console.log(err);
		else
			Comment.create(req.body.comment, function(err, comment){
				if(err)
					console.log(err);
				else
				{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					camp.comments.push(comment);
					camp.save();
					req.flash("success", "Successfully added comment!");
					res.redirect("/camp/" + camp._id );
				}
			});
	});
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, f){
		if(err)
			res.redirect("back");
		else
			res.render("comment/edit", {camp_id: req.params.id, comment: f});
	});
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, u){
		if(err){
			res.redirect("back");
			console.log(err);
		}
		else
			res.redirect("/camp/" + req.params.id);
	});
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndDelete(req.params.comment_id, function(err, update){
		if(err)
			console.log(err);
		else{
			req.flash("success", "Comment Deleted!");
			res.redirect("/camp/" + req.params.id);
		}
	});
});

module.exports = router;