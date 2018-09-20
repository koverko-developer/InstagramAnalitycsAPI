var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var firebase = require('firebase');
var db = require('../db');
var database = firebase.database();

var auth = express.Router();
auth.use(bodyParser.urlencoded({ extended: true }));
auth.use(bodyParser.json());

auth.route('/')
    .get((req, res) => {

    })
    .post((req, res) => {
      getUserInfo(req, res);
    })

function getUserInfo(req, res) {
  var token = 'req.body.access_token';
  if(req.body.access_token != 'undefined') token = req.body.access_token;
    console.log(req.body.access_token);
    request('https://api.instagram.com/v1/users/self/?access_token='+token, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //console.log('body:', body); // Print the HTML for the Google homepage.
        if(error == null ){
          chekoutInF(req, res, body);
        }else {
          res.send(body);
        }
    });

}

function chekoutInF(req, res, body){
    //res.send(acc)
    //var str = JSON.stringify(body);
    var b = JSON.parse(body);
    let userId = b['data']['id'];
    let userName = b['data']['username'];
    let userFName = b['data']['full_name'];
    let userPicture = b['data']['profile_picture'];
    console.log(userId);

    firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
      var username = (snapshot.val() && snapshot.val().token) || 'Anonymous';
      if(username === 'Anonymous'){

        firebase.database().ref('/users/' + userId).set({
            id: userId,
            access_token: req.body.access_token,
            username : userName,
            full_name : userFName,
            profile_picture : userPicture,
            cookie : req.body.cookie
          });
          res.send(b)

      }else{
          res.send(b)
      }
    });
}

module.exports = auth;
