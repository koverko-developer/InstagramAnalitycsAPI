var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var firebase = require('firebase');
var db = require('../db');
var Error = require('../model/Error');
var error = new Error();
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
          if(!req.body.url) getAllPosts(res, access_token);
          else getAllPosts(res, access_token, req.body.url);
      }
    });
}

function getAllPosts(res, access_token, url){
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
          console.log(list['pagination']);
          res.send(list);

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

module.exports = user;
