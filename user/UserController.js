var express = require('express');
var request = require('request');
var _ = require('lodash');
var Promise = require('bluebird');
var fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Client = require('instagram-private-api').V1;
//var device = new Client.Device('koverko_dev');

var TopUser = require('../model/TopUser');

var bodyParser = require('body-parser');
var firebase = require('firebase');
var db = require('../db');
var Error = require('../model/Error');
var UserInfo = require('../model/UserInfo');
var error = new Error();
var userInfo = new UserInfo();
var database = firebase.database();

var user = express.Router();
user.use(bodyParser.urlencoded({ extended: true }));
user.use(bodyParser.json());


user.route('/info/')
    .get((req, res) => {

        getCookie(res);

    })
    .post((req, res) => {
      getUserInfo(req, res);
      //getCookie(req,res);
    })
user.route('/:id/media/info')
    .get((req, res) => {

    })
    .post((req, res) => {
      chekoutInF(req, res);
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

function chekoutInF(req, res){

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
        var response = JSON.stringify({
          'type' : 'ok',
          'code' : 201,
        })
          res.send(JSON.parse(response));
          // if(!req.body.url) getAllPosts(req,res, access_token);
          //else getAllPosts(req, res, access_token, req.body.url);
          getCookie(req, res, username, userId);
      }
    });
}

function getAllPosts(req, res, access_token, url){

  userInfo = new UserInfo();
  var start = new Date
  if(!url) var url =  'https://api.instagram.com/v1/users/self/media/recent/?access_token='+access_token;
  request(url, function (errors, response, body) {
        console.log('error:', errors); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //console.log('body:', body); // Print the HTML for the Google homepage.
        if(errors == null ){
          var list = JSON.parse(body);
          var end = new Date;
          console.log("Цикл занял " + (end - start) + " ms" );
          //console.log(list);
          //res.send(body);
          getCounts(res,list, req, access_token);

        }else {
          console.log(errors);
          res.send(error);
        }
    });

}

function getUserInfo(req, res) {
  var token = req.body.access_token;
  if(!req.body.access_token) token = '123456';
    console.log(req.body.access_token);
    request('https://api.instagram.com/v1/users/self/?access_token='+token, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        res.send(body);
    });

}

async function getCounts(res, list, req, access_token) {
  var col_promise = 0;
  var col_promise_true = 0;
  var next_url = list['pagination']['next_url'];
  if(next_url) userInfo.setnext_url(next_url);
  console.log(next_url);
  list = list['data']
  for (var k in list) {
      //console.log(list[k]['comments']['count']);
      var count_c = list[k]['comments']['count'];
      var id_m = list[k]['id'];
      console.log(count_c);
      // if(count_c > 0) {
      //   col_promise +=1;
      //   var url =  'https://api.instagram.com/v1/media/'+ id_m +'/comments?access_token='+access_token;
      //   var initializePromise = initialize(url);
      //   var b = initializePromise.then(function(result) {
      //       userDetails = result;
      //       console.log("Initialized user details");
      //       col_promise_true +=1;
      //       console.log(result['data'][0]['from']['username']);
      //       //var obj = JSON.parse(result);
      //       //console.log(obj);
      //       checkPromise(res,col_promise, col_promise_true)
      //       return userDetails;
      //   }, function(err) {
      //       console.log(err);
      //   })
      //   //console.log(b);
      // }
      if(list[k]['type'] === 'image') userInfo.setcount_photo(1);
      else if(list[k]['type'] === 'video') {
        //var a = await getVideoViewCount(list[k]['user']['username'], list[k]['id'])
        //console.log('A--------------'+a);

        userInfo.setcount_video(1);
      }
      else userInfo.setcount_carousel(1);
      userInfo.setcount_like(list[k]['likes']['count'])
      userInfo.setcount_comments(list[k]['comments']['count'])
  }
  // console.log('col_p='+col_promise);
  // console.log('res send');
     res.send(userInfo);
}
function checkPromise(res, col_promise, col_promise_true) {

  if(col_promise_true == col_promise) res.send(userInfo);
  else console.log('waiting');

}
function initialize(urli) {
    // Setting URL and headers for request
    var options = {
        url: urli,
        headers: {
            'User-Agent': 'request'
        }
    };
    // Return new promise
    return new Promise(function(resolve, reject) {
    	// Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
    })
}
async function getVideoViewCount(userName, media_id) {

  firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    var d = (snapshot.val() && snapshot.val().cookie) || 'Anonymous';

    var dir = __dirname + "/cookies/"+userName+".json";
    dir = dir.replace('user', 'auth');
    const file = fs.createWriteStream(dir);
    file.write(d)
    file.end();


    //console.log(dir);
    var storage = new Client.CookieFileStorage(dir);
    var session = new Client.Session(device, storage);
    //console.log(media_id);
    new Client.Request(session)
            .setMethod('GET')
            .setResource('mediaInfo', {mediaId : media_id})
            .send()
            .then(function (json) {
              console.log(json);
              console.log(new Client.Media(session, json.items[0]['taken_at']));
              userInfo.setcount_video(1)
              return new Client.Media(session, json.items[0]);
            })
    // return new Request(session)
    //     .setMethod('GET')
    //     .setResource('mediaInfo', {mediaId: mediaId})
    //     .send()
    //     .then(function(json) {
    //         return new Media(session, json.items[0])
    //     })
    console.log(userName);

  });

}

