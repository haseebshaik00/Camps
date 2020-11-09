var express  =  require("express"),
    router   =  express.Router(),
    Camp     =  require("../models/camp"),
    passport =  require("passport"),
    User     =  require("../models/user"),
    Comment  =  require("../models/comment");

router.get("/", function(req, res){
    res.render("home");
});

router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
	var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Registeration Successful!");
            res.redirect("/camp");
        });
    });
});

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
	successRedirect : "/camp",
	failureRedirect: "/login"
    }), function(req, res){
    req.flash("success", "Login Successful!");
});

router.get("/logout", function(req, res){
	req.logout();
    req.flash("success", "Logged you out!");
	res.redirect("/camp");
});

module.exports = router;

