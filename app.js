var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect("mongodb://localhost:27017/secret_page", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(require('express-session')({
   secret: "This",
   resave: false,
   saveUninitialized: false 
}));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        } 
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        })
    })
});

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login"
}),function(req, res){

});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("login");
}

app.listen(3000, function(){
    console.log("Server started on port 3000");
});