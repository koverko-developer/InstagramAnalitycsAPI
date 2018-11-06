var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var firebase = require('firebase');
var Client = require('instagram-private-api').V1;
var db = require('../db');
var fs = require('fs');
var database = firebase.database();
var login = '';
var sessions = '';
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
  
  var userName = req.body.userName;
  var sessions = req.body.sessions;
  var id = req.body.id;
  var urlgen = req.body.urlgen;
  var csrftoken = req.body.csrftoken;
  var mid = req.body.mid;

  var fs = require('fs');
  var contents = fs.readFileSync(__dirname + "/cookies/koverko_dev1.json", 'utf8');
  console.log(contents);
  var d = contents;
  d = d.replace('koverko_dev', userName);
  d = d.replace('IGSC40fb8c41b0d1a7d458cf19afc0f426332f209771e516a73a8e620d8b27a0ec38%3AMeTkXTRKGVyyQvdy4JjsaU3lZH8HnIVe%3A%7B%22_auth_user_id%22%3A5972326347%2C%22_auth_user_backend%22%3A%22accounts.backends.CaseInsensitiveModelBackend%22%2C%22_auth_user_hash%22%3A%22%22%2C%22_platform%22%3A4%2C%22_token_ver%22%3A2%2C%22_token%22%3A%225972326347%3AiiKxdO7mlupOxpSfH4UxQ09hGWfn6BOc%3A1c3ea380af9f677aaee744a508ff5d6bd116caaf857673cfa1a99b45df6d935b%22%2C%22last_refreshed%22%3A1537559179.3596990108%7D', sessions);
  console.log(d);
  d = d.replace('5972326347', id);
  d = d.replace('1g3Mb0:qJ5-utpK2FsUL0O7kww_DEBnA2s', urlgen);
  d = d.replace('fIGKJZo9hlBvnRxJq89Qj0XY3I40X913', csrftoken);
  d = d.replace('W459kAABAAE1fIzRCKe4r0x1OPqL', mid);
  

  const file = fs.createWriteStream(__dirname + "/cookies/"+userName+".json");
  file.write(d)
  file.end();

  var device = new Client.Device(login);
  var storage = new Client.CookieFileStorage(__dirname + "/cookies/"+userName+".json");
  var session = new Client.Session(device, storage);


  session.getAccount()
            .then(function(account) {
            console.log('params acc')
            console.log(account.params)
            res.send(account.params)
            firebase.database().ref('/users/' + account.params.id).set({
                      id: account.params.id,
                      access_token: 'req.body.access_token',
                      username : account.params.username,
                      full_name : account.params.fullName,
                      profile_picture : account.params.picture,
                      cookie : '',
                    });
            })
}
module.exports = auth;
