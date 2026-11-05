const User = require("../models/user.js");
const {
    sendWelcomeEmail,
    sendLoginEmail
} = require("../utils/mailer");


module.exports.signupForm = (req,res) =>{
    res.render("users/signup.ejs")
}


module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({ email, username });

        const registerUser = await User.register(newUser, password);

        console.log(registerUser);

        // Login the newly registered user
        req.login(registerUser, async (err) => {
            if (err) {
                return next(err);
            }

            // Send welcome email
            try {
                await sendWelcomeEmail(
                    registerUser.email,
                    registerUser.username
                );

                console.log("Welcome email sent successfully!");
            } catch (emailErr) {
                console.error("Welcome email failed:", emailErr.message);
            }

            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};


module.exports.loginForm = (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login = async (req, res) => {

    try {
        const user = req.user;

        await sendLoginEmail(user.email, user.username);

    } catch (err) {
        console.error("Login email failed:", err.message);
    }

    req.flash("success", "Welcome back to Wanderlust!");

    let redirectUrl = res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
             return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
}