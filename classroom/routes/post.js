const express = require("express");
const router = express.Router();

//index
router.get("/", (req,res) =>{
    res.send("GET for Posts");
});

//SHow
router.get("/:id", (req,res) =>{
    res.send("GET for  post id");
});

//Post
router.get("/posts", (req,res) =>{
    res.send("GET for Posts");
});

//delete
router.get("/:id", (req,res) =>{
    res.send("Delete for post id");
});

module.exports = router;