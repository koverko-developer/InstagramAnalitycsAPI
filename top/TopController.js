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
var UserInfo = require('../model/UserInfo');
var TopUser = require('../model/TopUser');
var error = new Error();
var userInfo = new UserInfo();
var database = firebase.database();

var top = express.Router();
top.use(bodyParser.urlencoded({ extended: true }));
top.use(bodyParser.json());


top.route('/:id/comments')
    .get((req, res) => {

    })
    .post((req, res) => {
      chekoutInF(req, res, 1);
    })
top.route('/:id/likes')
    .get((req, res) => {
    })
    .post((req, res) => {
      chekoutInF(req, res, 2);
    })

function getUserInfo(req, res) {
  var token = req.body.access_token;
  if(!req.body.access_token) token = '123456';
    console.log(req.body.access_token);
    request('https://api.instagram.com/v1/users/self/?access_token='+token, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        if(error == null ){
          var b = JSON.parse(body);
          if(!b['meta']['error_type']) chekoutInF(req, res, body);
          else {
            res.send(body);
          }
        }else {
          res.send(body);
        }
    });

}

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
  dir = dir.replace('top', 'auth');
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
      if(type === 1) setCookie(d, res, count, session, accountId, dir, user);
      else if(type === 2) setCookieLikes(d, res, count, session, accountId, dir, user);
    })
    .on('end', function () {
        console.log('All the data in the file has been read');
        readStream.destroy();
    })
    .on('close', function (err) {
      console.log('Stream has been destroyed and file has been closed');
    });
}

function setCookie(data, res, count_m, session, accountId, dir, user) {

  var topUsers = [];
  var usersAll = []
  var usersSort = []
  var usersProfile = []

  var start = new Date();
  var feed = new Client.Feed.UserMedia(session, accountId);
  console.log('count media = ' + count_m);
      Promise.mapSeries(_.range(count_m), function() {
       return feed.get();
      })
      .then(function(results) {
      // result should be Media[][]
      var media = _.flatten(results);
      //console.log(media[1]);
      var count_promise = 0;
      var count_promise_true = 0;
      for(var k in media){
        if(media[k]['_params']['commentCount'] > 0) {
            //console.log(media[k]['id']);
            count_promise += media[k]['_params']['commentCount'];
            const feed = new Client.Feed.MediaComments(session, media[k]['id']);
        		let originalCursor = feed.getCursor();
        		feed.get().then(function(comments) {
              _.each(comments, function(comment) {
                        var uname = comment['params']['account']['username'];
                        var picture = comment['params']['account']['picture'];
                        if(uname != user){
                          //topUsers.push(usertop);
                          usersAll[usersAll.length] = uname;
                          if(usersSort.indexOf(uname) === -1) {
                            usersSort[usersSort.length] = uname;
                            usersProfile[usersProfile.length] = picture;
                          }
                        }
                        count_promise_true ++;
                        if(count_promise_true == count_promise) {

                          for(var k in usersSort){
                            var col = 0;

                            for(var j in usersAll){
                              if(usersAll[j] == usersSort[k]) col++;
                            }

                            var usertop = new TopUser(usersSort[k], '', usersProfile[k]);
                            usertop.setcount_comments(col);
                            topUsers.push(usertop);

                          }

                          console.log('end');
                          console.log(usersAll);
                          console.log(usersSort);
                          console.log(usersProfile);
                          topUsers.sort(compare);
                          if(topUsers.length > 5)topUsers.length = 5;
                          res.send(topUsers);
                        }

                    })
                    //console.log('more available ' + feed.mor  eAvailable);
                });
        }
      }

    var end = new Date();
    console.log('Цикл занял '+(end - start)+' ms');

    var urls = _.map(media, function(medium) {
       return _.last(medium)
    });
    //console.log(results);
      fs.writeFile(dir, data , function(err) {
        if(err) {
        }else {

        }
      });
    })

}

function setCookieLikes(data, res, count_m, session, accountId, dir, user) {
  var topUsers = []
  var usersAll = []
  var usersSort = []

  var start = new Date();
  var feed = new Client.Feed.UserMedia(session, accountId);
  console.log('count media = ' + count_m);
      Promise.mapSeries(_.range(count_m), function() {
       return feed.get();
      })
      .then(function(results) {
      // result should be Media[][]
      var media = _.flatten(results);
      //console.log(media[1]);
      var count_promise = 0;
      var count_promise_true = 0;
      for(var k in media){
          //console.log(media[k]['_params']['topLikers']);
          var topL = media[k]['_params']['topLikers'];
          for(var k in topL){
            //console.log(topL[k]);
            usersAll[usersAll.length] = topL[k];
            if(usersSort.indexOf(topL[k]) === -1) {
              usersSort[usersSort.length] = topL[k];
            }
          }

      }

      for(var k in usersSort){
        var col = 0;

        for(var j in usersAll){
          if(usersAll[j] == usersSort[k]) col++;
        }

        var usertop = new TopUser(usersSort[k], '', '');
        usertop.setcount_comments(col);
        topUsers.push(usertop);
        topUsers.sort(compare);
        if(topUsers.length > 5)topUsers.length = 5;
      }

      var newUserTops = []

      for(var k in topUsers){
        count_promise++;
        console.log(topUsers[k].getusername());
        Client.Account.searchForUser(session, topUsers[k].getusername())
        .then(function(account) {
           var usernames = account['_params']['username'];
           var fillnames = account['_params']['fullName'];
           //console.log(account['_params']['profilePicUrl']);
           var pic = account['_params']['profilePicUrl'];
           //console.log('-------------------------');
           var usertop = new TopUser(usernames, fillnames, pic);
           newUserTops.push(usertop);
           count_promise_true++;
           if(count_promise_true == count_promise) {
             res.send(newUserTops)
           }else {
             console.log('wait');
           }
           return account.id; })
        .catch(function(err) {
          console.error(err.message)}
        );
      }

      //res.send(topUsers)

      //console.log(usersAll);
      //console.log(usersSort);

    var end = new Date();
    console.log('Цикл занял '+(end - start)+' ms');

    var urls = _.map(media, function(medium) {
       return _.last(medium)
    });
    //console.log(results);
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
module.exports = top;