function getCookie(req,res, username, accountId) {

   firebase.database().ref('/users/' + accountId + "/info/media/progress/").set({
      value: true,
    });

    firebase.database().ref('/users/' + accountId).once('value').then(function(snapshot) {
      var d = (snapshot.val() && snapshot.val().cookie) || 'Anonymous';
      console.log(d);
      var dir = __dirname + "/cookies/"+username+".json";
      dir = dir.replace('user', 'auth');
      const file = fs.createWriteStream(dir);
      file.write(JSON.stringify(d))
      file.end();

      var device = new Client.Device(username);
      var storage = new Client.CookieFileStorage(dir);
      var session = new Client.Session(device, storage)

      var count = 1;
      if(req.body.count_media) count = req.body.count_media;
        console.log('set cookie');
        setCookie(d, res, count, session, accountId, dir);
        //setCookieC(d, res, count, session, accountId, dir, username)
        //setCookieLikes(d, res, count, session, accountId, dir, username)
      });
}
function setCookie(data, res, count_m, session, accountId, dir) {
  console.log('set cookie');
  var feed = new Client.Feed.UserMedia(session, accountId);

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
        console.log(media[k]['id']);
        //console.log(k +"----like---"+ media[k]['_params']['topLikers']);
        //console.log(k +"----view---"+ media[k]['_params']['viewCount']);
        count_like += media[k]['_params']['likeCount'];
        count_comments += media[k]['_params']['commentCount'];
        if(media[k]['_params']['viewCount']) count_view += media[k]['_params']['viewCount'];
        if(media[k]['_params']['mediaType'] === 2) count_video++;
        else if(media[k]['_params']['mediaType'] === 1) count_photo++;
        else if(media[k]['_params']['mediaType'] === 8) count_carousel++;

        // const feed = new Client.Feed.MediaComments(session, media[k]['id']);
        //
      	// 	let originalCursor = feed.getCursor();
      	// 	feed.get().then(function(comments) {
      	// 		//console.log(comments);
        //     _.each(comments, function(comment) {
        //               console.log(comment);
        //           })
        //           //console.log('more available ' + feed.moreAvailable);
        //       });
      }

    m_userInfo.setcount_carousel(count_carousel);
    m_userInfo.setcount_photo(count_photo);
    m_userInfo.setcount_video(count_video);
    m_userInfo.setcount_view(count_view);
    m_userInfo.setcount_comments(count_comments);
    m_userInfo.setcount_like(count_like);

    var end = new Date();
    console.log('Цикл занял '+(end - start)+' ms');
    //res.send(m_userInfo);
    firebase.database().ref('/users/' + accountId + "/info/media/progress/").set({
        value: false,
      });
    console.log(m_userInfo);
    firebase.database().ref('/users/' + accountId + "/info/media/all/").set({
        value: m_userInfo,
     });
    //console.log(results);
      fs.writeFile(dir, data , function(err) {
        if(err) {
        }else {
         console.log('write data users');
        }
      });
    })

}

