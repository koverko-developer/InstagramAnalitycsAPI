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
var sleep = require('system-sleep');

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

function chekoutInF(req, res, type){
    let userId = req.params.id;
    console.log(userId);
    //console.log(error);
    firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
      var access_token = (snapshot.val() && snapshot.val().access_token) || 'Anonymous';
      var followers = (snapshot.val() && snapshot.val().audience) || 'Anonymous';
      var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
      console.log(access_token);
      console.log(username);
      //console.log(snapshot.val());
      if(access_token === 'Anonymous'){
          res.send(error);
      }else{
          var f_b = true;
          if(followers === 'Anonymous') f_b = false;
          getCookie(req, res, username, userId, username, type, f_b);
      }
    });
}
function getCookie(req,res, username, accountId, user, type, f_b) {

  var dir = __dirname + "/cookies/"+username+".json";
  dir = dir.replace('audience', 'auth');
  var device = new Client.Device(username);
  var storage = new Client.CookieFileStorage(dir);
  var session = new Client.Session(device, storage)

    //console.log(count);
    var readStream = fs.createReadStream(dir);
    readStream
    .on('data', function (chunk) {
      d = chunk;
      //console.log(d);
      console.log('set Cookie');
      if(type === 1) setCookie(req,d, res, session, accountId, dir, user, f_b);
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

async function setCookie(req,data_cookie, res, session, accountId, dir, user, f_b) {
  session.getAccount()
    .then(function(account) {
    var count_followers = account.params['followerCount'];
    var feed = new Client.Feed.AccountFollowers(session, accountId );
    var cursor;
    var moreAvailable;
    var result = x(session, accountId , res, f_b);
    //res.send(result);
    fs.writeFile(dir, data_cookie , function(err) {
      if(err) {
      }else {
       //res.send(count_followers)
      }
    });

    })
}
async function x(session, accountId, res, f_b){
  if(f_b) {
    firebase.database().ref('/users/' + accountId + "/audience/progress/").set({
        value: true,
      });
  }
  var feed = new Client.Feed.AccountFollowers(session, accountId);
  const allResults = await feed.all();

   console.log('f_b = ' + f_b);
   if(!f_b) {
     for(var k in allResults){
     firebase.database().ref('/users/' + accountId + "/audience/followers_old/" +allResults[k]['_params']['id'] ).set({
         id: allResults[k]['_params']['id'],
         username : allResults[k]['_params']['username'],
         full_name : allResults[k]['_params']['fullName'],
         profile_picture : allResults[k]['_params']['profilePicUrl'],
       });
      }
      var count = allResults.length;
      console.log('count_f = '+count);
      var response = JSON.stringify ({
        "count_followers" : count,
        "count_followers_on" :0,
        "count_followers_off" :0
      });
      res.send(JSON.parse(response));
    }else{
      var old_user_ids = [];
      var old_user_ids_fb = [];

      for(var k in allResults){
        old_user_ids[old_user_ids.length] = allResults[k]['_params']['id'];
      }
      firebase.database().ref('/users/' + accountId + "/audience/followers_old/").once('value', (snap) => {
          let data = snap.val();
          let dataWithKeys = Object.keys(data).map((key) => {
             var obj = data[key];
             //old_user_ids_fb[old_user_ids_fb.length] = obj.id;
             obj._key = key;
             return obj;
          });

          for (var k in dataWithKeys){
            //console.log(dataWithKeys[k]['id']);
            old_user_ids_fb[old_user_ids_fb.length] = dataWithKeys[k]['id'];
          }



          //console.log
          // get follower on
          var count_u_old = old_user_ids.length;
          for( var k in old_user_ids){

            if(old_user_ids_fb.indexOf(old_user_ids[k]) === -1) {
              let date_now = new Date();
              console.log('user dont in fb = ' + old_user_ids[k] + ' in date = '+ date_now);
              firebase.database().ref('/users/' + accountId + "/audience/followers_old/" +allResults[k]['_params']['id'] ).set({
                  id: allResults[k]['_params']['id'],
                  username : allResults[k]['_params']['username'],
                  full_name : allResults[k]['_params']['fullName'],
                  profile_picture : allResults[k]['_params']['profilePicUrl']
                });
                firebase.database().ref('/users/' + accountId + "/audience/followers_off/" + old_user_ids[k] ).remove();
              //sleep(200);
              firebase.database().ref('/users/' + accountId + "/audience/followers_on/" +allResults[k]['_params']['id'] ).set({
                  id: allResults[k]['_params']['id'],
                  username : allResults[k]['_params']['username'],
                  full_name : allResults[k]['_params']['fullName'],
                  profile_picture : allResults[k]['_params']['profilePicUrl'],
                  at : date.format(date_now, 'DD-MM-YYYY'),
                });

            }
          }

          for(var j in old_user_ids_fb){
            if(old_user_ids.indexOf(old_user_ids_fb[j]) === -1){
              var us = old_user_ids_fb[j];
              console.log('unfollows user '+ us + ' from fb');
              let date_now = new Date();
              firebase.database().ref('/users/' + accountId + "/audience/followers_old/" + us ).once('value')
              .then(function(snapshot) {
                firebase.database().ref('/users/' + accountId + "/audience/followers_off/" + snapshot.val().id ).set({
                    id: snapshot.val().id,
                    username : snapshot.val().username,
                    full_name : snapshot.val().full_name,
                    profile_picture : snapshot.val().profile_picture,
                    at : date.format(date_now, 'DD-MM-YYYY'),
                  });
                  //sleep(200);
                  firebase.database().ref('/users/' + accountId + "/audience/followers_old/" + snapshot.val().id ).remove();
                  firebase.database().ref('/users/' + accountId + "/audience/followers_on/" + snapshot.val().id ).remove();
              })
            }

          }

          firebase.database().ref('/users/' + accountId + "/audience/progress/").set({
              value: false,
            });
        });


    }


  res.send('allResults[0]');
}



function compare(a,b) {
  if (b.count_comments < a.count_comments)
    return -1;
  if (b.count_comments > a.count_comments)
    return 1;
  return 0;
}
module.exports = posts;
