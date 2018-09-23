var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var firebase = require('firebase');
var request = require('request');
var AuthController = require('./auth/AuthController');
var UserController = require('./user/UserController');
var TopController = require('./top/TopController');
var PostsController = require('./posts/PostsController');

var port = process.env.PORT || 80;

var app = express();

var firebase = require('firebase');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', AuthController);
app.use('/users/', UserController);
app.use('/top/', TopController);
app.use('/posts/', PostsController);

// Running the server
app.listen(port, () => {
	console.log(`http://localhost:${port}`)
})
