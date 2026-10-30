const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");


router.route("/")
//index Route
.get(wrapAsync(listingController.index))
//Create Route
.post(isLoggedIn, validateListing,  
  wrapAsync(listingController.createListing));

//New Route
router.get("/new", isLoggedIn,listingController.renderNewRoute);

router.route("/:id")
//show Route
.get(isLoggedIn,wrapAsync(listingController.showListing ))
//Update Route
.put(isLoggedIn,isOwner,validateListing, 
  wrapAsync(listingController.updateListing))
//Delete Route
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

//Edit Route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm))


module.exports = router;