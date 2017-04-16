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
    // secret is used to encode and decode the session (arbitrary string)
    secret: "This is the best secret ever",
    resave: false,
    saveUninitialized: false
}))
    
app.set("view engine", "ejs")
// Need next two lines any time we will use passport
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/secret", (req, res) => {
    res.render("secret")
})

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server is Running....")
})