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
var Stalker = require('../model/Stalker');
var error = new Error();
var userInfo = new UserInfo();
var database = firebase.database();

var stalkers = express.Router();
stalkers.use(bodyParser.urlencoded({ extended: true }));
stalkers.use(bodyParser.json());


stalkers.route('/:id/')
    .get((req, res) => {
    })
    .post((req, res) => {
      chekoutInF(req, res);
    })


function chekoutInF(req, res){
    let userId = req.params.id;
    console.log(userId);
    //console.log(error);
    firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
      var access_token = (snapshot.val() && snapshot.val().access_token) || 'Anonymous';
      var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
      var stalkers = (snapshot.val() && snapshot.val().audience) || 'Anonymous';
      console.log(access_token);
      console.log(username);
      if(access_token === 'Anonymous'){
          res.send(error);
      }else{
          getCookie(stalkers, req, res, username, userId, username);
      }
    });
}
function getCookie(stalkers, req,res, username, accountId, user) {

  var dir = __dirname + "/cookies/"+username+".json";
  dir = dir.replace('stalkers', 'auth');
  var device = new Client.Device(username);
  var storage = new Client.CookieFileStorage(dir);
  var session = new Client.Session(device, storage)

  var count = 1;
  if(req.body.count_media) count = req.body.count_media;
    console.log(count);
    console.log('set Cookie');
      var response = JSON.stringify({
        'type' : 'ok',
        'code' : 201,
      })
    res.send(JSON.parse(response));

    firebase.database().ref('/users/' + accountId + "/stalkers/progress/").set({
        value: true,
      });


    if(stalkers === 'Anonymous')x(d, res, count, session, accountId, dir, user);
    else setCookieLikes(d, res, count, session, accountId, dir, user);
}
function setCookieLikes(data, res, count_m, session, accountId, dir, user) {

  var old_user_ids_fb = []
  var stalkers_obj = [];
  var sort_stalkers_id = [];
  var sort_stalkers_uname = [];
  var sort_stalkers_fullname = [];
  var sort_stalkers_picture = [];
  var sort_stalkers_col_like = [];
  var sort_stalkers_col_comments = [];
  firebase.database().ref('/users/' + accountId + "/audience/followers_old/").once("value", function(snapshot) {
     snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
      old_user_ids_fb[old_user_ids_fb.length] = childData.id;
     });

     console.log('stalkesr true');


      var feed = new Client.Feed.UserMedia(session, accountId);
      Promise.mapSeries(_.range(count_m), function() {
          return feed.get();
         })
         .then(function(results) {
             // result should be Media[][]
             var media = _.flatten(results);

             var rand_coll = media.length *2;
             var rand_coll_true = 0;
             for(var k in media){

               console.log(media[k]['id']);
               Client.Media.likers(session, media[k]['id'])
                    .then(function (likes) {
                    rand_coll_true += 1;
                    for (var k in likes){
                      var uname = likes[k]['_params']['username'];
                      var fullName = likes[k]['_params']['fullName'];
                      var picture = likes[k]['_params']['picture'];
                      var id= likes[k]['_params']['id'];
                      if(k == likes.length -1) checkcInArr(res, rand_coll, rand_coll_true, uname,fullName , id, picture,
                                  1, 0, old_user_ids_fb, stalkers_obj, true, sort_stalkers_id, sort_stalkers_uname,
                                  sort_stalkers_fullname, sort_stalkers_picture, sort_stalkers_col_like, sort_stalkers_col_comments, accountId);
                      else checkcInArr(res, rand_coll, rand_coll_true, uname,fullName , id, picture,
                                  1, 0, old_user_ids_fb, stalkers_obj, false, sort_stalkers_id, sort_stalkers_uname,
                                  sort_stalkers_fullname, sort_stalkers_picture, sort_stalkers_col_like, sort_stalkers_col_comments, accountId);
                     }
                     })
                    .catch(function (err) {
                        console.log(err);
                    });

                    const feed = new Client.Feed.MediaComments(session, media[k]['id']);
                		let originalCursor = feed.getCursor();
                		feed.get().then(function(comments) {
                        rand_coll_true++;
                        var count = 0;
                      _.each(comments, function(comment)  {
                                count++;
                                console.log('this is comment');
                                console.log(comment['params']['account']['username']);
                                console.log(comment['params']['account']['id']);
                                console.log('---------------');
                                var uname = comment['params']['account']['username'];
                                var picture = comment['params']['account']['picture'];
                                var fullName = comment['params']['account']['fullName'];
                                var id = comment['params']['account']['id'];

                                if(uname != user){

                                    if(count == comments.length){
                                      checkcInArr(res, rand_coll, rand_coll_true, uname,fullName , id, picture,
                                                  0, 1, old_user_ids_fb, stalkers_obj, true, sort_stalkers_id, sort_stalkers_uname,
                                                  sort_stalkers_fullname, sort_stalkers_picture, sort_stalkers_col_like, sort_stalkers_col_comments,accountId);
                                    }else {
                                      checkcInArr(res, rand_coll, rand_coll_true, uname,fullName , id, picture,
                                                  0, 1, old_user_ids_fb, stalkers_obj, false, sort_stalkers_id, sort_stalkers_uname,
                                                  sort_stalkers_fullname, sort_stalkers_picture, sort_stalkers_col_like, sort_stalkers_col_comments,accountId);
                                    }

                                }

                            })
                        }).catch(function(err) {
                          console.error(err.message)}
                        );


             }
           })
          .catch(function (err) {
                  console.log(err);
          });
    });


  }
