var express    = require("express"),
    app        = express(),
    bodyparser = require("body-parser"),
    mongoose   = require("mongoose"),
	passport   = require("passport"),
	LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
	User       = require("./models/user"),
    seedDB     = require("./seeds"),
	flash      = require("connect-flash"),
	methodOverride = require("method-override");

//Requiring Routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	authRoutes = require("./routes/auth");

mongoose.connect(process.env.DATABASEURL,{
	useNewUrlParser: true,
    useUnifiedTopology: true
});

// mongoose.connect('mongodb://localhost:27017/yelp_camp', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

mongoose.connect("mongodb+srv://Mongo0415:Mongodb89@cluster0.jf0aj.mongodb.net/yelpcamp?retryWrites=true&w=majority",{
useNewUrlParser: true,
useUnifiedTopology: true	
}).then(()=>{
console.log("connected to DB");
}).catch(err=>{console.log("ERROR",err.message)});



app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "i love coffe",
	resave: false,
	saveUninitialized: false
	}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//Express Router to reorganize all routes.
app.use("/",authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


// app.listen(process.env.PORT, process.env.IP ||3000 , function(){
//    console.log("Server is listening!!!"); 
// });

//Tell Express to listen for requests(start server)
app.listen(3000, function() { 
  console.log('The YelpCamp Server has Started!');
});






//====== Orginal code before refactoring=========


// app.get("/", function(req , res){
// 	res.render("landing")
// });

// //Index route - show all campgrounds
// app.get("/campgrounds", function(req, res){
	
// 	// get all campgrounds
// 	Campground.find({},(err,allCampgrounds) => {
// 		if(err){
// 			console.log(err);
// 		} else { 
// 			res.render("campgrounds/index",{campgrounds:allCampgrounds})
// 		}
// 	})
// });
// //Create route - add new campground to the DB
// app.post("/campgrounds", function(req, res){
// //get data from form and add to the campgrouds array
// 	var name = req.body.name;
// 	var image =req.body.image;
//     var desc =req.body.description;
// 	var newCampground= {name: name, image: image, description:desc};
// // creat a new campgrounds and save to the DB
// 	Campground.create(newCampground,(err, newlycreated)=>{
// 		if(err){
// 			console.log(err)
// 		} else 
// 			//redirect to the campgrounds
// 		{ res.redirect("/campgrounds")}
// 	})
// });
// // New route - show form to create new campground 
// app.get("/campgrounds/new", function(req, res){
// 	res.render("campgrounds/new")
// });
// //Show route -show more info about one campground
// app.get("/campgrounds/:id",function(req, res){
// 	// find campgrounds with provided id
// 	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
// 		if(err){
// 			console.log(err)
// 		} else {
// 			//console.log(foundCampground);
// 			//render show template with that campground
// 			res.render("campgrounds/show", {campground: foundCampground})
// 		}
// 	})
// })

// //===============
// //comment routes
// //===============
// app.get("/campgrounds/:id/comments/new", isLoggedIn,(req,res)=>{
// 	//find campground by id
// 	Campground.findById(req.params.id,(err, campground)=>{
// 		if(err){
// 			console.log(err)
// 		} else {
// 			res.render("comments/new",{campground: campground});
// 		}
// 	})
// });

// app.post("/campgrounds/:id/comments",isLoggedIn, (req, res) =>{
//  Campground.findById(req.params.id, (err, campground)=>{
// 	 if(err){
// 		 console.log(err);
// 	 } else {
// 		 Comment.create(req.body.comment,(err, comment)=>{
// 			 if(err){
// 				 console.log("error found", err);
// 			 } else {
// 				 campground.comments.push(comment);
// 				 campground.save();
// 				 res.redirect("/campgrounds/" + campground._id );
// 			 };
// 		 });
// 	 };
//  });
// });
// //=======Authantication routes=====
// //Show register form
// app.get("/register",(req,res)=>{
// 	res.render("register");
// });
// //handle sign up
// app.post("/register",(req,res)=>{
// 	var newUser= new User({username:req.body.username});
// 	User.register(newUser,req.body.password,(err,user)=>{
// 		if(err){
// 			cosole.log(err);
// 			return res.render("register")
// 		}
// 		passport.authenticate("local")(req,res ,function(){
// 			res.redirect("/campgrounds");
// 		});
// 	});
// });

// //show login form
// app.get("/login",(req,res)=>{
// 	res.render("login")
// });
// //login logic ***middleware***
// app.post("/login",passport.authenticate("local",{
// 	successRedirect:("/campgrounds"),
// 	failureRedirect:("/login")
// }),(req,res)=>{
// });
// //logout route
// app.get("/logout",(req,res)=>{
// 	req.logout();
// 	res.redirect("/campgrounds");
// 	});
// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// };


	



