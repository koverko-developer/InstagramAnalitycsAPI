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

var promotion = express.Router();
promotion.use(bodyParser.urlencoded({ extended: true }));
promotion.use(bodyParser.json());

promotion.route('/get_category/')
    .get((req, res) => {

    })
    .post((req, res) => {
      getCategoty(req, res);
    })
promotion.route('/get_pod_category/')
    .get((req, res) => {

    })
    .post((req, res) => {
      getPodCategoty(req, res);
    })
promotion.route('/add_category/')
    .get((req, res) => {

    })
    .post((req, res) => {
      addCategoty(req, res);
    })
promotion.route('/add_pod_category/')
    .get((req, res) => {

    })
    .post((req, res) => {
        addPodCategoty(req, res);
    })

function addCategoty(req, res){

    if(!req.body.name_category) {
      res.send('empty category name');
      return;
    }
    if(!req.body.icon_category) {
      res.send('empty category icon');
      return;
    }
    if(!req.body.color_category) {
      res.send('empty category color');
      return;
    }


    var key = firebase.database().ref('/promotion/categoty/').push();
    var d = new Date();
    key.set({
        name : req.body.name_category,
        icon : req.body.icon_category,
        color : req.body.color_category
      });
      res.send('success!!!!')
}

function addPodCategoty(req, res){

    if(!req.body.name_pod_category) {
      res.send('empty pod_category name');
      return;
    }
    if(!req.body.arr) {
      res.send('empty pod_category arr');
      return;
    }
    if(!req.body.category) {
      res.send('empty pod_category category');
      return;
    }

    if(!req.body.language) {
      res.send('empty pod_category language');
      return;
    }

    var key = firebase.database().ref('/promotion/pod_category/').push();
    var d = new Date();
    key.set({
        category : req.body.category,
        name : req.body.name_pod_category,
        arr : req.body.arr,
        language : req.body.language
      });
      res.send('success!!!!')
}
function getCategoty(req, res) {
  var ref = firebase.database().ref('/promotion/category/');
  var category = [];
  ref.once("value", function(snapshot) {
    var key_id = 0;
   snapshot.forEach(function(childSnapshot) {
    var childData = childSnapshot.val();
    var key = Object.keys(snapshot.val())[key_id];
    var color=childData.color;
    var icon=childData.icon;
    var name=childData.name;
    var keys = Object.keys(childData);
    var cat = JSON.stringify({
      'id' : key,
      'name' : name,
      'icon' : icon,
      'color' : color
    })
    category.push(JSON.parse(cat))
    console.log(key);
    key_id++;
   });

   res.send(category)
  });

}

function getPodCategoty(req, res) {
  var ref = firebase.database().ref('/promotion/pod_category/');
  var categorys = [];
  ref.once("value", function(snapshot) {
    var key_id = 0;
   snapshot.forEach(function(childSnapshot) {
    var childData = childSnapshot.val();
    var key = Object.keys(snapshot.val())[key_id];
    var arr = childData.arr;
    var category = childData.category;
    var name = childData.name;
    var language = childData.language;
    var keys = Object.keys(childData);
    var cat = JSON.stringify({
      'id' : key,
      'name' : name,
      'category' : category,
      'language' : language,
      'arr' : arr
    })
    categorys.push(JSON.parse(cat))
    console.log(key);
    key_id++;
   });

   res.send(categorys)
  });

}

module.exports = promotion;