function checkcInArr(res, rand_coll, rand_coll_true, username, fullName,
    userId, picture, likesCount, commentsCount, old_user_ids_fb, stalkers_obj, b, sort_stalkers_id, sort_stalkers_uname,
    sort_stalkers_fullname, sort_stalkers_picture, sort_stalkers_col_like, sort_stalkers_col_comments, accountId) {

    try{

      if(old_user_ids_fb.indexOf(userId) === -1) {
          //console.log('undefined '+userId+ '  '+username);
          if(sort_stalkers_id.indexOf(userId) === -1) {
            sort_stalkers_id[sort_stalkers_id.length] = userId;
            sort_stalkers_uname[sort_stalkers_uname.length] = username;
            sort_stalkers_fullname[sort_stalkers_fullname.length] = fullName;
            sort_stalkers_picture[sort_stalkers_picture.length] = picture;
            sort_stalkers_col_like[sort_stalkers_col_like.length] = likesCount;
            sort_stalkers_col_comments[sort_stalkers_col_comments.length] = commentsCount;
          }else {
            sort_stalkers_col_like[sort_stalkers_id.indexOf(userId)] =
                    sort_stalkers_col_like[sort_stalkers_id.indexOf(userId)] + likesCount;
            sort_stalkers_col_comments[sort_stalkers_id.indexOf(userId)] =
                    sort_stalkers_col_comments[sort_stalkers_id.indexOf(userId)] + commentsCount;
          }
      }

      if(b){
        if(rand_coll == rand_coll_true)

          firebase.database().ref('/users/' + accountId + "/stalkers/users/").set({
              value: null,
            });

          for(var j in sort_stalkers_id){
            console.log(sort_stalkers_uname[j] + ' --- '+ sort_stalkers_col_like[j] + '-----' + sort_stalkers_col_comments[j]);
            var key = firebase.database().ref('/users/' + accountId + "/stalkers/users/").push();
            key.set({
                id    : sort_stalkers_id[j],
                uname : sort_stalkers_uname[j],
                fullname : sort_stalkers_fullname[j],
                picture : sort_stalkers_picture[j],
                col_like : sort_stalkers_col_like[j],
                col_comments : sort_stalkers_col_comments[j]
            });
          }
          firebase.database().ref('/users/' + accountId + "/stalkers/progress/").set({
              value: false,
            });
        }
        else console.log('wait '+rand_coll_true + ' from '+rand_coll);
      }
    }
    catch(err){
      console.log(err);
    }

    // if(stalkers_obj.length != 0){
    //   for(var k in stalkers_obj){
    //     if(stalkers_obj[k].getid() == userId) {
    //       stalkers_obj[k].setcount_likes(likesCount);
    //       stalkers_obj[k].setcount_comments(commentsCount);
    //     }else {
    //       var stalker = new Stalker(username, fullName, picture, userId);
    //       stalkers_obj.push(stalker);
    //     }
    //   }
    // }else {
    //   var stalker = new Stalker(username, fullName, picture, userId);
    //   stalkers_obj.push(stalker);
    // }

}
async function x(data, res, count, session, accountId, dir, user){
  // firebase.database().ref('/users/' + accountId + "/audience/progress/").set({
  //     value: true,
  // });
  console.log('stalkesr false');
  //res.send('end');
  var feed = new Client.Feed.AccountFollowers(session, accountId);
  const allResults = await feed.all();

  for(var k in allResults){
  firebase.database().ref('/users/' + accountId + "/audience/followers_old/" +allResults[k]['_params']['id'] ).set({
      id: allResults[k]['_params']['id'],
      username : allResults[k]['_params']['username'],
      full_name : allResults[k]['_params']['fullName'],
      profile_picture : allResults[k]['_params']['profilePicUrl'],
    });
   }

   setCookieLikes(data, res, count, session, accountId, dir, user);
}
  module.exports = stalkers;
