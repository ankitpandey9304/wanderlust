const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl}=  require("../middleware.js");
const userController = require("../controllers/user.js");


router.route("/signup")
//signup form
.get(userController.signupForm)
//signup register
.post(wrapAsync(userController.signup));

router.route("/login")
//login form
.get(userController.loginForm)
//login access
.post(saveRedirectUrl, 
    passport.authenticate("local",
    { failureRedirect: "/login", 
        failureFlash: true 
    }), 
    userController.login
    );

//logout
router.get("/logout", userController.logout)


module.exports = router;