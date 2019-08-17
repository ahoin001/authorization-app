
const express = require("express");
// User model
const User = require("../models/user")
const router = express.Router();

// signup page given to user when they request
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

// BCRYPT TO ENCRYPTION PASSWORDS
//*********************************************************** */

const bcrypt     = require("bcrypt");
const saltRounds = 10;

// will be redirected to same page after form is submitted and user will be added to Collection of users
router.post('/signup', (req,res,next) => {
    const username = req.body.username;
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPassword = bcrypt.hashSync(password,salt)
  
    User
    .create({
  
      username,
      // pass the hashed password to password property
      password : hashPassword 
  
    })
    .then( () => {
      // Show if user is created in console
      User
      .find()
      .then((users) => {
        console.log('LIST OF USERS ------------',users);
      }
      )
      res.redirect('/');
    })
    .catch((err) => {
      console.log('Error redirecting to root page with user information ============================');
    })
  })

module.exports = router;