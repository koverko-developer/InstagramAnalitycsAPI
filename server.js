var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var firebase = require('firebase');
var request = require('request');
var AuthController = require('./auth/AuthController');
var UserController = require('./user/UserController');
var TopController = require('./top/TopController');
var PostsController = require('./posts/PostsController');
var AudienceController = require('./audience/AudienceController');
var HashtagsController = require('./hashtags/HashtagsController');
var StalkersController = require('./stalkers/StalkersController');
var PromotionController = require('./hashtag_promotion/PromotionController');
var FeedController = require('./feed/FeedController');

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
app.use('/audience/', AudienceController);
app.use('/stalkers/', StalkersController);
app.use('/hashtags/', HashtagsController);
app.use('/promotion/', PromotionController);
app.use('/feed/', FeedController);

// Running the server
app.listen(port, () => {
	console.log(`http://localhost:${port}`)
})
