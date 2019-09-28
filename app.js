var express=require('express'),
    app=express(),
    bodyParser=require('body-parser'),
    mongoose=require('mongoose'),
    passport=require("passport"),
    LocalStrategy=require('passport-local'),
    Campground=require('./models/campground'),
    Comment=require('./models/comment'),
    User=require('./models/user'),
    seedDB=require('./seeds'),
    flash=require("connect-flash"),
    methodOverride=require('method-override'),
    session=require('express-session');

//APP CONFIGURATION
mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true,useFindAndModify: false });
app.use(bodyParser.urlencoded({extended:true}));  
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();//seed the database

//PASSPORT CONFIGURATION
app.use(session({
    secret:'Once again Rusty wins cutest dog!',
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//For every single route
app.use(function(req,res,next){
    res.locals.curruser=req.user;
    res.locals.error=req.flash('error');
    res.locals.success=req.flash('success');
    next();
});

//route
app.get('/', function(req, res){
    res.render('landing')
});

//index-show all campground
app.get('/campgrounds', function(req, res){
    Campground.find({},function(err,camp){
        if(err){
            console.log('error');
        }else{
            res.render('index',{campgrounds:camp});
        }
    });
});

//new-show form to create new campground
app.get('/campgrounds/new',isLoggedIn,function(req, res){
    res.render('new');
});

//creat-add new campground to db
app.post('/campgrounds',isLoggedIn,function(req, res){
    var name=req.body.name;
    var image=req.body.image;
    var disc=req.body.disc;
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newCampground={name:name,image:image,description:disc,author:author};
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect('/campgrounds');
        }
    });
});

app.get('/campgrounds/:id',function(req, res){
    Campground.findById(req.params.id).populate('comments').exec(function(err,foundcamp){
        if(err){
            console.log(err);
        }else{
            res.render('show',{campground:foundcamp});
        }
    });
});

//edit campground routes
app.get('/campgrounds/:id/edit',checkCampgroundOwnership,function(req, res){
    Campground.findById(req.params.id,function(err,foundcamp){
        res.render("edit",{campground:foundcamp});
    }); 
});

//update campground routes
app.put('/campgrounds/:id',checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id,req.body.camp,function(err,newcamp){
        if(err){
            res.redirect('/campgrounds');
        }else{  
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
});
//Destroy campground routes
app.delete("/campgrounds/:id",checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect('/campgrounds');
        }else{
            res.redirect('/campgrounds');
        }
    });
});

//comment routes
app.get('/campgrounds/:id/comments/new', function(req, res){
    Campground.findById(req.params.id,function(err,foundcamp){
        if(err){
            console.log(err);
        }else{
            res.render('comments/new',{campground:foundcamp});
        }
    });
});
app.post('/campgrounds/:id/comments',isLoggedIn, function(req, res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    req.flash("error","Something went wrong");
                    console.log(err);
                }else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success',"Successfully added comment");
                    res.redirect('/campgrounds/'+campground._id);
                }
            })
        }
    });
});

//AUTH ROUTES
//show signup form
app.get('/register', function(req, res){
    res.render('register');
});

//Handle sign up logic
app.post('/register', function(req, res){
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            return res.render('register');
        }
        passport.authenticate('local')(req,res,function(){
            req.flash("success","Welcome to YelpCamp "+ user.username);
            res.redirect('/campgrounds');
        });
    });
});

//show login form
app.get('/login', function(req, res){
    res.render('login');
});

//Handle login logic
app.post('/login',passport.authenticate('local',
    {
        successRedirect:'/campgrounds',
        failureRedirect:'/login'
    }),function(req, res){
    req.flash("success","Successfully! Logged in");
});

//logout route
app.get('/logout', function(req, res){
    req.logOut();
    req.flash("success","Successfully! Logged You Out");
    res.redirect('/campgrounds');
});

//edit comment routes
app.get('/campgrounds/:id/comments/:comment_id/edit',checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id,function(err,foundcomment){
        if(err){
            console.log(err);
        }else{
            res.render('comments/edit',{comment:foundcomment,campground_id:req.params.id});
        }
    });
});
//update comment routes
app.put('/campgrounds/:id/comments/:comment_id',checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedcomment){
        if(err){
            res.redirect('back');
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});
//Destroy comment routes
app.delete("/campgrounds/:id/comments/:comment_id",checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect('back');
        }else{
            req.flash("success","Comment succesfully deleted");
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged to do that");
    res.redirect('/login');
}

function checkCampgroundOwnership(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundcamp){
            if(err){
                req.flash("error","Campground not found");
                res.redirect('back')
            }else{
                if(foundcamp.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect('back');
                }     
            }
        }); 
    }else{
        req.flash("error","You need to be logged to do that");
        res.redirect("back");
    }   
}
function checkCommentOwnership(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundcomment){
            if(err){
                res.redirect('back')
            }else{
                if(foundcomment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect('back');
                }     
            }
        }); 
    }else{
        req.flash("error","You need to be logged to do that");
        res.redirect("back");
    }   
}
//server setup
app.listen(3000, function(){
    console.log('App listening on port 3000');
});