var express    			  =  require("express"),
    app        			  =  express(),
    mongoose   			  =  require("mongoose"),
    bodyParser 			  =  require("body-parser"),
    Camp 	   			  =  require("./models/camp"),
    Comment    			  =  require("./models/comment"),
    passport   			  =  require("passport"),
    flash                 =  require("connect-flash"),
    LocalStratergy 		  =  require("passport-local"),
    passportLocalMongoose =  require('passport-local-mongoose'),
    User 	   			  =  require("./models/user"),
    methodOverride        =  require("method-override"),
    seedDB	   			  =  require("./seeds"), 
    campRoutes			  =  require("./routes/camp"),
    commentRoutes		  =  require("./routes/comment"),
    authRoutes			  =  require("./routes/index");

var port = process.env.PORT || 3000;
//

mongoose.connect("mongodb+srv://haseeb:haseebmongo2018@cluster0-msqtp.mongodb.net/camps", 
    {useNewUrlParser : true, useUnifiedTopology: true});
//mongodb+srv://haseeb:haseebmongo2018@cluster0-msqtp.mongodb.net/test?retryWrites=true&w=majority
//mongodb://localhost:27017/camps

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine" , "ejs");
app.use(express.static("./public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
	secret: "I am cute!",
	resave: false,
	saveUninitialized: false
}));

mongoose.set('useFindAndModify', false);
passport.use(new LocalStratergy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
    next();
});


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.use(authRoutes);
app.use("/camp/:id/comment", commentRoutes);
app.use("/camp", campRoutes);

app.listen(port, function(){
	
	console.log("server started");
});