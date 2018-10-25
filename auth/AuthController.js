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

  var token = req.body.access_token;
  var login = req.body.login;
  var pass = req.body.pass;

  var device = new Client.Device(login);
  var storage = new Client.CookieFileStorage(__dirname + "/cookies/"+login+".json");
  var session = new Client.Session(device, storage);
  //Client.Session.create(device, storage, login, pass);
  Client.Session.login(session, login, pass)      
    .then(function(session) {
        // Now you have a session, we can follow / unfollow, anything...
      // And we want to follow Instagram official profile
      session.getAccount()
            .then(function(account) {
            console.log(account.params)
            res.send(account.params)
            firebase.database().ref('/users/' + userId).set({
                      id: account.params.id,
                      access_token: 'req.body.access_token',
                      username : account.params.username,
                      full_name : account.params.fullName,
                      profile_picture : account.params.picture,
                      cookie : '',
                      login : login, 
                      pass : pass
                    });
            })

      return [session, Client.Account.searchForUser(session, 'clubvteme_by')]   
    })
    .spread(function(session, account) {
      return Client.Relationship.create(session, account.id);
    })
    .then(function(relationship) {
      console.log(relationship.params)
    })
}

function chekoutInF(req, res, body){
    //res.send(acc)
    //var str = JSON.stringify(body);
    sessions = req.body.cookie;

    var b = JSON.parse(body);
    let userId = b['data']['id'];
    let userName = b['data']['username'];
    login = userName;
    let userFName = b['data']['full_name'];
    let userPicture = b['data']['profile_picture'];
    //console.log(req.body.cookie);
    //
    //
    //
    // const file = fs.createWriteStream(__dirname + "/cookies/"+userName+".json");
    // file.write(getCookies())
    // file.end();

    firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
      var username = (snapshot.val() && snapshot.val().token) || 'Anonymous';
      if(username === 'Anonymous'){


          var fs = require('fs');
          var contents = fs.readFileSync(__dirname + "/cookies/koverko_dev1.json", 'utf8');
          console.log(contents);
            var d = contents;
            d = d.replace('koverko_dev', userName);
            d = d.replace('IGSC40fb8c41b0d1a7d458cf19afc0f426332f209771e516a73a8e620d8b27a0ec38%3AMeTkXTRKGVyyQvdy4JjsaU3lZH8HnIVe%3A%7B%22_auth_user_id%22%3A5972326347%2C%22_auth_user_backend%22%3A%22accounts.backends.CaseInsensitiveModelBackend%22%2C%22_auth_user_hash%22%3A%22%22%2C%22_platform%22%3A4%2C%22_token_ver%22%3A2%2C%22_token%22%3A%225972326347%3AiiKxdO7mlupOxpSfH4UxQ09hGWfn6BOc%3A1c3ea380af9f677aaee744a508ff5d6bd116caaf857673cfa1a99b45df6d935b%22%2C%22last_refreshed%22%3A1537559179.3596990108%7D', sessions);
            console.log(d);
            firebase.database().ref('/users/' + userId).set({
                id: userId,
                access_token: req.body.access_token,
                username : userName,
                full_name : userFName,
                profile_picture : userPicture,
                cookie : sessions
              });
            const file = fs.createWriteStream(__dirname + "/cookies/"+userName+".json");
            file.write(d)
            file.end();
            res.send(b)


      }else{
          res.send(b)
      }
    });
}


module.exports = auth;