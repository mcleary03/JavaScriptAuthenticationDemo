var passportLocalMongoose = require("passport-local-mongoose"),
    LocalStrategy         = require("passport-local"),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    express               = require("express"),
    User                  = require("./models/user")


var app = express()    
mongoose.connect("mongodb://localhost/auth_demo_app")
    
// Alows us to use express-session and requires it in-line
app.use(require("express-session")({
    // secret is used to encode and decode the session (arbitrary string to salt with)
    secret: "This is the best secret ever",
    resave: false,
    saveUninitialized: false
}))
    
app.set("view engine", "ejs")
// Need next two lines any time we will use passport
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.urlencoded({ extended: true }))

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// ROUTES

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/secret", (req, res) => {
    res.render("secret")
})

// AUTH ROUTES

app.get("/register", (req, res) => {
    res.render("register")
})
// handling user sign up
app.post("/register", (req, res) => {
    // only save the username, 
    //  password is just passed to passport to be hashed,
    //  then the hashed password is stored in user
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if (err) {
            console.log(err)
            // short circuit and render register page again
            return res.render("register")
        } else {
            // tell passport which stategy to use ("local")
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secret")
            })
        }
    })
})

// LOGIN ROUTES

app.get("/login", (req, res) => {
    res.render("login")
})

// using passport as middleware
//  it is passed in to post as a second argument instead of in the callback
//   passport automatically takes the username and password from the req.body
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), (req, res) => {
    
})

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server is Running....")
})