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
var error = new Error();
var userInfo = new UserInfo();
var database = firebase.database();
let date = require('date-and-time');

var hashtags = express.Router();
hashtags.use(bodyParser.urlencoded({ extended: true }));
hashtags.use(bodyParser.json());

// type 1 - all posts

hashtags.route('/:id')
    .get((req, res) => {
    })
    .post((req, res) => {
      chekoutInF(req, res, 1);
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
  dir = dir.replace('hashtags', 'auth');
  var device = new Client.Device(username);
  var storage = new Client.CookieFileStorage(dir);
  var session = new Client.Session(device, storage)

  firebase.database().ref('/users/' + accountId + "/hashtags/progress/").set({
      value: true,
    });

  var count = 1;
  if(req.body.count_media) count = req.body.count_media;
    console.log(count);
    var readStream = fs.createReadStream(dir);
    readStream
    .on('data', function (chunk) {
      d = chunk;
      //console.log(d);
      console.log('set Cookie');
        var response = JSON.stringify({
          'type' : 'ok',
          'code' : 201,
        })
      res.send(JSON.parse(response));
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
  var start = new Date();
  var feed = new Client.Feed.UserMedia(session, accountId);//313212819
  var allHashTags = [];
  var sortHashTags = [];
  var allHT = [];
  var likeHT = [];
  var commentHT = [];
      console.log('count media = ' + count_m);

      Promise.mapSeries(_.range(count_m), function() {
       return feed.get();
      })
      .then(function(results) {
      var media = _.flatten(results);
      //console.log(media[0]);
      for(var k in media){
        var text = media[k]['_params']['caption'];
        //console.log(media[k]['_params']['caption']);
        //console.log('------------------------------');
        if(text){
          var arr_text = text.split('#');
          if(arr_text.length > 1){
            for(var j = 1;j < arr_text.length; j++){
              var a = arr_text[j].replace(/[^a-zA-Z0-9а-яА-Я]/g, ' ');
              var z = '#' + a.split(' ')[0]
              allHashTags[allHashTags.length] = z;
              allHT[allHT.length] = 1;
              likeHT[likeHT.length] = media[k]['_params']['likeCount'];
              commentHT[commentHT.length] = media[k]['_params']['commentCount'];
              if(sortHashTags.indexOf(z) === -1) {
                sortHashTags[sortHashTags.length] = z;
              }
            }
          }else{
            //console.log(arr_text);
            if(!arr_text[0].indexOf('@#') === -1){
              var a = arr_text[0].replace(/[^a-zA-Z0-9а-яА-Я]/g, ' ');
              var z = '#' + a.split(' ');
              allHashTags[allHashTags.length] = z;
              allHT[allHT.length] = 1;
              likeHT[likeHT.length] = media[k]['_params']['likeCount'];
              commentHT[commentHT.length] = media[k]['_params']['commentCount'];
              if(sortHashTags.indexOf(z) === -1) {
                sortHashTags[sortHashTags.length] = z;
              }
            }

          }
        }
      //  console.log('**************');
      }

      var arr_obj_HT = [];


      for(var k in sortHashTags){
        var ht = new HashtagInfo(0, 0, 0, sortHashTags[k]);
        for(var j in allHashTags){

          if(allHashTags[j] == sortHashTags[k]) {
            //console.log(sortHashTags[k] + ' in position '+j);
            ht.setcount_like(likeHT[j]);
            ht.setcount_all(1);
            ht.setcount_comments(commentHT[j]);
          }
        }
        //console.log(allHashTags.indexOf(sortHashTags[k]) + sortHashTags[k]);
        arr_obj_HT.push(ht);
      }
      var arr_CommentsHT = arr_obj_HT.sort(compare);
      var arr_LikeHT = arr_obj_HT.sort(compareLike);
      var arr_AllHT = arr_obj_HT.sort(compareAll);

      firebase.database().ref('/users/' + accountId + "/hashtags/progress/").set({
          value: false,
        });

      firebase.database().ref('/users/' + accountId + "/hashtags/ht_comments/").set({
          value: arr_CommentsHT,
        });

      firebase.database().ref('/users/' + accountId + "/hashtags/ht_like/").set({
          value: arr_LikeHT,
       });

      firebase.database().ref('/users/' + accountId + "/hashtags/ht_all/").set({
           value: arr_AllHT,
      });
      // arr_CommentsHT.length = 10;
      // //arr_LikeHT.length = 10;
      // arr_AllHT.length = 10;
      //
      // for(var i =0; i< arr_LikeHT.length; i++){
      //   if(i != 5){
      //     console.log(arr_LikeHT[i]);
      //   }else {
      //     return;
      //   }
      // }
      //console.log(sortHashTags.length + '---------' + allHashTags.length);
      //console.log(allHT.length + '---------' + likeHT.length + '---------------' + commentHT.length);
      //res.send(arr_LikeHT);

      //console.log(arr_AllHT);
    var end = new Date();
    console.log('Цикл занял '+(end - start)+' ms');
      fs.writeFile(dir, data , function(err) {
        if(err) {
        }else {
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

function compareLike(a,b) {
  if (b.count_like < a.count_like)
    return -1;
  if (b.count_like > a.count_like)
    return 1;
  return 0;
}
function compareAll(a,b) {
  if (b.count_all < a.count_all)
    return -1;
  if (b.count_all > a.count_all)
    return 1;
  return 0;
}
module.exports = hashtags;
