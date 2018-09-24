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
var error = new Error();
var userInfo = new UserInfo();
var database = firebase.database();
let date = require('date-and-time');

var posts = express.Router();
posts.use(bodyParser.urlencoded({ extended: true }));
posts.use(bodyParser.json());

// type 1 - all posts

posts.route('/:id')
    .get((req, res) => {
    })
    .post((req, res) => {
      chekoutInF(req, res, 1);
    })
posts.route('/:id/all')
    .get((req, res) => {
    })
    .post((req, res) => {
      chekoutInF(req, res, 2);
    })

function chekoutInF(req, res, type){
    let userId = req.params.id;
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
  dir = dir.replace('posts', 'auth');
  var device = new Client.Device(username);
  var storage = new Client.CookieFileStorage(dir);
  var session = new Client.Session(device, storage)

  var count = 1;
  if(req.body.count_media) count = req.body.count_media;
    console.log(count);
    var readStream = fs.createReadStream(dir);
    readStream
    .on('data', function (chunk) {
      d = chunk;
      //console.log(d);
      if(type === 1) setCookie(req,d, res, count, session, accountId, dir, user);
      //else if(type === 2) setCookieLikes(d, res, count, session, accountId, dir, user);
    })
    .on('end', function () {
        console.log('All the data in the file has been read');
        readStream.destroy();
    })
    .on('close', function (err) {
      console.log('Stream has been destroyed and file has been closed');
    });
}

function setCookie(req,data, res, count_m, session, accountId, dir, user) {

  var feed = new Client.Feed.UserMedia(session, accountId);

  var datesAll = [];
  var datesCountLikeAll = [];
  var datesCountCommentsAll = [];
  var datesCountViewssAll = [];
  var typeMediaAll = [];

  console.log('count media = ' + count_m);
  var m_userInfo = new UserInfo();
  var start = new Date();
  var count_like = 0;
  var count_view = 0;
  var count_comments = 0;
  var count_photo = 0;
  var count_video = 0;
  var count_carousel = 0;
      Promise.mapSeries(_.range(count_m), function() {
       return feed.get();
      })
      .then(function(results) {
      // result should be Media[][]
      var media = _.flatten(results);
      console.log(media[1]);
      for(var k in media){

        var d_ms = media[k]['_params']['takenAt'];
        var d = new Date(d_ms);
        var s_date = date.format(d, 'YYYY-MM-DD');
        //console.log(s_date);
        if(datesAll.indexOf(s_date) === -1){
          datesAll[datesAll.length] = s_date;
          datesCountLikeAll[datesCountLikeAll.length] = media[k]['_params']['likeCount'];
          datesCountCommentsAll[datesCountCommentsAll.length] = media[k]['_params']['commentCount'];
          if(media[k]['_params']['viewCount']) datesCountViewssAll[datesCountViewssAll.length] = media[k]['_params']['viewCount'];
          else datesCountViewssAll[datesCountViewssAll.length] = 0;
          typeMediaAll[typeMediaAll.length] = media[k]['_params']['mediaType'];
        }
        else {
          datesCountLikeAll[datesAll.indexOf(s_date)] =
                           datesCountLikeAll[datesAll.indexOf(s_date)]+ media[k]['_params']['likeCount'];
          datesCountCommentsAll[datesAll.indexOf(s_date)] =
                           datesCountCommentsAll[datesAll.indexOf(s_date)]+ media[k]['_params']['commentCount'];
          if(media[k]['_params']['viewCount']){
            datesCountViewssAll[datesAll.indexOf(s_date)] =
                             datesCountViewssAll[datesAll.indexOf(s_date)]+ media[k]['_params']['viewCount'];
          }
        }
        //console.log(media[k]['_params']['takenAt'] +'-----'+ date.format(d, 'YYYY-MM'));

        count_like += media[k]['_params']['likeCount'];
        count_comments += media[k]['_params']['commentCount'];
        if(media[k]['_params']['viewCount']) count_view += media[k]['_params']['viewCount'];
        if(media[k]['_params']['mediaType'] === 2) count_video++;
        else if(media[k]['_params']['mediaType'] === 1) count_photo++;
        else if(media[k]['_params']['mediaType'] === 8) count_carousel++;

      }


    m_userInfo.setcount_carousel(count_carousel);
    m_userInfo.setcount_photo(count_photo);
    m_userInfo.setcount_video(count_video);
    m_userInfo.setcount_view(count_view);
    m_userInfo.setcount_comments(count_comments);
    m_userInfo.setcount_like(count_like);

    var charts = [];
    for (var k in datesAll){

      var dChard = new ChartsData(typeMediaAll[k], datesAll[k], datesCountLikeAll[k],
                   datesCountCommentsAll[k], datesCountViewssAll[k]);
      charts.push(dChard);

    }

    //charts.length = 5;

    var userLikesArr = JSON.stringify ({
      'userInfoMedia' : m_userInfo,
      'chartArr' : charts
    });
    console.log(JSON.parse(userLikesArr));
    //console.log(datesCountLikeAll);
    var end = new Date();
    console.log('Цикл занял '+(end - start)+' ms');
    res.send(JSON.parse(userLikesArr));
    var urls = _.map(media, function(medium) {
       return _.last(medium)
    });
    //console.log(results);
      fs.writeFile(dir, data , function(err) {
        if(err) {
        }else {
         //console.log(count_like);
        }
      });
    })

}

function compare(a,b) {
  if (b.count_comments < a.count_comments)
    return -1;
  if (b.count_comments > a.count_comments)
    return 1;
  return 0;
}
module.exports = posts;
