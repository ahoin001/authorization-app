require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

// Add Session and MongoStore to store session
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);

mongoose
  .connect('mongodb://localhost/basic-auth', { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Setup for sessions
app.use(session({
  secret: "basic-auth-secret", // secret: Used to sign the session ID cookie (required)
  cookie: { maxAge: 60000 }, //cookie: Object for the session ID cookie. Here, we only set the maxAge attribute, which configures the expiration date of the cookie (in milliseconds).
  store: new MongoStore({ //store: Sets the session store instance. In this case, we create a new instance of connect-mongo, so we can store the session information in our Mongo database.
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

// Express View engine setup

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// const hash1 = bcrypt.hashSync(plainPassword, salt);


// console.log("Hash 1 -", hash1);


//  ROUTES 
//*********************************************************** */

app.get("/", (req, res, next) => {
  res.render("index");
});

// connect auth.js routes
const authRouters = require('./routes/auth');
app.use('/', authRouters);


// TODO where does this get used?
module.exports = app;
