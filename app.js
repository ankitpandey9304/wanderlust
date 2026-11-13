const dns = require("dns");

// Use Google DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require("express");  
const app = express();
const mongoose = require("mongoose");
const port= 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");


const listingRouter= require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connected to DB")
}).catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter : 24*3600,
});

store.on("error", (err) => {
    console.log("Error in Mongo Session Store", err);
});

const sessionOptions ={
    store,
    secret:process.env.SECRET , 
    resave: false, 
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true
    }
};

app.use(session(sessionOptions));
app.use(flash());

//authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


//middleware for flash
app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// Router
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Redirect home page to listings
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// 404 middleware
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

//middleware
app.use((err,req,res,next)=>{
  let {statuscode=500, message="something went wrong"} = err;
  res.status(statuscode).render("error.ejs", {message,err});
  // res.status(statuscode).send(message);
})

app.listen(port, () =>{
    console.log(`Server is listening to port ${port}`);
});