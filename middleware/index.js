var middlewareObj = {},
	Camp     =  require("../models/camp"),
	Comment  =  require("../models/comment");

middlewareObj.checkCampOwnership = function(req, res, next)
{
	if(req.isAuthenticated()){
		Camp.findById(req.params.id, function(err, f){
		if(err)
			res.redirect("back");
		else{
			if(f.author.id.equals(req.user._id))
				next();
			else{
				req.flash("error", "Permission Denied!");
				res.redirect("back");			
			}
		}
	});
	}
	else
	{
		req.flash("error", "Please Login First!");
		res.redirect("back");
	}	
}

middlewareObj.checkCommentOwnership = function(req, res, next)
{
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, f){
		if(err)
			res.redirect("back");
		else{
			if(f.author.id.equals(req.user._id))
				next();
			else{
				req.flash("error", "Permission Denied!");
				res.redirect("back");			
			}
		}
	});
	}
	else
	{
		req.flash("error", "Please Login First!");
		res.redirect("back");
	}	
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login First!");
	res.redirect("/login");
}

module.exports = middlewareObj;