var Client = require('instagram-private-api').V1;
var fs = require('fs');
var _ = require('lodash');
var Promise = require('bluebird');

var userName ='koverko_dev';
var dir = __dirname + "/cookies/"+userName+".json";
dir = dir.replace('user', 'auth');
var device = new Client.Device('koverko_dev1');
var storage = new Client.CookieFileStorage(dir);
var session = new Client.Session(device, storage)
var accountId = '5972326347'
//var feed = new Client.Feed.UserMedia(session, accountId);
var feed = new Client.Feed.UserMedia(session, accountId);


getCookie();
