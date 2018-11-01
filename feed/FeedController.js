var express = require('express');
var request = require('request');
var _ = require('lodash');
var Promise = require('bluebird');
var fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Client = require('instagram-private-api').V1;
var bodyParser = require('body-parser');
var firebase = require('firebase');
var db = require('../db');
var Error = require('../model/Error');
var ChartsData = require('../model/ChartsData');
var UserInfo = require('../model/UserInfo');
var TopUser = require('../model/TopUser');
var HashtagInfo = require('../model/HashtagInfo');
var Post = require('../model/Post');
var error = new Error();
var userInfo = new UserInfo();
var database = firebase.database();
let date = require('date-and-time');

var feed = express.Router();
feed.use(bodyParser.urlencoded({ extended: true }));
feed.use(bodyParser.json());

// type 1 - all posts

feed.route('/:id')
    .get((req, res) => {
    })
    .post((req, res) => {
      chekoutInF(req, res, 1);
    })

function chekoutInF(req, res, type){
    let userId = req.params.id;
    //let userId = 313212819;
    console.log(userId);
    //console.log(error);
    firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
      var access_token = (snapshot.val() && snapshot.val().access_token) || 'Anonymous';
      var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
      console.log(access_token);
      console.log(username);
      if(access_token === 'Anonymous'){
          res.send(error);
      }else{
          getCookie(req, res, username, userId, username, type);
      }
    });
}
function getCookie(req,res, username, accountId, user, type) {

  var dir = __dirname + "/cookies/"+username+".json";
  dir = dir.replace('feed', 'auth');
  var device = new Client.Device(username);
  var storage = new Client.CookieFileStorage(dir);
  var session = new Client.Session(device, storage)

  firebase.database().ref('/users/' + accountId + "/feed/progress/").set({
      value: true,
    });

  var count = 1;
  if(req.body.count_media) count = req.body.count_media;
    console.log(count);
    console.log('set Cookie');
      var response = JSON.stringify({
        'type' : 'ok',
        'code' : 201,
      })
    res.send(JSON.parse(response));
    if(type === 1) setCookie(req,'d', res, count, session, accountId, dir, user);
}
function setCookie(req,data, res, count_m, session, accountId, dir, user) {

  firebase.database().ref('/users/' + accountId + "/feed/progress/").set({
      value: true,
    });

  var start = new Date();
  var feed = new Client.Feed.UserMedia(session, accountId);//313212819

      var posts_arr = [];
      console.log('count media = ' + count_m);

      Promise.mapSeries(_.range(count_m), function() {
       return feed.get();
      })
      .then(function(results) {
      var media = _.flatten(results);
      console.log(media[3]['_params']);
      for(var k in media){
        var mediaType = media[k]['_params']['mediaType'];
        var text = media[k]['_params']['caption'];
        var pk = media[k]['_params']['takenAt']
        var count_like = media[k]['_params']['likeCount']
        var count_commentst = media[k]['_params']['commentCount']
        var count_view = 0;
        if(media[k]['_params']['viewCount'])  count_view = media[k]['_params']['viewCount'];
        var post = new Post(mediaType, count_like,count_commentst,count_view ,pk, text);

        if(mediaType == 1){
            post.setimages(media[k]['_params']['imageVersions2']['candidates'][0]);
        }else if(mediaType == 8) {
            var carousel_media = media[k]['_params']['carouselMedia'];

            if(carousel_media[0]['_params']['images']) post.setimages(carousel_media[0]['_params']['images'][0]);
            else if(carousel_media[0]['_params']['imageVersions2']) post.setimages(carousel_media[0]['_params']['imageVersions2']['candidates'][0]);

        }else if(mediaType == 2) {
           post.setimages(media[k]['_params']['images'][0]);
           // post.setvideos(media[k]['_params']['videos']);
           // post.setduration(media[k]['_params']['video']['duration'])
        }
        posts_arr.push(post);
      //  console.log('**************');
      }

    firebase.database().ref('/users/' + accountId + "/feed/progress/").set({
      value: false,
      });
    firebase.database().ref('/users/' + accountId + "/feed/media/").set({
      posts: posts_arr,
      });
    var end = new Date();
    console.log('Цикл занял '+(end - start)+' ms');
      // fs.writeFile(dir, data , function(err) {
      //   if(err) {
      //   }else {
      //   }
      // });
    })

}


module.exports = feed;
