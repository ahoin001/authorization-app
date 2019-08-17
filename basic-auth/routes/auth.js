
const express = require("express");
// User model
const User = require("../models/user")
const router = express.Router();

//Login Page
router.get("/login", (req, res, next) => {
    res.render("auth/login");
});

// Post route for login
router.post("/login", (req, res, next) => {

    // get the username and password from form
    const theUsername = req.body.username;
    const thePassword = req.body.password;

    if (theUsername === "" || thePassword === "") {
        res.render("auth/login", {
            errorMessage: "Please enter both, username and password to sign up."
        });
        return;
    }

    User.findOne({ "username": theUsername })
        .then(user => {
            if (!user) {
                res.render("auth/login", {
                    errorMessage: "The username doesn't exist."
                });
                return;
            }
            // IF USER EXSIST ^^^ ,COMPARE THE LOGIN PASSWORD WITH PASSWORD OF THAT USER RETURNED WITH THE USER NAME
            //                          vv         vv  
            if (bcrypt.compareSync(thePassword, user.password)) {

                // Save the login in the session!
                req.session.currentUser = user;
                // redirect to home page
                res.redirect("/");

            } else {
                res.render("auth/login", {
                    errorMessage: "Incorrect password"
                });
            }
        })
        .catch(error => {
            next(error);
        })
});

router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
        // cannot access session here so redirect to login
        res.redirect("/login");
    });
});

// signup page given to user when they request
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

// BCRYPT TO ENCRYPTION PASSWORDS
//*********************************************************** */

const bcrypt = require("bcrypt");
const saltRounds = 10;

// will be redirected to same page after form is submitted and user will be added to Collection of users
router.post('/signup', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPassword = bcrypt.hashSync(password, salt)

    // VALIDATES USERNAME AND PASSWORDS FIELDS TO MAKE SURE THEY ARE NOT EMPTY
    if (username === "" || password === "") {
        // if user or password empty, send back to same page, notify them of error with error 
        // second parameter is object passed to hbs to display the message
        res.render('auth/signup', {
            errorMessage: "Username and password must both not be empty."
        })
        // breaks us out of function before creating new user
        return;
    }

    // CHECKS IF USERNAME ALREADY EXSISTS IN THE DB COLLECTION WE HAVE
    User.findOne({ "username": username })
        .then(user => {
            if (user !== null) {
                res.render("auth/signup", {
                    errorMessage: "The username already exists!"
                });
                return;
            }
        })

    // IF ALL VALIDATION PASSED THEN CREATE NEW USER
    User
        .create({

            username,
            // pass the hashed password to password property
            password: hashPassword

        })
        .then(() => {
            // Show if user is created in console
            User
                .find()
                .then((users) => {
                    console.log('LIST OF USERS ------------', users);
                }
                )
            res.redirect('/');
        })
        .catch((err) => {
            console.log('Error redirecting to root page with user information ============================');
        })
})

module.exports = router;