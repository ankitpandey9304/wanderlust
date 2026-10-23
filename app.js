const express = require("express");  
const app = express();
const mongoose = require("mongoose");
const port= 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");


const listingRouter= require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter = require("./routes/user.js");

main().then(()=>{
    console.log("connected to DB")
}).catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions ={
    secret: "mysupersecretstring", 
    resave: false, 
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true
    }
};

app.get("/" , (req,res) =>{
    res.send("Hi I am root");
});


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
//DemoUser
// app.get("/demouser", async (req,res) =>{
//     let fakeUSer = new User({
//         email:"student@gmail.com",
//         username: "delta-student"
//     });
//     let registeredUser = await User.register(fakeUSer, "helloworld");
//     res.send(registeredUser);
// })

//router
app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


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