function setCookieC(data, res, count_m, session, accountId, dir, user) {

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
            console.log(count_promise + '  +=  ' + media[k]['_params']['commentCount']);
            count_promise += 1;
            const feed = new Client.Feed.MediaComments(session, media[k]['id']);
        		let originalCursor = feed.getCursor();
        		feed.get().then(function(comments) {
               count_promise_true ++;
              _.each(comments, function(comment)  {
                        console.log('this is comment');
                        console.log(comment['params']['account']['username']);
                        console.log(comment['params']['account']['id']);
                        console.log('---------------');
                        var uname = comment['params']['account']['username'];
                        var picture = comment['params']['account']['picture'];

                        if(uname != user){
                          usersAll[usersAll.length] = uname;
                          if(usersSort.indexOf(uname) === -1) {
                            usersSort[usersSort.length] = uname;
                            usersProfile[usersProfile.length] = picture;
                          }
                        }
                        //console.log(uname + '--' + picture);
                        var usertopssortnew = [];
                        if(count_promise_true == count_promise) {

                          for(var k in usersSort){
                            var col = 0;
                            for(var j in usersAll){
                              if(usersAll[j] == usersSort[k]) {
                                col++;
                              }
                            }

                            var usertop = new TopUser(usersSort[k], '', usersProfile[k]);
                            usertop.setcount_comments(col);
                            topUsers.push(usertop);
                          }

                          for(var i = 1; i < topUsers.length; i++){
                             var a1 = topUsers[i].getusername();
                             var a2 = topUsers[i-1].getusername();

                             if(a1 == a2) {
                               console.log(a1 + '   ==   ' + a2);
                               topUsers.splice(i);
                             }
                          }

                          console.log('end');
                          console.log(usersAll);
                          console.log(usersSort);
                          console.log(usersProfile);
                          topUsers.sort(compare);
                          //if(topUsers.length > 5)topUsers.length = 5;
                          firebase.database().ref('/users/' + accountId + "/top/comments/").set({
                              value: topUsers,
                            });
                        }else {
                          console.log('waiting '+ count_promise_true+' from '+count_promise);
                        }

                    })
                    //console.log('more available ' + feed.mor  eAvailable);
                }).catch(function(err) {
                  console.error(err.message)}
                );
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

        var rand_coll = 0;
        for(var k in media){


          count_promise++;
          console.log(media[0]['id']);
          Client.Media.likers(session, media[k]['id'])
                .then(function (likes) {
                    //console.log('get likes');
                    count_promise_true++;
                    console.log(likes.length);
                    rand_coll+=likes.length;
                    for (var k in likes){

                      var uname = likes[k]['_params']['username'];
                      var picture = likes[k]['_params']['picture'];
                      //console.log(rand_coll);
                      //console.log(uname);
                      if(uname != user){
                        usersAll[usersAll.length] = uname;
                        if(usersSort.indexOf(uname) === -1) {
                          usersSort[usersSort.length] = uname;
                          usersProfile[usersProfile.length] = picture;
                        }
                      }
                    }

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

                      console.log(topUsers);
                      topUsers.sort(compare);
                      //if(topUsers.length > 5) topUsers.length = 5;
                      firebase.database().ref('/users/' + accountId + "/top/likes/").set({
                          value: topUsers,
                        });
                      // console.log(rand_coll);
                      // console.log(usersSort);
                    }
                    else console.log('white ' + count_promise_true + ' from '+ count_promise);
                })
                .catch(function (err) {
                  console.log(err);
                });

        }
        if(count_promise_true == count_promise) {
          console.log(rand_coll);
        }
        else console.log('white ' + count_promise_true + ' from '+ count_promise);

        for(var k in media){



            //console.log(media[k]['_params']['topLikers']);
            // var topL = media[k]['_params']['topLikers'];
            // for(var k in topL){
            //   //console.log(topL[k]);
            //   usersAll[usersAll.length] = topL[k];
            //   if(usersSort.indexOf(topL[k]) === -1) {
            //     usersSort[usersSort.length] = topL[k];
            //   }
            // }

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

        // for(var k in topUsers){
        //   count_promise++;
        //   //console.log(topUsers[k].getusername());
        //   Client.Account.searchForUser(session, topUsers[k].getusername())
        //   .then(function(account) {
        //      var usernames = account['_params']['username'];
        //      var fillnames = account['_params']['fullName'];
        //      //console.log(account['_params']['profilePicUrl']);
        //      var pic = account['_params']['profilePicUrl'];
        //      //console.log('-------------------------');
        //      var usertop = new TopUser(usernames, fillnames, pic);
        //      newUserTops.push(usertop);
        //      count_promise_true++;
        //      if(count_promise_true == count_promise) {
        //        res.send(newUserTops)
        //      }else {
        //        console.log('wait');
        //      }
        //      return account.id; })
        //   .catch(function(err) {
        //     console.error(err.message)}
        //   );
        // }

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

module.exports = user;
