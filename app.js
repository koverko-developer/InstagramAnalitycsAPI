var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var firebase = require('firebase');
var config = {
   apiKey: "AIzaSyCaufAWZ2LcRY2Ew2dGnjXcetcMA_TvaoM",
   authDomain: "insta-6f167.firebaseapp.com",
   databaseURL: "https://insta-6f167.firebaseio.com/",
   storageBucket: "insta-6f167.appspot.com"
 };
firebase.initializeApp(config);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
//app.use('/api/Books', bookRouter);
var UserController = require('./user/UserController');
app.use('/api/users', UserController);

var AuthController = require('./auth/AuthController');
app.use('/api/auth', AuthController);

// router.initialize(app);
module.exports = app;
