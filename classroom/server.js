//cookie and Router

/*const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
const users = require("./routes/user.js");
const posts = require("./routes/post.js");

app.use(cookieParser("secretcode"));

app.get("/getsignedcookie", (req,res) =>{
    res.cookie("made-in", "India" , {signed:true});
    res.cookie("Origin", "Bharat" , {signed:true});
    res.send("signed cookie sent");
});

app.get("/verify", (req, res) =>{
    console.log(req.cookies);
    res.send(req.signedCookies);
})

app.get("/", (req,res) =>{
    res.send("Hi, i am Root!");
    console.dir(req.cookies);
});

app.get("/greet", (req,res)=>{
    let {name = "anontmous"} = req.cookies;
    res.send(`hi ${name}`);
})

//send cookie in response
app.get("/getcookies", (req,res)=>{
    res.cookie("Greet", "namaste");
    res.cookie("Origin", "India");
    res.send("we sent you a cokkie");
})

//delte route
app.get("/deletecookie", (req, res) => {
    res.clearCookie("made-in", "India");
    res.clearCookie("Origin", "Bharat");
    res.send("Cookie deleted!");
});
app.use("/users", users);
app.use("/posts", posts);

app.listen(3000, ()=>{
    console.log("server is listening tp 3000")
});*/


//Express Session
const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");


app.use(session({secret: "mysupersecretstring", resave: false, saveUninitialized:true}));
app.use(flash());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//middleware for flash msg
app.use((req,res,next) =>{
    res.locals.errormsg = req.flash("error");
    res.locals.successmsg = req.flash("success");
    next();
})

//check session id create or not
// app.get("/test", (req,res)=>{
//     res.send("test successful");
// })
//count request on express session
// app.get("/reqcount", (req,res) =>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`you sent a request ${req.session.count} times`);
// })

//how to store&use,flash msg data by express session
app.get("/register", (req,res)=>{
    let {name="anonymous"} = req.query;
    req.session.name = name;
    if(name ==="anonymous"){
        req.flash("error", "user  not registered");
    }else{
            req.flash("success", "user registered successfully!");
    }
    
    res.redirect("/hello");
})
//Say Hello
app.get("/hello", (req,res)=>{
    // res.send(`Hello ${req.session.name}`);
    //res.render("page.ejs",{name :req.session.name , msg:req.flash("success")});
    // res.locals.errormsg = req.flash("error");
    // res.locals.successmsg = req.flash("success");
    res.render("page.ejs",{name :req.session.name });
})

app.listen(3000, ()=>{
    console.log("server is listening tp 3000")
});