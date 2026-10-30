const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl}=  require("../middleware.js");
const userController = require("../controllers/user.js");


//signup form
router.get("/signup", userController.signupForm);

//signup register
router.post("/signup", wrapAsync(userController.signup));

//login form
router.get("/login", userController.loginForm);

//login access
router.post("/login",saveRedirectUrl, 
    passport.authenticate("local",
    { failureRedirect: "/login", 
        failureFlash: true 
    }), 
    userController.login
    );

//logout
router.get("/logout", userController.logout)


module.exports = router;