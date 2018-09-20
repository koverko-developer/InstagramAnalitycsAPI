var firebase = require('firebase');

var config = {
   apiKey: "AIzaSyCaufAWZ2LcRY2Ew2dGnjXcetcMA_TvaoM",
   authDomain: "insta-6f167.firebaseapp.com",
   databaseURL: "https://insta-6f167.firebaseio.com/",
   storageBucket: "insta-6f167.appspot.com"
 };

  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();
