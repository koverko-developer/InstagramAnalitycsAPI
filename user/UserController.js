var express = require('express');
var request = require('request');
var Client = require('instagram-private-api').V1;
var device = new Client.Device('koverko_dev');

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

    })
    .post((req, res) => {
      getUserInfo(req, res);
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
      console.log(access_token);
      if(access_token === 'Anonymous'){
          res.send(error);
      }else{
          if(!req.body.url) getAllPosts(req,res, access_token);
          else getAllPosts(req, res, access_token, req.body.url);
      }
    });
}

function getAllPosts(req, res, access_token, url){
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
          //console.log(body);
          getCounts(res,list['data'], req);

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

async function getCounts(res, list, req) {
  userInfo = new UserInfo();
  //console.log(list);
  for (var k in list) {
      console.log(list[k]['likes']['count']);

      if(list[k]['type'] === 'image') userInfo.setcount_photo(1);
      else if(list[k]['type'] === 'video') {
        //var a = await getVideoViewCount(list[k]['user']['username'], list[k]['id'])
        //console.log('A--------------'+a);
        //userInfo.setcount_video(1);
      }
      else userInfo.setcount_carousel(1000);
      userInfo.setcount_like(list[k]['likes']['count'])
  }

  res.send(userInfo);

}

async function getVideoViewCount(userName, media_id) {
  // var dir = __dirname + "/cookies/"+userName+".json";
  // dir = dir.replace('user', 'auth');
  // console.log(dir);
  // var storage = new Client.CookieFileStorage(dir);
  // var session = new Client.Session(device, storage);
  //console.log(media_id);
  // new Client.Request(session)
  //         .setMethod('GET')
  //         .setResource('mediaInfo', {mediaId : media_id})
  //         .send()
  //         .then(function (json) {
  //           //console.log(json);
  //           //console.log(new Client.Media(session, json.items[0]['taken_at']));
  //           return new Client.Media(session, json.items[0]);
  //         })
  // return new Request(session)
  //     .setMethod('GET')
  //     .setResource('mediaInfo', {mediaId: mediaId})
  //     .send()
  //     .then(function(json) {
  //         return new Media(session, json.items[0])
  //     })
  //console.log(userName);

}

module.exports = user;
