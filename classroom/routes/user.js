const express = require("express");
const router = express.Router();

//index
router.get("/", (req,res) =>{
    res.send("GET for Users");
});

//SHow
router.get("/:id", (req,res) =>{
    res.send("GET for  users id");
});

//Post
router.get("/users", (req,res) =>{
    res.send("GET for Users");
});

//delete
router.get("/:id", (req,res) =>{
    res.send("Delete for user id");
});

module.exports = router;