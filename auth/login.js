var Client = require('instagram-private-api').V1;
var fs = require('fs');
var _DR = '/home/mobi-app/development/node/InstagramAnalitycs/cookie/';
var login = 'koverko_dev1';
var sessions = 'IGSCb200aa64d8af53de46db2dcd1bfe4017ede063b0257b50b90fa80081360b5b1d%3A8kFtnGltG1Oa5vNItcq9clT0dQT4DQvJ%3A%7B%22_auth_user_id%22%3A5972326347%2C%22_auth_user_backend%22%3A%22accounts.backends.CaseInsensitiveModelBackend%22%2C%22_auth_user_hash%22%3A%22%22%2C%22_platform%22%3A4%2C%22_token_ver%22%3A2%2C%22_token%22%3A%225972326347%3AEJe4TZmbA2WTgyAFPw2SxR1YT7BifozC%3A6434bbb6d1826d4faa46effaf49b2078d56e29374ad325c5fb66994300f7f2dc%22%2C%22last_refreshed%22%3A1536053156.3369805813%7D';
function setCookie(data) {
fs.writeFile(_DR+login+'.json', data , function(err) {
if(err) {
console.log('error');
}else {
console.log('finish');
}
});
}
function getCookies() {
return  var data = JSON.stringify (

      {
      "i.instagram.com": {
      "/": {
      "ds_user": {
      "key": "ds_user",
      "value": login,
      "expires": "2018-12-03T12:41:53.000Z",
      "maxAge": 7776000,
      "domain": "i.instagram.com",
      "path": "/",
      "hostOnly": true,
      "creation": "2018-09-04T12:41:54.109Z",
      "lastAccessed": "2018-09-04T12:41:58.527Z"
      },
      "shbid": {
      "key": "shbid",
      "value": "13534",
      "expires": "2018-09-11T12:41:53.000Z",
      "maxAge": 604800,
      "domain": "i.instagram.com",
      "path": "/",
      "hostOnly": true,
      "creation": "2018-09-04T12:41:54.111Z",
      "lastAccessed": "2018-09-04T12:41:58.527Z"
      },
      "shbts": {
      "key": "shbts",
      "value": "1536064913.8570933",
      "expires": "2018-09-11T12:41:53.000Z",
      "maxAge": 604800,
      "domain": "i.instagram.com",
      "path": "/",
      "hostOnly": true,
      "creation": "2018-09-04T12:41:54.113Z",
      "lastAccessed": "2018-09-04T12:41:58.527Z"
      },
      "rur": {
      "key": "rur",
      "value": "ASH",
      "domain": "i.instagram.com",
      "path": "/",
      "hostOnly": true,
      "creation": "2018-09-04T12:41:54.113Z",
      "lastAccessed": "2018-09-04T12:41:59.077Z"
      },
      "mid": {
      "key": "mid",
      "value": "W459kAABAAE1fIzRCKe4r0x1OPqL",
      "expires": "2028-09-01T12:41:53.000Z",
      "maxAge": 315360000,
      "domain": "i.instagram.com",
      "path": "/",
      "hostOnly": true,
      "creation": "2018-09-04T12:41:54.113Z",
      "lastAccessed": "2018-09-04T12:41:58.527Z"
      },
      "ds_user_id": {
      "key": "ds_user_id",
      "value": "5972326347",
      "expires": "2018-12-03T12:41:58.000Z",
      "maxAge": 7776000,
      "domain": "i.instagram.com",
      "path": "/",
      "hostOnly": true,
      "creation": "2018-09-04T12:41:54.114Z",
      "lastAccessed": "2018-09-04T12:41:59.079Z"
      },
      "urlgen": {
      "key": "urlgen",
      "value": "\"{\\\"178.120.72.207\\\": 6697}:1fxAec:70yBdczT8JHV4EHZbjTyp3mSyI4\"",
      "domain": "i.instagram.com",
      "path": "/",
      "hostOnly": true,
      "creation": "2018-09-04T12:41:54.114Z",
      "lastAccessed": "2018-09-04T12:41:59.080Z"
      },
      "sessionid": {
      "key": "sessionid",
      "value": sessions,
      "expires": "2018-12-03T12:41:53.000Z",
      "maxAge": 7776000,
      "domain": "i.instagram.com",
      "path": "/",
      "secure": true,
      "httpOnly": true,
      "hostOnly": true,
      "creation": "2018-09-04T12:41:54.115Z",
      "lastAccessed": "2018-09-04T12:41:58.527Z"
      },
      "mcd": {
      "key": "mcd",
      "value": "3",
      "expires": "2028-09-01T12:41:53.000Z",
      "domain": "i.instagram.com",
      "path": "/",
      "hostOnly": true,
      "creation": "2018-09-04T12:41:54.115Z",
      "lastAccessed": "2018-09-04T12:41:58.527Z"
      },
      "csrftoken": {
      "key": "csrftoken",
      "value": "fIGKJZo9hlBvnRxJq89Qj0XY3I40X913",
      "expires": "2019-09-03T12:41:58.000Z",
      "maxAge": 31449600,
      "domain": "i.instagram.com",
      "path": "/",
      "secure": true,
      "hostOnly": true,
      "creation": "2018-09-04T12:41:54.116Z",
      "lastAccessed": "2018-09-04T12:41:59.080Z"
      },
      "is_starred_enabled": {
      "key": "is_starred_enabled",
      "value": "yes",
      "expires": "2038-08-30T12:41:56.000Z",
      "maxAge": 630720000,
      "domain": "i.instagram.com",
      "path": "/",
      "hostOnly": true,
      "creation": "2018-09-04T12:41:56.662Z",
      "lastAccessed": "2018-09-04T12:41:58.527Z"
      },
      "igfl": {
      "key": "igfl",
      "value": login,
      "expires": "2018-09-05T12:41:56.000Z",
      "maxAge": 86400,
      "domain": "i.instagram.com",
      "path": "/",
      "hostOnly": true,
      "creation": "2018-09-04T12:41:56.664Z",
      "lastAccessed":

      "2018-09-04T12:41:58.527Z"
      }
      }
      }
      }

  );
}
setCookie(data)
