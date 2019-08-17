
const express = require("express");
// User model
const User = require("../models/user")
const router = express.Router();

router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

module.exports = router;