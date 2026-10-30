const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn,isReviewAuther} = require("../middleware.js");
const reviewController = require("../controllers/review.js");



//Review Route
router.post("/", isLoggedIn,validateReview, wrapAsync(reviewController.createReview));


//Delete Review route
router.delete("/:reviewId", isLoggedIn,isReviewAuther,wrapAsync(reviewController.deleteReview));


module.exports = router;